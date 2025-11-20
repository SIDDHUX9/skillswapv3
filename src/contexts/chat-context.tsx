'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'read'
  bookingId?: string
  skillId?: string
}

export interface ChatRoom {
  id: string
  participant1Id: string
  participant2Id: string
  participant1Name: string
  participant2Name: string
  participant1Avatar?: string
  participant2Avatar?: string
  lastMessage?: Message
  createdAt: Date
  updatedAt: Date
  bookingId?: string
  skillId?: string
  skillTitle?: string
}

interface ChatContextType {
  socket: Socket | null
  isConnected: boolean
  chatRooms: ChatRoom[]
  currentRoom: ChatRoom | null
  messages: Message[]
  loading: boolean
  error: string | null
  
  // Actions
  connect: () => void
  disconnect: () => void
  sendMessage: (content: string, type?: 'text' | 'image' | 'file') => void
  markAsRead: (messageId: string) => void
  createChatRoom: (participantId: string, participantName: string, bookingId?: string, skillId?: string) => Promise<void>
  loadChatRooms: () => Promise<void>
  loadMessages: (roomId: string) => Promise<void>
  setCurrentRoom: (room: ChatRoom | null) => void
  typingStart: (roomId: string) => void
  typingStop: (roomId: string) => void
  isTyping: Record<string, boolean>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({})

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message])
      
      // Update chat room's last message
      setChatRooms(prev => prev.map(room => 
        room.id === message.senderId || room.id === message.receiverId
          ? { ...room, lastMessage: message, updatedAt: new Date() }
          : room
      ))
    })

    socket.on('message_read', (messageId: string) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      ))
    })

    socket.on('typing_start', (data: { roomId: string, userId: string }) => {
      setIsTyping(prev => ({ ...prev, [data.roomId]: true }))
    })

    socket.on('typing_stop', (data: { roomId: string, userId: string }) => {
      setIsTyping(prev => ({ ...prev, [data.roomId]: false }))
    })

    socket.on('error', (error: string) => {
      setError(error)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('receive_message')
      socket.off('message_read')
      socket.off('typing_start')
      socket.off('typing_stop')
      socket.off('error')
    }
  }, [socket])

  const connect = () => {
    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      })
      
      setSocket(newSocket)
    } catch (error) {
      console.error('Failed to connect to chat server:', error)
      setError('Failed to connect to chat server')
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }

  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!socket || !currentRoom || !content.trim()) return

    const message: Omit<Message, 'id' | 'timestamp'> = {
      senderId: 'current-user', // This should come from auth context
      senderName: 'Current User', // This should come from auth context
      receiverId: currentRoom.participant1Id === 'current-user' 
        ? currentRoom.participant2Id 
        : currentRoom.participant1Id,
      content: content.trim(),
      type,
      status: 'sent',
      bookingId: currentRoom.bookingId,
      skillId: currentRoom.skillId,
    }

    socket.emit('send_message', {
      roomId: currentRoom.id,
      message,
    })

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, optimisticMessage])
    
    // Update chat room's last message
    setChatRooms(prev => prev.map(room => 
      room.id === currentRoom.id
        ? { ...room, lastMessage: optimisticMessage, updatedAt: new Date() }
        : room
    ))
  }

  const markAsRead = (messageId: string) => {
    if (!socket) return
    socket.emit('mark_as_read', { messageId })
  }

  const typingStart = (roomId: string) => {
    if (!socket) return
    socket.emit('typing_start', { roomId })
  }

  const typingStop = (roomId: string) => {
    if (!socket) return
    socket.emit('typing_stop', { roomId })
  }

  const createChatRoom = async (participantId: string, participantName: string, bookingId?: string, skillId?: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          participantName,
          bookingId,
          skillId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create chat room')

      const newRoom = await response.json()
      setChatRooms(prev => [newRoom, ...prev])
      setCurrentRoom(newRoom)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create chat room')
    } finally {
      setLoading(false)
    }
  }

  const loadChatRooms = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat/rooms')
      if (!response.ok) throw new Error('Failed to load chat rooms')

      const rooms = await response.json()
      setChatRooms(rooms)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load chat rooms')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`)
      if (!response.ok) throw new Error('Failed to load messages')

      const roomMessages = await response.json()
      setMessages(roomMessages)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSetCurrentRoom = async (room: ChatRoom | null) => {
    setCurrentRoom(room)
    if (room) {
      await loadMessages(room.id)
    } else {
      setMessages([])
    }
  }

  return (
    <ChatContext.Provider value={{
      socket,
      isConnected,
      chatRooms,
      currentRoom,
      messages,
      loading,
      error,
      connect,
      disconnect,
      sendMessage,
      markAsRead,
      createChatRoom,
      loadChatRooms,
      loadMessages,
      setCurrentRoom: handleSetCurrentRoom,
      typingStart,
      typingStop,
      isTyping,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}