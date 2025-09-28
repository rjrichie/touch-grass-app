import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Grid3X3,
  List
} from 'lucide-react';
import { Event } from './EventsData';

export interface CalendarEvent extends Event {
  addedToCalendar: boolean;
  dateAdded: string;
}

interface CalendarProps {
  calendarEvents: CalendarEvent[];
  onRemoveFromCalendar: (eventId: string) => void;
  onExportCalendar: () => void;
}

// Helper function to parse date string to Date object
function parseEventDate(dateStr: string, timeStr: string): Date {
  const currentYear = new Date().getFullYear();
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const [month, day] = dateStr.split(' ');
  const monthIndex = months[month as keyof typeof months] ?? 0;
  const dayNumber = parseInt(day) || 1;
  
  // Parse time
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/);
  let hours = 12;
  let minutes = 0;
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1]);
    minutes = parseInt(timeMatch[2]) || 0;
    
    if (timeMatch[3] === 'PM' && hours !== 12) {
      hours += 12;
    } else if (timeMatch[3] === 'AM' && hours === 12) {
      hours = 0;
    }
  }
  
  return new Date(currentYear, monthIndex, dayNumber, hours, minutes);
}

// Helper function to format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Helper function to format time for display
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export function Calendar({ calendarEvents, onRemoveFromCalendar, onExportCalendar }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Get current month and year
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday
  
  // Generate calendar grid (6 weeks)
  const calendarDays: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  // Group events by date
  const eventsByDate = calendarEvents.reduce((acc, event) => {
    const eventDate = parseEventDate(event.date, event.time);
    const dateKey = eventDate.toDateString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort events by date
  const sortedEvents = [...calendarEvents].sort((a, b) => {
    const dateA = parseEventDate(a.date, a.time);
    const dateB = parseEventDate(b.date, b.time);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingEvents = sortedEvents.filter(event => {
    const eventDate = parseEventDate(event.date, event.time);
    return eventDate.getTime() > Date.now();
  });

  const pastEvents = sortedEvents.filter(event => {
    const eventDate = parseEventDate(event.date, event.time);
    return eventDate.getTime() <= Date.now();
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  };

  return (
    <div className="h-screen overflow-y-auto texture-paper">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10 texture-organic shadow-natural">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h2 className="text-lg text-foreground">My Calendar</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCalendar}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export .ics
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{calendarEvents.length} events in your calendar</span>
          <span>{upcomingEvents.length} upcoming • {pastEvents.length} past</span>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full mt-2" />
      </div>

      <div className="p-4">
        {calendarEvents.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 border-primary/20 texture-stone">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground mb-2">No events in your calendar</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add events from the Events tab to keep track of your activities
                </p>
              </div>
            </div>
          </Card>
        ) : viewMode === 'month' ? (
          <Card className="texture-organic border-organic shadow-natural">
            <CardContent className="p-0">
              {/* Month Navigation */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {dayNames.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const dateKey = date.toDateString();
                  const dayEvents = eventsByDate[dateKey] || [];
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border-r border-b border-border last:border-r-0 ${
                        !isCurrentMonthDay ? 'bg-muted/20 text-muted-foreground' : ''
                      } ${isTodayDate ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
                    >
                      <div className={`text-sm mb-1 ${isTodayDate ? 'font-semibold text-primary' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 transition-colors truncate"
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* List View - Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Events ({upcomingEvents.length})
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onRemove={onRemoveFromCalendar}
                      isUpcoming={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* List View - Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h3 className="text-foreground mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  Past Events ({pastEvents.length})
                </h3>
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onRemove={onRemoveFromCalendar}
                      isUpcoming={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl texture-paper">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription>
                Event details and information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedEvent.image && (
                <div className="relative h-48 rounded-lg overflow-hidden border-organic">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span>{formatDate(parseEventDate(selectedEvent.date, selectedEvent.time))}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{formatTime(parseEventDate(selectedEvent.date, selectedEvent.time))}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{selectedEvent.attendees}/{selectedEvent.maxAttendees} attending</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className={`text-xs border-organic ${
                            index % 3 === 0 ? 'bg-primary/10 text-primary' : 
                            index % 3 === 1 ? 'bg-orange/10 text-orange border-orange/20' : 
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => {
                    onRemoveFromCalendar(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove from Calendar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface EventCardProps {
  event: CalendarEvent;
  onRemove: (eventId: string) => void;
  isUpcoming: boolean;
}

function EventCard({ event, onRemove, isUpcoming }: EventCardProps) {
  const eventDate = parseEventDate(event.date, event.time);
  
  return (
    <Card className={`overflow-hidden shadow-leaf grass-decoration border-organic transition-all duration-300 hover:shadow-natural ${
      isUpcoming ? 'texture-organic' : 'texture-grass opacity-70'
    }`}>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with title and remove button */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-foreground mb-2 leading-tight">{event.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(event.id)}
              className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span className="font-medium">{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">{formatTime(eventDate)}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md border-organic">
              <Users className="w-4 h-4 text-primary" />
              <span>{event.attendees}/{event.maxAttendees} attending</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className={`text-xs border-organic ${
                  index % 3 === 0 ? 'bg-primary/10 text-primary' : 
                  index % 3 === 1 ? 'bg-orange/10 text-orange border-orange/20' : 
                  'bg-muted text-muted-foreground'
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Added date info */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            Added to calendar: {new Date(event.dateAdded).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}