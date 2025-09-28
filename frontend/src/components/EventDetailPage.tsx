import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  DollarSign,
  ArrowLeft,
  Heart,
  Share,
  MessageCircle,
  Camera,
  Utensils,
  Wifi,
  Car,
  Music,
  Star,
  Sparkles
} from 'lucide-react';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  venue: string;
  address: string;
  cost: string;
  organizer: string;
  organizerBio: string;
  attendees: number;
  maxAttendees: number;
  tags: string[];
  images: string[];
  amenities: string[];
  requirements: string[];
  rating: number;
  reviews: number;
}

interface EventDetailPageProps {
  event: EventDetails;
  onBack: () => void;
  onRSVP: (criteria: RSVPCriteria) => void;
}

interface RSVPCriteria {
  willAttend: boolean;
  dietaryRestrictions: string;
  transportationNeeded: boolean;
  emergencyContact: string;
  specialRequests: string;
  acceptanceCriteria: {
    minAttendees: number;
    weatherDependent: boolean;
    cancellationPolicy: boolean;
  };
}

export function EventDetailPage({ event, onBack, onRSVP }: EventDetailPageProps) {
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [rsvpData, setRSVPData] = useState<RSVPCriteria>({
    willAttend: true,
    dietaryRestrictions: '',
    transportationNeeded: false,
    emergencyContact: '',
    specialRequests: '',
    acceptanceCriteria: {
      minAttendees: 5,
      weatherDependent: false,
      cancellationPolicy: false
    }
  });

  const handleRSVPSubmit = () => {
    onRSVP(rsvpData);
    setShowRSVPModal(false);
  };

  const amenityIcons = {
    'Food': Utensils,
    'WiFi': Wifi,
    'Parking': Car,
    'Music': Music,
    'Photography': Camera
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="flex-1">{event.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Image Gallery */}
        <Card className="overflow-hidden border-organic shadow-leaf">
          <div className="relative h-64 md:h-80">
            <ImageWithFallback
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              {event.images.slice(1, 4).map((img, index) => (
                <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white">
                  <ImageWithFallback
                    src={img}
                    alt={`${event.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {event.images.length > 4 && (
                <div className="w-16 h-16 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm">
                  +{event.images.length - 4}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card className="texture-paper shadow-natural">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-2">{event.title}</h2>
                    <div className="flex items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{event.rating}</span>
                        <span>({event.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {event.cost}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border-organic">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{event.date}</p>
                        <p className="text-sm text-muted-foreground">{event.time} - {event.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border-organic">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{event.venue}</p>
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border-organic">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{event.attendees}/{event.maxAttendees} going</p>
                        <p className="text-sm text-muted-foreground">
                          {event.maxAttendees - event.attendees} spots left
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border-organic">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{event.cost}</p>
                        <p className="text-sm text-muted-foreground">Per person</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-organic">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{event.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="texture-organic shadow-natural">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Star;
                    return (
                      <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-accent/30">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {event.requirements.length > 0 && (
              <Card className="texture-stone shadow-natural">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card className="sticky top-24 texture-grass shadow-leaf grass-decoration">
              <CardContent className="p-6">
                <Button 
                  className="w-full mb-4 h-12 text-lg border-organic shadow-natural"
                  onClick={() => setShowRSVPModal(true)}
                >
                  RSVP Now
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Join {event.attendees} others going
                  </p>
                  <div className="flex justify-center -space-x-2">
                    {[...Array(Math.min(5, event.attendees))].map((_, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-card">
                        <AvatarFallback className="text-xs">
                          U{i + 1}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Organized Event Info */}
            <Card className="texture-organic shadow-natural">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">AI-Organized Event</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      This event was intelligently matched and organized by Touch Grass AI based on participant preferences and interests.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Automatic coordination & scheduling</p>
                      <p>• Matched participants with similar interests</p>
                      <p>• No individual organizer required</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <Dialog open={showRSVPModal} onOpenChange={setShowRSVPModal}>
        <DialogContent className="max-w-md texture-paper">
          <DialogHeader>
            <DialogTitle>RSVP to {event.title}</DialogTitle>
            <DialogDescription>
              Please confirm your attendance and provide any additional details for this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendance</label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={rsvpData.willAttend}
                  onCheckedChange={(checked) => 
                    setRSVPData({...rsvpData, willAttend: checked as boolean})
                  }
                />
                <span className="text-sm">Yes, I will attend this event</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Attendees</label>
              <Select 
                value={rsvpData.acceptanceCriteria.minAttendees.toString()}
                onValueChange={(value) => 
                  setRSVPData({
                    ...rsvpData, 
                    acceptanceCriteria: {
                      ...rsvpData.acceptanceCriteria,
                      minAttendees: parseInt(value)
                    }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">At least 3 people</SelectItem>
                  <SelectItem value="5">At least 5 people</SelectItem>
                  <SelectItem value="8">At least 8 people</SelectItem>
                  <SelectItem value="10">At least 10 people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={rsvpData.acceptanceCriteria.weatherDependent}
                  onCheckedChange={(checked) => 
                    setRSVPData({
                      ...rsvpData,
                      acceptanceCriteria: {
                        ...rsvpData.acceptanceCriteria,
                        weatherDependent: checked as boolean
                      }
                    })
                  }
                />
                <span className="text-sm">Only if weather is good (outdoor events)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={rsvpData.transportationNeeded}
                  onCheckedChange={(checked) => 
                    setRSVPData({...rsvpData, transportationNeeded: checked as boolean})
                  }
                />
                <span className="text-sm">I need transportation help</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dietary Restrictions</label>
              <Textarea 
                placeholder="Any dietary restrictions or allergies..."
                value={rsvpData.dietaryRestrictions}
                onChange={(e) => setRSVPData({...rsvpData, dietaryRestrictions: e.target.value})}
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Special Requests</label>
              <Textarea 
                placeholder="Any special accommodations needed..."
                value={rsvpData.specialRequests}
                onChange={(e) => setRSVPData({...rsvpData, specialRequests: e.target.value})}
                className="min-h-[60px]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowRSVPModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRSVPSubmit} className="flex-1">
                Submit RSVP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}