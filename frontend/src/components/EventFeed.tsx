import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar, MapPin, Users, Clock, Heart, MessageCircle, Share, Bot, CalendarPlus, Check } from 'lucide-react';
import { UserProfile } from '../App';
import { CalendarEvent } from './Calendar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SmallDecorationIllustration, EventsIllustration } from './Illustrations';
import { EVENTS_DATA, Event, filterEventsByInterests } from './EventsData';
import { eventsAPI } from '../utils/api';

interface EventFeedProps {
  userProfile: UserProfile;
  onSwitchToAIChat?: () => void;
  calendarEvents: CalendarEvent[];
  eventRSVPs: Record<string, { isInterested: boolean; isAttending: boolean }>;
  onAddToCalendar: (event: Event) => void;
  onUpdateRSVP: (eventId: string, rsvpStatus: { isInterested: boolean; isAttending: boolean }) => void;
  userId: string;
}

export function EventFeed({ userProfile, onSwitchToAIChat, calendarEvents, eventRSVPs, onAddToCalendar, onUpdateRSVP, userId }: EventFeedProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const apiEvents = await eventsAPI.getEvents(userId);
        setEvents(apiEvents);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err?.error || 'Failed to load events');
        // Fallback to static data if API fails
        setEvents(EVENTS_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEvents();
    }
  }, [userId]);
  
  // Filter events based on user interests
  const filteredEvents = useMemo(() => {
    return filterEventsByInterests(events, userProfile.interests);
  }, [events, userProfile.interests]);

  // Show filtered events if user has interests and matches found, otherwise show all events
  const displayEvents = userProfile.interests.length > 0 && filteredEvents.length > 0 ? filteredEvents : events;

  // Helper function to check if event is in calendar
  const isEventInCalendar = (eventId: string) => {
    return calendarEvents.some(calEvent => calEvent.id === eventId);
  };

  const handleInterest = (eventId: string) => {
    const currentRSVP = eventRSVPs[eventId] || { isInterested: false, isAttending: false };
    const newRSVP = {
      ...currentRSVP,
      isInterested: !currentRSVP.isInterested
    };
    onUpdateRSVP(eventId, newRSVP);
  };

  const handleAttend = (eventId: string) => {
    const currentRSVP = eventRSVPs[eventId] || { isInterested: false, isAttending: false };
    const newRSVP = {
      ...currentRSVP,
      isAttending: !currentRSVP.isAttending,
      isInterested: true // If attending, also mark as interested
    };
    onUpdateRSVP(eventId, newRSVP);
    
    // Update local event attendance count
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            attendees: currentRSVP.isAttending ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-muted-foreground">Showing fallback events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto texture-paper relative">
      {/* Background decorations */}
      <div className="absolute top-20 right-4 opacity-15 z-0">
        <SmallDecorationIllustration className="w-12 h-12" />
      </div>
      <div className="absolute top-80 left-2 opacity-10 z-0">
        <SmallDecorationIllustration className="w-8 h-8" />
      </div>
      
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10 texture-organic shadow-natural">
        <div className="flex items-center gap-3 mb-2">
          <EventsIllustration className="w-8 h-6" />
          <h2 className="text-lg text-foreground">
            {userProfile.interests.length > 0 && filteredEvents.length > 0 
              ? "Events Matching Your Interests" 
              : "AI-Curated Events"
            }
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {userProfile.interests.length > 0 && filteredEvents.length > 0 
            ? `Found ${filteredEvents.length} events matching: ${userProfile.interests.slice(0, 3).join(', ')}${userProfile.interests.length > 3 ? '...' : ''}`
            : "Events organized just for your community"
          }
        </p>
        <div className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full mt-2" />
      </div>
      
      <div className="p-4 space-y-6 relative z-10">
        {displayEvents.map((event, index) => (
          <Card key={event.id} className={`overflow-hidden shadow-leaf grass-decoration border-organic transition-all duration-300 hover:shadow-natural hover:scale-[1.02] ${
            index % 2 === 0 ? 'texture-organic' : 'texture-grass'
          }`}>
            {event.image && (
              <div className="relative">
                <ImageWithFallback 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs border-organic">
                    {event.date}
                  </Badge>
                </div>
                {event.attendees >= event.maxAttendees && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500/90 backdrop-blur-sm text-white text-xs">
                      Full
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground mb-2 leading-tight">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event.attendees}/{event.maxAttendees} attending</span>
                    {event.attendees >= event.maxAttendees * 0.8 && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        Almost Full!
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className={`text-xs border-organic ${
                        tagIndex % 3 === 0 ? 'bg-primary/10 text-primary' : 
                        tagIndex % 3 === 1 ? 'bg-orange/10 text-orange border-orange/20' : 
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border-organic">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary/20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{event.organizer}</p>
                      <p className="text-xs text-muted-foreground">by Touch Grass AI</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant={(eventRSVPs[event.id]?.isInterested || false) ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-9 text-xs border-organic transition-all duration-200 ${
                      (eventRSVPs[event.id]?.isInterested || false) ? 'shadow-natural bg-gradient-to-r from-orange to-orange-dark' : 'hover:shadow-natural border-orange/30 hover:bg-orange/5'
                    }`}
                    onClick={() => handleInterest(event.id)}
                  >
                    <Heart className={`w-3 h-3 mr-2 ${(eventRSVPs[event.id]?.isInterested || false) ? 'fill-current' : ''}`} />
                    {(eventRSVPs[event.id]?.isInterested || false) ? 'Interested' : 'Interest'}
                    {(eventRSVPs[event.id]?.isInterested || false) && <div className="ml-1 w-1 h-1 bg-orange-light rounded-full animate-pulse" />}
                  </Button>
                  
                  <Button
                    variant={(eventRSVPs[event.id]?.isAttending || false) ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-9 text-xs border-organic transition-all duration-200 ${
                      (eventRSVPs[event.id]?.isAttending || false) ? 'shadow-natural bg-green-600 hover:bg-green-700' : 'hover:shadow-natural'
                    }`}
                    onClick={() => handleAttend(event.id)}
                    disabled={event.attendees >= event.maxAttendees && !(eventRSVPs[event.id]?.isAttending || false)}
                  >
                    {(eventRSVPs[event.id]?.isAttending || false) ? 'Attending ✓' : event.attendees >= event.maxAttendees ? 'Full' : 'RSVP'}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 px-3 text-xs transition-colors ${
                      isEventInCalendar(event.id)
                        ? 'text-primary hover:text-primary/80' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => {
                      if (!isEventInCalendar(event.id)) {
                        onAddToCalendar(event);
                        // Simple feedback - you could enhance this with a toast library
                        console.log(`Added "${event.title}" to calendar`);
                      }
                    }}
                    disabled={isEventInCalendar(event.id)}
                  >
                    {isEventInCalendar(event.id) ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        In Calendar
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-3 h-3 mr-1" />
                        Add to Calendar
                      </>
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {displayEvents.length === 0 && (
          <Card className="p-6 text-center border-dashed border-2 border-primary/20 texture-stone">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">No events match your interests yet</p>
                <p className="text-xs text-muted-foreground">Tell the AI what you'd like to do, and we'll organize something!</p>
              </div>
              <Button variant="outline" size="sm" className="border-organic shadow-natural">
                Chat with AI
              </Button>
            </div>
          </Card>
        )}
        
        {displayEvents.length > 0 && (
          <Card className="p-6 text-center border-dashed border-2 border-primary/20 texture-stone">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">No more events to show</p>
                <p className="text-xs text-muted-foreground">Want to find events that match your interests?</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-organic shadow-natural"
                onClick={onSwitchToAIChat || undefined}
              >
                Talk to AI
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}