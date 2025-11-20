'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MessageCircle, 
  Circle,
  Plus
} from 'lucide-react'
import { useChat } from '@/contexts/chat-context'
import { formatDistanceToNow } from 'date-fns'

interface ChatRoomsListProps {
  className?: string
}

export function ChatRoomsList({ className }: ChatRoomsListProps) {
  const { 
    chatRooms, 
    currentRoom, 
    setCurrentRoom, 
    loading, 
    isConnected,
    createChatRoom
  } = useChat()
  
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredRooms = chatRooms.filter(room => {
    const query = searchQuery.toLowerCase()
    const participantName = room.participant1Id === 'current-user' 
      ? room.participant2Name.toLowerCase()
      : room.participant1Name.toLowerCase()
    const skillTitle = room.skillTitle?.toLowerCase() || ''
    
    return participantName.includes(query) || skillTitle.includes(query)
  })

  const handleRoomClick = (room: any) => {
    setCurrentRoom(room)
  }

  const handleNewChat = () => {
    // This would open a modal or navigate to a page to start a new chat
    // For now, we'll just create a sample chat
    createChatRoom('new-user', 'New User')
  }

  const getOtherParticipant = (room: any) => {
    return room.participant1Id === 'current-user' 
      ? {
          name: room.participant2Name,
          avatar: room.participant2Avatar,
        }
      : {
          name: room.participant1Name,
          avatar: room.participant1Avatar,
        }
  }

  const getLastMessagePreview = (message: any) => {
    if (!message) return 'No messages yet'
    
    if (message.type === 'image') {
      return '📷 Image'
    }
    
    if (message.type === 'file') {
      return '📎 File'
    }
    
    return message.content.length > 30 
      ? message.content.substring(0, 30) + '...'
      : message.content
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {isConnected && (
              <Circle className="h-3 w-3 fill-current text-green-500" />
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      {/* Chat Rooms List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading conversations...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchQuery && (
                <Button variant="outline" size="sm" className="mt-2" onClick={handleNewChat}>
                  Start a conversation
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredRooms.map((room) => {
                const participant = getOtherParticipant(room)
                const isActive = currentRoom?.id === room.id
                
                return (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>
                            {participant.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isConnected && (
                          <Circle className="absolute -bottom-0 -right-0 h-3 w-3 fill-current text-green-500 border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-medium text-sm truncate ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}>
                            {participant.name}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {room.lastMessage 
                              ? formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: true })
                              : formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })
                            }
                          </span>
                        </div>
                        
                        {room.skillTitle && (
                          <Badge variant="secondary" className="text-xs mb-1">
                            {room.skillTitle}
                          </Badge>
                        )}
                        
                        <p className="text-xs text-muted-foreground truncate">
                          {getLastMessagePreview(room.lastMessage)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}