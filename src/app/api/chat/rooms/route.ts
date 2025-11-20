import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

// GET /api/chat/rooms - Get user's chat rooms
export async function GET(request: NextRequest) {
  try {
    const userId = 'current-user' // This should come from authentication
    
    const db = new DatabaseService()
    await db.connect()
    
    // Get chat rooms where user is a participant
    const rooms = await db.query(`
      SELECT 
        cr.*,
        s.title as skill_title,
        u1.name as participant1_name,
        u1.avatar as participant1_avatar,
        u2.name as participant2_name,
        u2.avatar as participant2_avatar,
        lm.content as last_message_content,
        lm.type as last_message_type,
        lm.timestamp as last_message_timestamp,
        lm.sender_id as last_message_sender_id,
        lm.sender_name as last_message_sender_name,
        lm.status as last_message_status
      FROM chat_rooms cr
      LEFT JOIN skills s ON cr.skill_id = s.id
      LEFT JOIN users u1 ON cr.participant1_id = u1.id
      LEFT JOIN users u2 ON cr.participant2_id = u2.id
      LEFT JOIN messages lm ON cr.id = lm.room_id AND lm.id = (
        SELECT MAX(id) FROM messages WHERE room_id = cr.id
      )
      WHERE cr.participant1_id = $1 OR cr.participant2_id = $1
      ORDER BY cr.updated_at DESC
    `, [userId])
    
    // Transform the data to match our interface
    const transformedRooms = rooms.map((room: any) => ({
      id: room.id,
      participant1Id: room.participant1_id,
      participant2Id: room.participant2_id,
      participant1Name: room.participant1_name,
      participant2Name: room.participant2_name,
      participant1Avatar: room.participant1_avatar,
      participant2Avatar: room.participant2_avatar,
      createdAt: room.created_at,
      updatedAt: room.updated_at,
      bookingId: room.booking_id,
      skillId: room.skill_id,
      skillTitle: room.skill_title,
      lastMessage: room.last_message_content ? {
        id: room.last_message_id,
        senderId: room.last_message_sender_id,
        senderName: room.last_message_sender_name,
        receiverId: room.last_message_sender_id === room.participant1_id ? room.participant2_id : room.participant1_id,
        content: room.last_message_content,
        type: room.last_message_type,
        status: room.last_message_status,
        timestamp: room.last_message_timestamp,
      } : null,
    }))
    
    await db.disconnect()
    
    return NextResponse.json(transformedRooms)
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
      { status: 500 }
    )
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const { participantId, participantName, bookingId, skillId } = await request.json()
    const userId = 'current-user' // This should come from authentication
    
    if (!participantId || !participantName) {
      return NextResponse.json(
        { error: 'Participant ID and name are required' },
        { status: 400 }
      )
    }
    
    const db = new DatabaseService()
    await db.connect()
    
    // Check if chat room already exists
    const existingRoom = await db.query(`
      SELECT id FROM chat_rooms 
      WHERE (participant1_id = $1 AND participant2_id = $2) 
         OR (participant1_id = $2 AND participant2_id = $1)
    `, [userId, participantId])
    
    if (existingRoom.length > 0) {
      await db.disconnect()
      return NextResponse.json(
        { error: 'Chat room already exists' },
        { status: 409 }
      )
    }
    
    // Create new chat room
    const result = await db.query(`
      INSERT INTO chat_rooms (participant1_id, participant2_id, booking_id, skill_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [userId, participantId, bookingId, skillId])
    
    // Get participant details
    const userResult = await db.query(`
      SELECT name, avatar FROM users WHERE id = $1
    `, [userId])
    
    const newRoom = {
      id: result[0].id,
      participant1Id: result[0].participant1_id,
      participant2Id: result[0].participant2_id,
      participant1Name: userResult[0]?.name || 'You',
      participant2Name: participantName,
      participant1Avatar: userResult[0]?.avatar,
      participant2Avatar: null,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at,
      bookingId: result[0].booking_id,
      skillId: result[0].skill_id,
    }
    
    await db.disconnect()
    
    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    )
  }
}