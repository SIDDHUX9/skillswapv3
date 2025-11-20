'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Paperclip, 
  Image, 
  Phone, 
  Video, 
  MoreVertical,
  Circle,
  Check,
  CheckCheck
} from 'lucide-react'
import { useChat } from '@/contexts/chat-context'
import { formatDistanceToNow } from 'date-fns'

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { 
    currentRoom, 
    messages, 
    sendMessage, 
    typingStart, 
    typingStop, 
    isTyping,
    isConnected 
  } = useChat()
  
  const [message, setMessage] = useState('')
  const [isTypingLocal, setIsTypingLocal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isTypingLocal) {
      typingStart(currentRoom?.id || '')
    } else {
      typingStop(currentRoom?.id || '')
    }
  }, [isTypingLocal, currentRoom?.id, typingStart, typingStop])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (message.trim() && currentRoom) {
      sendMessage(message.trim())
      setMessage('')
      setIsTypingLocal(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line for shift+enter
      if (!isTypingLocal) {
        setIsTypingLocal(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          setIsTypingLocal(false)
        }, 1000)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    
    if (!isTypingLocal && e.target.value.trim()) {
      setIsTypingLocal(true)
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        setIsTypingLocal(false)
      }, 1000)
    }
  }

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const MessageStatusIcon = ({ status }: { status: 'sent' | 'delivered' | 'read' }) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  if (!currentRoom) {
    return (
      <Card className={`h-[600px] flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Send className="h-8 w-8" />
            </div>
          </div>
          <p className="text-lg font-medium mb-2">No chat selected</p>
          <p className="text-sm">Choose a conversation to start messaging</p>
        </div>
      </Card>
    )
  }

  const otherParticipant = currentRoom.participant1Id === 'current-user' 
    ? {
        name: currentRoom.participant2Name,
        avatar: currentRoom.participant2Avatar,
      }
    : {
        name: currentRoom.participant1Name,
        avatar: currentRoom.participant1Avatar,
      }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherParticipant.avatar} />
              <AvatarFallback>
                {otherParticipant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherParticipant.name}</CardTitle>
              {currentRoom.skillTitle && (
                <p className="text-sm text-muted-foreground">
                  About: {currentRoom.skillTitle}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Circle className={`h-2 w-2 fill-current ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
                {isTyping[currentRoom.id] && (
                  <span className="text-xs text-muted-foreground italic">
                    typing...
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.senderId === 'current-user'
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {msg.senderName}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.type === 'text' && (
                        <p className="text-sm break-words">{msg.content}</p>
                      )}
                      {msg.type === 'image' && (
                        <div className="space-y-2">
                          <img 
                            src={msg.content} 
                            alt="Shared image"
                            className="rounded max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatMessageTime(msg.timestamp)}</span>
                      {isOwn && <MessageStatusIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {isTyping[currentRoom.id] && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-current text-muted-foreground animate-pulse" />
                    <Circle className="h-2 w-2 fill-current text-muted-foreground animate-pulse delay-75" />
                    <Circle className="h-2 w-2 fill-current text-muted-foreground animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Message Input */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || !isConnected}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}