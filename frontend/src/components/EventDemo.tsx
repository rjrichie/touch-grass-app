import React, { useState } from 'react';
import { EventDetailPage } from './EventDetailPage';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function EventDemo() {
  const [showEventDetail, setShowEventDetail] = useState(false);

  const sampleEvent = {
    id: '1',
    title: 'GT vs UGA Watch Party',
    description: 'Watch the big rivalry game with fellow Yellow Jackets!',
    longDescription: 'Join us for the most anticipated game of the season! We\'ll be watching the Georgia Tech vs University of Georgia rivalry game on the big screen in the Student Center. This is more than just watching football - it\'s about building community, sharing experiences, and celebrating our Yellow Jacket spirit together. We\'ll have pizza delivered, drinks, snacks, and plenty of comfortable seating. Whether you\'re a die-hard football fan or just looking to socialize, everyone is welcome. Come early to secure the best viewing spots and stay for post-game discussions. Let\'s show our team some love and make some new friends along the way!',
    date: 'Saturday, November 25, 2024',
    time: '3:30 PM',
    endTime: '6:30 PM',
    location: 'Student Center - Main Lounge',
    venue: 'Georgia Tech Student Center',
    address: '353 Ferst Dr NW, Atlanta, GA 30313',
    cost: 'Free',
    organizer: 'Touch Grass AI',
    organizerBio: 'AI-powered event matching system helping Georgia Tech students find their community through shared experiences.',
    attendees: 12,
    maxAttendees: 25,
    tags: ['Sports', 'Social', 'Food', 'Community'],
    images: [
      'https://images.unsplash.com/photo-1547055648-bc6fdb42d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9yZ2lhJTIwdGVjaCUyMGZvb3RiYWxsJTIwc3RhZGl1bXxlbnwxfHx8fDE3NTg5ODE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2VudGVyJTIwdmVudWUlMjBpbnRlcmlvcnxlbnwxfHh8fDE3NTg5ODE5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758275557720-37123c8eea5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc29jaWFsJTIwbWl4ZXIlMjBwYXJ0eXxlbnwxfHx8fDE3NTg5ODE5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Food', 'WiFi', 'Parking', 'Music'],
    requirements: [
      'Must be a current Georgia Tech student',
      'Please bring your student ID',
      'No outside food or drinks allowed',
      'Respectful behavior expected - this is a community event'
    ],
    rating: 4.8,
    reviews: 156
  };

  const handleRSVP = (criteria: any) => {
    console.log('RSVP submitted with criteria:', criteria);
    // In a real app, this would send the RSVP to the backend
    alert('RSVP submitted successfully! You\'ll receive a confirmation once the event criteria are met.');
  };

  if (showEventDetail) {
    return (
      <EventDetailPage 
        event={sampleEvent}
        onBack={() => setShowEventDetail(false)}
        onRSVP={handleRSVP}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-leaf texture-organic">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl mb-4">Event Detail Page Demo</h1>
            <p className="text-muted-foreground mb-6">
              Click the button below to see the enhanced event detail page with RSVP functionality, 
              venue photos, detailed information, and acceptance criteria settings.
            </p>
            <Button 
              onClick={() => setShowEventDetail(true)}
              className="border-organic shadow-natural"
              size="lg"
            >
              View Sample Event Detail
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}