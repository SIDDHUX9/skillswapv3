'use client'

import React, { useEffect } from 'react'
import { ChatRoomsList } from './chat-rooms-list'
import { ChatInterface } from './chat-interface'
import { useChat } from '@/contexts/chat-context'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { MessageCircle, RefreshCw } from 'lucide-react'

interface ChatContainerProps {
  className?: string
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { 
    isConnected, 
    loading, 
    error, 
    loadChatRooms, 
    connect, 
    disconnect 
  } = useChat()

  useEffect(() => {
    if (isConnected) {
      loadChatRooms()
    }
  }, [isConnected, loadChatRooms])

  const handleReconnect = () => {
    disconnect()
    setTimeout(() => {
      connect()
    }, 1000)
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <Alert variant="destructive">
          <MessageCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Failed to connect to chat service: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReconnect}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    )
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px] ${className}`}>
      {/* Chat Rooms List - Takes 1/3 on large screens */}
      <div className="lg:col-span-1">
        <ChatRoomsList />
      </div>
      
      {/* Chat Interface - Takes 2/3 on large screens */}
      <div className="lg:col-span-2">
        <ChatInterface />
      </div>
    </div>
  )
}