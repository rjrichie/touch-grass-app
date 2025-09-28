import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ProfileSetup } from './components/ProfileSetup';
import { CommunitySelection } from './components/CommunitySelection';
import { Dashboard } from './components/Dashboard';
import { EventDemo } from './components/EventDemo';
import { GroupChat } from './components/GroupChat';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CalendarEvent } from './components/Calendar';
import { Event } from './components/EventsData';

export type UserProfile = {
  name: string;
  year: string;
  interests: string[];
  preferences: {
    groupSize: string;
    genderPreference: string;
    timePreference: string;
  };
  community: string;
};

export type AppScreen = 'welcome' | 'login' | 'signup' | 'profile' | 'community' | 'dashboard' | 'event-demo' | 'group-chat' | 'terms' | 'privacy';

// Simple user state management for profile completion tracking
type UserState = {
  isLoggedIn: boolean;
  hasCompletedProfile: boolean;
  userId: string | null;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventRSVPs, setEventRSVPs] = useState<Record<string, { isInterested: boolean; isAttending: boolean }>>({});
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    hasCompletedProfile: false,
    userId: null
  });

  // Load user state from localStorage and cookies on app start
  useEffect(() => {
    try {
      const savedUserState = localStorage.getItem('touchGrassUserState');
      const savedProfile = localStorage.getItem('touchGrassUserProfile');
      const savedCalendarEvents = localStorage.getItem('touchGrassCalendarEvents');
      const savedEventRSVPs = localStorage.getItem('touchGrassEventRSVPs');
      
      if (savedUserState) {
        const parsedUserState = JSON.parse(savedUserState);
        setUserState(parsedUserState);
      }
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile(parsedProfile);
      }

      if (savedCalendarEvents) {
        const parsedCalendarEvents = JSON.parse(savedCalendarEvents);
        setCalendarEvents(parsedCalendarEvents);
      }

      if (savedEventRSVPs) {
        const parsedEventRSVPs = JSON.parse(savedEventRSVPs);
        setEventRSVPs(parsedEventRSVPs);
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('touchGrassUserState');
      localStorage.removeItem('touchGrassUserProfile');
      localStorage.removeItem('touchGrassCalendarEvents');
      localStorage.removeItem('touchGrassEventRSVPs');
    }
  }, []);

  const handleScreenChange = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    // Save profile to localStorage
    try {
      localStorage.setItem('touchGrassUserProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  };

  const handleLogin = (userId: string) => {
    const newUserState = {
      isLoggedIn: true,
      hasCompletedProfile: userState.hasCompletedProfile,
      userId: userId
    };
    setUserState(newUserState);
    try {
      localStorage.setItem('touchGrassUserState', JSON.stringify(newUserState));
    } catch (error) {
      console.error('Error saving user state to localStorage:', error);
    }
    
    // Check if user has completed profile setup
    if (newUserState.hasCompletedProfile && userProfile) {
      handleScreenChange('dashboard');
    } else {
      handleScreenChange('profile');
    }
  };

  const handleSignup = (userId: string) => {
    const newUserState = {
      isLoggedIn: true,
      hasCompletedProfile: false,
      userId: userId
    };
    setUserState(newUserState);
    try {
      localStorage.setItem('touchGrassUserState', JSON.stringify(newUserState));
    } catch (error) {
      console.error('Error saving user state to localStorage:', error);
    }
    handleScreenChange('profile');
  };

  const handleProfileSetupComplete = () => {
    const updatedUserState = {
      ...userState,
      hasCompletedProfile: true
    };
    setUserState(updatedUserState);
    try {
      localStorage.setItem('touchGrassUserState', JSON.stringify(updatedUserState));
    } catch (error) {
      console.error('Error saving user state to localStorage:', error);
    }
    handleScreenChange('community');
  };

  const handleCommunitySelectionComplete = (community: string) => {
    if (userProfile) {
      handleProfileUpdate({ ...userProfile, community });
    }
    handleScreenChange('dashboard');
  };

  const handleLogout = () => {
    setUserState({
      isLoggedIn: false,
      hasCompletedProfile: false,
      userId: null
    });
    setUserProfile(null);
    setCalendarEvents([]);
    setEventRSVPs({});
    try {
      localStorage.removeItem('touchGrassUserState');
      localStorage.removeItem('touchGrassUserProfile');
      localStorage.removeItem('touchGrassCalendarEvents');
      localStorage.removeItem('touchGrassEventRSVPs');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    
    handleScreenChange('welcome');
  };

  const handleJoinGroupChat = (eventId: string) => {
    setSelectedEventId(eventId);
    handleScreenChange('group-chat');
  };

  const handleAddToCalendar = (event: Event) => {
    const calendarEvent: CalendarEvent = {
      ...event,
      addedToCalendar: true,
      dateAdded: new Date().toISOString()
    };

    const updatedCalendarEvents = [...calendarEvents];
    const existingIndex = updatedCalendarEvents.findIndex(e => e.id === event.id);
    
    if (existingIndex === -1) {
      updatedCalendarEvents.push(calendarEvent);
      setCalendarEvents(updatedCalendarEvents);
      
      // Update RSVP status to attending when adding to calendar
      const updatedRSVPs = {
        ...eventRSVPs,
        [event.id]: {
          isInterested: true,
          isAttending: true
        }
      };
      setEventRSVPs(updatedRSVPs);
      
      // Save to localStorage
      try {
        localStorage.setItem('touchGrassCalendarEvents', JSON.stringify(updatedCalendarEvents));
        localStorage.setItem('touchGrassEventRSVPs', JSON.stringify(updatedRSVPs));
      } catch (error) {
        console.error('Error saving calendar events to localStorage:', error);
      }
    }
  };

  const handleRemoveFromCalendar = (eventId: string) => {
    const updatedCalendarEvents = calendarEvents.filter(event => event.id !== eventId);
    setCalendarEvents(updatedCalendarEvents);
    
    // Remove RSVP status when removing from calendar
    const updatedRSVPs = { ...eventRSVPs };
    delete updatedRSVPs[eventId];
    setEventRSVPs(updatedRSVPs);
    
    // Save to localStorage
    try {
      localStorage.setItem('touchGrassCalendarEvents', JSON.stringify(updatedCalendarEvents));
      localStorage.setItem('touchGrassEventRSVPs', JSON.stringify(updatedRSVPs));
    } catch (error) {
      console.error('Error saving calendar events to localStorage:', error);
    }
  };

  const handleExportCalendar = () => {
    if (calendarEvents.length === 0) {
      alert('No events in calendar to export');
      return;
    }

    // Generate ICS content
    const icsContent = generateICSContent(calendarEvents);
    
    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'touch-grass-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to generate ICS content
  const generateICSContent = (events: CalendarEvent[]): string => {
    const formatDateForICS = (dateStr: string, timeStr: string): string => {
      const currentYear = new Date().getFullYear();
      const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      let targetDate: Date;
      
      // First, check if there's a specific date mentioned (like "Nov 25")
      const cleanDateStr = dateStr.replace(/^(Tomorrow|Today),?\s*/i, '').trim();
      const dateParts = cleanDateStr.split(' ');
      
      if (dateParts.length >= 2 && dateParts[0] in months) {
        // We have a specific date like "Nov 25", use that regardless of "Tomorrow/Today"
        const [month, day] = dateParts;
        const monthIndex = months[month as keyof typeof months];
        const dayNumber = parseInt(day);
        targetDate = new Date(currentYear, monthIndex, dayNumber);
      }
      // Only use relative dates if no specific date is mentioned
      else if (dateStr.toLowerCase().includes('tomorrow')) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
      } 
      else if (dateStr.toLowerCase().includes('today')) {
        targetDate = new Date();
      }
      // Fallback
      else {
        targetDate = new Date();
      }
      
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
      
      // Set the time on the target date
      targetDate.setHours(hours, minutes, 0, 0);
      return targetDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Touch Grass//Touch Grass Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach(event => {
      const startDate = formatDateForICS(event.date, event.time);
      // Assume 2-hour duration for events
      const endDate = formatDateForICS(event.date, event.time);
      const endDateTime = new Date(endDate.substring(0, 8) + 'T' + endDate.substring(9));
      endDateTime.setHours(endDateTime.getHours() + 2);
      const endDateFormatted = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${event.id}@touchgrass.app`,
        `DTSTART:${startDate}`,
        `DTEND:${endDateFormatted}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/,/g, '\\,')}`,
        `LOCATION:${event.location.replace(/,/g, '\\,')}`,
        `ORGANIZER:CN=${event.organizer}`,
        `STATUS:CONFIRMED`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onLogin={() => handleScreenChange('login')}
          onSignup={() => handleScreenChange('signup')}
        />
      )}

      {currentScreen === 'login' && (
        <Login 
          onLogin={handleLogin}
          onSwitchToSignup={() => handleScreenChange('signup')}
          onBack={() => handleScreenChange('welcome')}
        />
      )}

      {currentScreen === 'signup' && (
        <Signup 
          onSignup={handleSignup}
          onSwitchToLogin={() => handleScreenChange('login')}
          onBack={() => handleScreenChange('welcome')}
          onShowTerms={() => handleScreenChange('terms')}
          onShowPrivacy={() => handleScreenChange('privacy')}
        />
      )}
      
      {currentScreen === 'profile' && (
        <ProfileSetup 
          onNext={handleProfileSetupComplete}
          onProfileUpdate={handleProfileUpdate}
          userId={userState.userId || ''}
        />
      )}
      
      {currentScreen === 'community' && (
        <CommunitySelection 
          onNext={() => handleCommunitySelectionComplete('')}
          onCommunitySelect={handleCommunitySelectionComplete}
        />
      )}
      
      {currentScreen === 'dashboard' && userProfile && (
        <Dashboard 
          userProfile={userProfile}
          onProfileEdit={() => handleScreenChange('profile')}
          onLogout={handleLogout}
          onJoinGroupChat={handleJoinGroupChat}
          calendarEvents={calendarEvents}
          eventRSVPs={eventRSVPs}
          onAddToCalendar={handleAddToCalendar}
          onRemoveFromCalendar={handleRemoveFromCalendar}
          onExportCalendar={handleExportCalendar}
          onUpdateRSVP={(eventId: string, rsvpStatus: { isInterested: boolean; isAttending: boolean }) => {
            const updatedRSVPs = {
              ...eventRSVPs,
              [eventId]: rsvpStatus
            };
            setEventRSVPs(updatedRSVPs);
            try {
              localStorage.setItem('touchGrassEventRSVPs', JSON.stringify(updatedRSVPs));
            } catch (error) {
              console.error('Error saving RSVP status to localStorage:', error);
            }
          }}
          userId={userState.userId || ''}
        />
      )}

      {currentScreen === 'event-demo' && (
        <EventDemo />
      )}

      {currentScreen === 'group-chat' && userProfile && selectedEventId && (
        <GroupChat 
          userProfile={userProfile}
          eventDetails={{
            id: selectedEventId,
            title: "GT vs UGA Watch Party",
            date: "2024-11-25",
            time: "3:30 PM",
            location: "Student Center - Main Lounge",
            description: "Watch the big rivalry game with fellow Yellow Jackets! Pizza and drinks provided. Come early to get a good seat and meet your fellow attendees.",
            participants: [
              { id: "1", name: "Sarah Johnson", year: "Sophomore" },
              { id: "2", name: "Mike Chen", year: "Junior" },
              { id: "3", name: "Alex Thompson", year: "Senior" },
              { id: "4", name: "Emma Rodriguez", year: "Freshman" },
              { id: "5", name: "Jordan Kim", year: "Graduate" },
              { id: "6", name: userProfile.name, year: userProfile.year }
            ]
          }}
          onBack={() => handleScreenChange('dashboard')}
        />
      )}

      {currentScreen === 'terms' && (
        <TermsOfService 
          onBack={() => handleScreenChange('signup')}
        />
      )}

      {currentScreen === 'privacy' && (
        <PrivacyPolicy 
          onBack={() => handleScreenChange('signup')}
        />
      )}
    </div>
  );
}