import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

// GET /api/chat/rooms/[id]/messages - Get messages for a specific room
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id
    const userId = 'current-user' // This should come from authentication
    
    const db = new DatabaseService()
    await db.connect()
    
    // Verify user has access to this room
    const roomAccess = await db.query(`
      SELECT id FROM chat_rooms 
      WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)
    `, [roomId, userId])
    
    if (roomAccess.length === 0) {
      await db.disconnect()
      return NextResponse.json(
        { error: 'Access denied to this chat room' },
        { status: 403 }
      )
    }
    
    // Get messages for the room
    const messages = await db.query(`
      SELECT 
        id,
        sender_id,
        sender_name,
        receiver_id,
        content,
        type,
        status,
        timestamp,
        booking_id,
        skill_id
      FROM messages 
      WHERE room_id = $1 
      ORDER BY timestamp ASC
    `, [roomId])
    
    // Transform the data to match our interface
    const transformedMessages = messages.map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      senderName: msg.sender_name,
      receiverId: msg.receiver_id,
      content: msg.content,
      type: msg.type,
      status: msg.status,
      timestamp: msg.timestamp,
      bookingId: msg.booking_id,
      skillId: msg.skill_id,
    }))
    
    await db.disconnect()
    
    return NextResponse.json(transformedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat/rooms/[id]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id
    const { content, type, receiverId, senderName } = await request.json()
    const userId = 'current-user' // This should come from authentication
    
    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Content and receiver ID are required' },
        { status: 400 }
      )
    }
    
    const db = new DatabaseService()
    await db.connect()
    
    // Verify user has access to this room
    const roomAccess = await db.query(`
      SELECT id FROM chat_rooms 
      WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)
    `, [roomId, userId])
    
    if (roomAccess.length === 0) {
      await db.disconnect()
      return NextResponse.json(
        { error: 'Access denied to this chat room' },
        { status: 403 }
      )
    }
    
    // Create new message
    const result = await db.query(`
      INSERT INTO messages (
        room_id, sender_id, sender_name, receiver_id, content, type, status, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [
      roomId,
      userId,
      senderName || 'You',
      receiverId,
      content,
      type || 'text',
      'sent'
    ])
    
    // Update room's updated_at timestamp
    await db.query(`
      UPDATE chat_rooms SET updated_at = NOW() WHERE id = $1
    `, [roomId])
    
    const newMessage = {
      id: result[0].id,
      senderId: result[0].sender_id,
      senderName: result[0].sender_name,
      receiverId: result[0].receiver_id,
      content: result[0].content,
      type: result[0].type,
      status: result[0].status,
      timestamp: result[0].timestamp,
      bookingId: result[0].booking_id,
      skillId: result[0].skill_id,
    }
    
    await db.disconnect()
    
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}