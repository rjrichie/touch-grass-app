import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Bot, User, Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';
import { UserProfile } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SmallDecorationIllustration, AIBrainIllustration } from './Illustrations';
import { EVENTS_DATA, Event, findEventsByKeywords } from './EventsData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  eventProposal?: {
    title: string;
    description: string;
    suggestedTime: string;
    location: string;
    matchedUsers: number;
    confidence: number;
  };
}

interface AIChatProps {
  userProfile: UserProfile;
}

export function AIChat({ userProfile }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hey ${userProfile.name}! 👋 I'm your Touch Grass AI assistant. I'm here to help you step outside your comfort zone and discover real connections through events that match your interests and preferences. 

Just tell me what you'd like to do - for example:
• "I want to watch the football game this Saturday"
• "Looking for a study group for CS 2110"
• "Want to find people to go to a party with"

I'll find other students with similar preferences and help coordinate the perfect event for everyone!`,
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const simulateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Define keywords for different activity types
    const activityKeywords = {
      hike: ['hike', 'hiking', 'trail', 'walk', 'nature', 'outdoor'],
      sports: ['football', 'game', 'sport', 'watch party', 'gt', 'uga'],
      study: ['study', 'cs', '2110', 'academic', 'homework', 'exam'],
      social: ['party', 'social', 'mixer', 'friends', 'meet people'],
      yoga: ['yoga', 'meditation', 'zen', 'peaceful', 'relaxation'],
      cooking: ['cook', 'food', 'recipe', 'kitchen', 'chef'],
      gaming: ['game', 'board', 'strategy', 'cards', 'play'],
      music: ['music', 'jam', 'acoustic', 'guitar', 'sing'],
      art: ['art', 'paint', 'draw', 'creative', 'artistic'],
      tech: ['tech', 'coding', 'hackathon', 'programming', 'ai'],
      movies: ['movie', 'film', 'cinema', 'watch'],
      reading: ['book', 'read', 'literature', 'club'],
      dance: ['dance', 'salsa', 'movement'],
      photography: ['photo', 'camera', 'picture', 'photography'],
      travel: ['travel', 'trip', 'vacation', 'adventure']
    };
    
    // Find matching events based on keywords
    let recommendedEvent: Event | null = null;
    let activityType = '';
    
    for (const [activity, keywords] of Object.entries(activityKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        const matchingEvents = findEventsByKeywords(EVENTS_DATA, keywords);
        if (matchingEvents.length > 0) {
          recommendedEvent = matchingEvents[0]; // Get the first match
          activityType = activity;
          break;
        }
      }
    }
    
    // If we found a matching event, recommend it specifically
    if (recommendedEvent) {
      const responses = {
        hike: "Perfect! I found a hiking event that matches what you're looking for. This is a great way to start your day and meet fellow outdoor enthusiasts:",
        sports: "Great choice! I found the perfect sports event for you. Based on your interests, here's what I've found:",
        study: "Excellent! I found a study group that aligns with your academic needs. Here's what I can arrange:",
        social: "I understand you're looking for social events! I found a perfect match for meeting new people:",
        yoga: "Wonderful! I found a peaceful yoga session that would be perfect for relaxation and wellness:",
        cooking: "Amazing! I found a hands-on cooking experience where you can learn new skills and meet fellow food enthusiasts:",
        gaming: "Great choice! I found a fun gaming event where you can discover new games and meet fellow strategists:",
        music: "Perfect! I found a music event where you can express your creativity and connect with other musicians:",
        art: "Wonderful! I found an artistic workshop where you can explore your creativity and meet fellow artists:",
        tech: "Excellent! I found a technology event that matches your interests perfectly:",
        movies: "Great idea! I found a movie event that would be perfect for a relaxing evening:",
        reading: "Perfect! I found a book club that aligns with your literary interests:",
        dance: "Wonderful! I found a dance workshop that would be perfect for learning and having fun:",
        photography: "Great choice! I found a photography event where you can explore campus and meet fellow photographers:",
        travel: "Excellent! I found a travel planning event where you can connect with fellow adventurers:"
      };
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: responses[activityType as keyof typeof responses] || "I found an event that matches your request perfectly:",
        timestamp: new Date(),
        eventProposal: {
          title: recommendedEvent.title,
          description: recommendedEvent.description,
          suggestedTime: `${recommendedEvent.date}, ${recommendedEvent.time}`,
          location: recommendedEvent.location,
          matchedUsers: recommendedEvent.attendees,
          confidence: 92
        }
      };
    }
    
    // Fallback: suggest events based on user interests
    const userInterestEvents = EVENTS_DATA.filter(event => 
      event.tags.some(tag => 
        userProfile.interests.some(interest => 
          interest.toLowerCase() === tag.toLowerCase()
        )
      )
    );
    
    if (userInterestEvents.length > 0) {
      const suggestedEvent = userInterestEvents[0];
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `I'm processing your request for "${userMessage}"! Based on your interests in ${userProfile.interests.slice(0, 2).join(' and ')}, I found this event that might interest you:`,
        timestamp: new Date(),
        eventProposal: {
          title: suggestedEvent.title,
          description: suggestedEvent.description,
          suggestedTime: `${suggestedEvent.date}, ${suggestedEvent.time}`,
          location: suggestedEvent.location,
          matchedUsers: suggestedEvent.attendees,
          confidence: 85
        }
      };
    }
    
    // Final fallback: general response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: `I'm processing your request for "${userMessage}"! Based on your profile preferences, here are some general event suggestions I can organize:

• Study groups for ${userProfile.interests.includes('Technology') ? 'CS/tech courses' : 'academic subjects'}
• Social mixers matching your ${userProfile.preferences.groupSize} group preference
• Sports watch parties or recreational activities
• Interest-based meetups for ${userProfile.interests.slice(0, 2).join(' and ')}

Would you like me to set up any of these, or do you have something more specific in mind? Just let me know!`,
      timestamp: new Date()
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time - much faster response
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleConfirmEvent = (eventProposal: any) => {
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `🎉 Awesome! I've confirmed the "${eventProposal.title}" event. Notifications have been sent to all ${eventProposal.matchedUsers} matched participants. 

You'll receive a calendar invite and reminder 2 hours before the event. The other participants are excited to meet you!

Is there anything else you'd like to organize?`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground">Touch Grass AI</h3>
            <p className="text-sm text-muted-foreground">Your personal connection guide</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'ai' && (
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
              <Card className={`p-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                
                {message.eventProposal && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h4 className="text-foreground">{message.eventProposal.title}</h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{message.eventProposal.description}</p>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {message.eventProposal.suggestedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {message.eventProposal.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {message.eventProposal.matchedUsers} interested students
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {message.eventProposal.confidence}% match confidence
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => handleConfirmEvent(message.eventProposal)}
                        className="h-7 px-3 text-xs"
                      >
                        Confirm Event
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
              
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.type === 'user' && (
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-muted">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="p-3 bg-card">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell me what event you'd like to organize..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}