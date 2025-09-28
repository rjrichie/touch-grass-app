import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, ArrowLeft, Clock, Users, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../App';

interface GroupChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  participants: Array<{
    id: string;
    name: string;
    year: string;
  }>;
}

interface GroupChatProps {
  userProfile: UserProfile;
  eventDetails: EventDetails;
  onBack: () => void;
}

export function GroupChat({ userProfile, eventDetails, onBack }: GroupChatProps) {
  const [messages, setMessages] = useState<GroupChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      username: 'Touch Grass AI',
      content: `Welcome to the group chat for "${eventDetails.title}"! 🌱\n\nThis chat will help you coordinate with other attendees. Remember to be respectful and follow community guidelines. Have fun getting to know each other!`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'system'
    },
    {
      id: '2',
      userId: 'sarah_j',
      username: 'Sarah J',
      content: 'Hey everyone! Really excited for this event tomorrow. Should we meet up beforehand?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'message'
    },
    {
      id: '3',
      userId: 'mike_cs',
      username: 'Mike CS',
      content: 'Sounds good! I can be there a few minutes early if anyone wants to grab coffee first ☕',
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
      type: 'message'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Calculate time until chat expires (end of event day)
  useEffect(() => {
    const updateTimeLeft = () => {
      const eventDate = new Date(eventDetails.date);
      const endOfEventDay = new Date(eventDate);
      endOfEventDay.setHours(23, 59, 59, 999);
      
      const now = new Date();
      const timeDiff = endOfEventDay.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        setTimeLeft(`${days}d ${remainingHours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [eventDetails.date]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: GroupChatMessage = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: userProfile.name,
      content: inputValue,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate other users responding occasionally
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          "Great point!",
          "I agree! See you there 👍",
          "Thanks for sharing that!",
          "Looking forward to it!",
          "Same here! 🌟"
        ];
        
        const mockUsers = ['Alex T', 'Emma S', 'Jordan K', 'Taylor M'];
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const mockMessage: GroupChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: randomUser.toLowerCase().replace(' ', '_'),
          username: randomUser,
          content: randomResponse,
          timestamp: new Date(),
          type: 'message'
        };
        
        setMessages(prev => [...prev, mockMessage]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserColor = (userId: string) => {
    const colors = [
      'bg-primary/10 text-primary',
      'bg-chart-2/10 text-chart-2',
      'bg-chart-3/10 text-chart-3',
      'bg-chart-4/10 text-chart-4',
      'bg-chart-5/10 text-chart-5'
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h3 className="text-foreground">{eventDetails.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {eventDetails.date} at {eventDetails.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {eventDetails.participants.length} participants
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              Chat expires in
            </div>
            <Badge variant={timeLeft === 'Expired' ? 'destructive' : 'secondary'} className="text-xs">
              {timeLeft === 'Expired' ? (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Expired
                </div>
              ) : (
                timeLeft
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Event Info Card */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <Card className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{eventDetails.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {eventDetails.location}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'system' ? 'justify-center' : message.userId === 'current_user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'system' ? (
              <Card className="max-w-md p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs text-primary">Touch Grass AI</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{message.content}</p>
              </Card>
            ) : (
              <>
                {message.userId !== 'current_user' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className={getUserColor(message.userId)}>
                      {getUserInitials(message.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-md ${message.userId === 'current_user' ? 'order-first' : ''}`}>
                  {message.userId !== 'current_user' && (
                    <p className="text-xs text-muted-foreground mb-1 px-1">{message.username}</p>
                  )}
                  <Card className={`p-3 ${message.userId === 'current_user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </Card>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.userId === 'current_user' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(message.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-4">
        {timeLeft === 'Expired' ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">This chat has expired</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message the group..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}