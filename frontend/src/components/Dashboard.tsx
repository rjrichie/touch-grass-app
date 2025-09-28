import React, { useState } from 'react';
import { AIChat } from './AIChat';
import { EventFeed } from './EventFeed';
import { Calendar, CalendarEvent } from './Calendar';
import { ProfileSidebar } from './ProfileSidebar';
import { EventConfirmationNotification } from './EventConfirmationNotification';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, Menu, X, Calendar as CalendarIcon, MessageCircle, CalendarDays } from 'lucide-react';
import { UserProfile } from '../App';
import { Event } from './EventsData';
import { SmallDecorationIllustration } from './Illustrations';

interface DashboardProps {
  userProfile: UserProfile;
  onProfileEdit: () => void;
  onLogout: () => void;
  onJoinGroupChat?: (eventId: string) => void;
  calendarEvents: CalendarEvent[];
  eventRSVPs: Record<string, { isInterested: boolean; isAttending: boolean }>;
  onAddToCalendar: (event: Event) => void;
  onRemoveFromCalendar: (eventId: string) => void;
  onExportCalendar: () => void;
  onUpdateRSVP: (eventId: string, rsvpStatus: { isInterested: boolean; isAttending: boolean }) => void;
  userId: string;
}

export function Dashboard({ userProfile, onProfileEdit, onLogout, onJoinGroupChat, calendarEvents, eventRSVPs, onAddToCalendar, onRemoveFromCalendar, onExportCalendar, onUpdateRSVP, userId }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Football Watch Party Confirmed!',
      message: '5 people are interested in watching the Georgia Tech vs UGA game this Saturday',
      time: '2 hours ago',
      type: 'event-confirmed'
    },
    {
      id: 2,
      title: 'New Event Match',
      message: 'Study group for CS 2110 - 3 people with similar preferences found',
      time: '5 hours ago',
      type: 'match-found'
    }
  ]);

  const [eventConfirmation, setEventConfirmation] = useState({
    id: 'confirm-1',
    title: 'GT vs UGA Watch Party',
    date: 'Tomorrow, Nov 25',
    time: '3:30 PM - 6:30 PM',
    location: 'Student Center - Main Lounge',
    venue: 'Student Center - Main Lounge, 353 Ferst Dr NW, Atlanta, GA 30313',
    attendees: 12,
    image: 'https://images.unsplash.com/photo-1547055648-bc6fdb42d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9yZ2lhJTIwdGVjaCUyMGZvb3RiYWxsJTIwc3RhZGl1bXxlbnwxfHx8fDE3NTg5ODE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    reminders: [
      'Come early for better seats!',
      'Bring your own snacks and drinks',
      'Wear your Yellow Jacket gear to show team spirit',
      'Arrive 15 minutes early to meet other participants',
      'BYOB (Bring Your Own Beverage) - no alcohol on campus'
    ],
    lastMinuteDetails: [
      'Main lounge big screen confirmed and reserved',
      'All 12 participants have been notified and confirmed',
      'Suggest carpooling - contact info shared with participants',
      'Parking available in the Student Center deck (free on weekends)'
    ],
    weatherInfo: 'Perfect day for the game! Sunny and 68°F',
    parkingInfo: 'Free parking available in Student Center deck. Entrance on Ferst Drive.'
  });
  
  const [showEventConfirmation, setShowEventConfirmation] = useState(true);

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleAddToCalendarFromConfirmation = (eventConfirmation: any) => {
    // Convert EventConfirmation to Event format
    const event: Event = {
      id: eventConfirmation.id,
      title: eventConfirmation.title,
      description: `Watch the big rivalry game with fellow Yellow Jackets! Pizza and drinks provided.`,
      date: eventConfirmation.date,
      time: eventConfirmation.time,
      location: eventConfirmation.location,
      organizer: 'AI Organized',
      attendees: eventConfirmation.attendees,
      maxAttendees: 15,
      tags: ['Sports', 'Social', 'Food'],
      image: eventConfirmation.image,
      isInterested: true,
      isAttending: true
    };
    
    onAddToCalendar(event);
  };

  const handleGetDirections = (venue: string) => {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(venue)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="bg-background texture-paper">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 texture-organic shadow-natural">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl text-foreground">Touch Grass</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </div>
            <div className="text-sm">
              <p className="text-foreground">{userProfile.name}</p>
              <p className="text-muted-foreground">{userProfile.year}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:relative z-30 lg:z-0
          w-80 bg-sidebar border-r border-sidebar-border
          h-full lg:h-auto lg:shadow-none shadow-xl
        `}>
          <div className="p-4 lg:hidden border-b border-sidebar-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="float-right"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ProfileSidebar userProfile={userProfile} onEdit={onProfileEdit} onLogout={onLogout} userId={userId} />
        </div>

        {/* No overlay - sidebar slides over content */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Event Confirmation Notification */}
          {showEventConfirmation && (
            <div className="p-4 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 border-b border-primary/20">
              <EventConfirmationNotification
                confirmation={eventConfirmation}
                onDismiss={() => setShowEventConfirmation(false)}
                onAddToCalendar={handleAddToCalendarFromConfirmation}
                onGetDirections={handleGetDirections}
                onJoinGroupChat={onJoinGroupChat}
                calendarEvents={calendarEvents}
              />
            </div>
          )}

          {/* Regular Notifications */}
          {notifications.length > 0 && (
            <div className="bg-primary/5 border-b border-primary/20 p-4 texture-organic">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="p-4 bg-card shadow-natural border-organic grass-decoration">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm text-foreground mb-1">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearNotification(notification.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tabs for main content */}
          <div className="flex-1 p-4 relative">
            {/* Background decorations */}
            <div className="absolute top-8 right-8 opacity-20">
              <SmallDecorationIllustration className="w-6 h-6" />
            </div>
            <div className="absolute bottom-12 left-8 opacity-15">
              <SmallDecorationIllustration className="w-8 h-8" />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4 bg-accent/50 border-organic">
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  My Calendar
                  {calendarEvents.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {calendarEvents.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="flex-1 mt-0">
                <EventFeed 
                  userProfile={userProfile} 
                  onSwitchToAIChat={() => setActiveTab('chat')}
                  calendarEvents={calendarEvents}
                  eventRSVPs={eventRSVPs}
                  onAddToCalendar={onAddToCalendar}
                  onUpdateRSVP={onUpdateRSVP}
                  userId={userId}
                />
              </TabsContent>

              <TabsContent value="calendar" className="flex-1 mt-0">
                <Calendar 
                  calendarEvents={calendarEvents}
                  onRemoveFromCalendar={onRemoveFromCalendar}
                  onExportCalendar={onExportCalendar}
                />
              </TabsContent>

              <TabsContent value="chat" className="flex-1 mt-0">
                <div className="h-full">
                  <AIChat userProfile={userProfile} />
                </div>
              </TabsContent>


            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}