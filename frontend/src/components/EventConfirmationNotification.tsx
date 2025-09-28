import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  PartyPopper,
  CalendarPlus,
  MessageCircle,
  Navigation,
  X,
  CheckCircle
} from 'lucide-react';

interface EventConfirmation {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  attendees: number;
  image: string;
  reminders: string[];
  lastMinuteDetails: string[];
  weatherInfo?: string;
  parkingInfo?: string;
}

interface EventConfirmationNotificationProps {
  confirmation: EventConfirmation;
  onDismiss: () => void;
  onAddToCalendar: (event: EventConfirmation) => void;
  onGetDirections: (venue: string) => void;
  onJoinGroupChat?: (eventId: string) => void;
  calendarEvents: any[];
}

export function EventConfirmationNotification({ 
  confirmation, 
  onDismiss, 
  onAddToCalendar,
  onGetDirections,
  onJoinGroupChat,
  calendarEvents
}: EventConfirmationNotificationProps) {
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  // Check if event is already in calendar
  const isAddedToCalendar = calendarEvents.some(event => event.id === confirmation.id);

  const handleAddToCalendar = () => {
    onAddToCalendar(confirmation);
    
    // Create calendar event data
    const startDate = new Date(`${confirmation.date} ${confirmation.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(confirmation.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(confirmation.venue)}&sf=true&output=xml`;
    
    window.open(calendarUrl, '_blank');
  };

  return (
    <>
      {/* Main Notification Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/20 shadow-leaf texture-organic relative overflow-hidden">
        {/* Celebration Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4">
            <PartyPopper className="w-8 h-8 text-primary rotate-12" />
          </div>
          <div className="absolute top-8 right-8">
            <PartyPopper className="w-6 h-6 text-primary -rotate-12" />
          </div>
          <div className="absolute bottom-6 left-12">
            <PartyPopper className="w-5 h-5 text-primary rotate-45" />
          </div>
        </div>

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Event Confirmed!</h3>
                <p className="text-sm text-muted-foreground">Your event is happening tomorrow</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Event Image */}
            <div className="md:col-span-1">
              <div className="relative rounded-lg overflow-hidden border-organic h-24">
                <ImageWithFallback
                  src={confirmation.image}
                  alt={confirmation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute bottom-2 left-2 text-xs bg-primary/90">
                  Tomorrow
                </Badge>
              </div>
            </div>

            {/* Event Details */}
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-medium">{confirmation.title}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{confirmation.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="truncate">{confirmation.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{confirmation.attendees} confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{confirmation.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAddToCalendar}
              className={`flex-1 sm:flex-none ${isAddedToCalendar ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={isAddedToCalendar}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              {isAddedToCalendar ? 'Added to Calendar' : 'Add to Calendar'}
            </Button>
            
            {onJoinGroupChat && (
              <Button 
                onClick={() => onJoinGroupChat(confirmation.id)}
                className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Group Chat
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => onGetDirections(confirmation.venue)}
              className="flex-1 sm:flex-none"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFullDetails(true)}
              className="flex-1 sm:flex-none"
            >
              View Details
            </Button>
          </div>

          {/* Event Reminders Preview */}
          {confirmation.reminders && confirmation.reminders.length > 0 && (
            <div className="mt-4 p-4 bg-accent/50 rounded-lg border-organic">
              <p className="text-sm text-muted-foreground mb-2">Event reminders:</p>
              <ul className="space-y-1">
                {confirmation.reminders.slice(0, 2).map((reminder, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {reminder}
                  </li>
                ))}
                {confirmation.reminders.length > 2 && (
                  <li className="text-sm text-muted-foreground italic">
                    +{confirmation.reminders.length - 2} more reminders...
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Details Modal */}
      <Dialog open={showFullDetails} onOpenChange={setShowFullDetails}>
        <DialogContent className="max-w-2xl texture-paper">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-primary" />
              Event Details - {confirmation.title}
            </DialogTitle>
            <DialogDescription>
              View complete details for your confirmed event including location, timing, organizer message, and important updates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Event Image */}
            <div className="relative h-48 rounded-lg overflow-hidden border-organic">
              <ImageWithFallback
                src={confirmation.image}
                alt={confirmation.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detailed Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-accent/30 rounded-lg border-organic">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    When & Where
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Date:</strong> {confirmation.date}</p>
                    <p><strong>Time:</strong> {confirmation.time}</p>
                    <p><strong>Venue:</strong> {confirmation.venue}</p>
                    <p><strong>Location:</strong> {confirmation.location}</p>
                  </div>
                </div>

                <div className="p-4 bg-accent/30 rounded-lg border-organic">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Attendance
                  </h4>
                  <p className="text-sm">
                    <strong>{confirmation.attendees} people</strong> have confirmed their attendance
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {confirmation.weatherInfo && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-organic">
                    <h4 className="font-medium mb-2">Weather Update</h4>
                    <p className="text-sm">{confirmation.weatherInfo}</p>
                  </div>
                )}

                {confirmation.parkingInfo && (
                  <div className="p-4 bg-accent/30 rounded-lg border-organic">
                    <h4 className="font-medium mb-2">Parking Info</h4>
                    <p className="text-sm">{confirmation.parkingInfo}</p>
                  </div>
                )}

                <div className="p-4 bg-accent/30 rounded-lg border-organic">
                  <h4 className="font-medium mb-2">Event Reminders</h4>
                  <ul className="space-y-1">
                    {confirmation.reminders.map((reminder, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {reminder}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Event Reminders */}
            <div className="p-4 bg-primary/5 rounded-lg border-organic">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Event Reminders
              </h4>
              <ul className="space-y-2">
                {confirmation.reminders.map((reminder, index) => (
                  <li key={index} className="text-sm flex items-start gap-2 leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {reminder}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Minute Details */}
            {confirmation.lastMinuteDetails.length > 0 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-organic">
                <h4 className="font-medium mb-3">Last Minute Details</h4>
                <ul className="space-y-1">
                  {confirmation.lastMinuteDetails.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleAddToCalendar} 
                className={`flex-1 ${isAddedToCalendar ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={isAddedToCalendar}
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                {isAddedToCalendar ? 'Added to Calendar' : 'Add to Calendar'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => onGetDirections(confirmation.venue)}
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}