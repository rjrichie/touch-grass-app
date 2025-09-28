export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  tags: string[];
  image?: string;
  isInterested: boolean;
  isAttending: boolean;
}

export const EVENTS_DATA: Event[] = [
  // Sports Events
  {
    id: '1',
    title: 'GT vs UGA Watch Party',
    description: 'Watch the big rivalry game with fellow Yellow Jackets! Pizza and drinks provided. Come early for the best seats!',
    date: 'Nov 25',
    time: '3:30 PM',
    location: 'Student Center - Main Lounge',
    organizer: 'AI Organized',
    attendees: 8,
    maxAttendees: 15,
    tags: ['Sports', 'Social', 'Food'],
    image: 'https://images.unsplash.com/photo-1547055648-bc6fdb42d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9yZ2lhJTIwdGVjaCUyMGZvb3RiYWxsJTIwc3RhZGl1bXxlbnwxfHx8fDE3NTg5ODE5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: true,
    isAttending: false
  },
  {
    id: '2',
    title: 'Morning Campus Hike',
    description: 'Start your day with an energizing hike around campus trails and nearby nature paths. Perfect for all fitness levels!',
    date: 'Nov 24',
    time: '7:00 AM',
    location: 'Campus Recreation Center',
    organizer: 'AI Organized',
    attendees: 4,
    maxAttendees: 10,
    tags: ['Sports', 'Fitness', 'Outdoor', 'Morning'],
    image: 'https://images.unsplash.com/photo-1634259170925-fd02c93f24f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwaGlraW5nJTIwdHJhaWwlMjBuYXR1cmV8ZW58MXx8fHwxNzU4OTk5NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Fitness Events
  {
    id: '3',
    title: 'Sunset Yoga Session',
    description: 'Wind down with a peaceful yoga session on the lawn. All levels welcome. Mats provided!',
    date: 'Nov 23',
    time: '6:30 PM',
    location: 'Harrison Square Lawn',
    organizer: 'AI Organized',
    attendees: 7,
    maxAttendees: 20,
    tags: ['Fitness', 'Yoga', 'Outdoor', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBtZWRpdGF0aW9uJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzU4OTk5NDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: true,
    isAttending: true
  },
  // Food Events
  {
    id: '4',
    title: 'Hands-On Cooking Class',
    description: 'Learn to cook healthy college meals on a budget. We\'ll make three different dishes together!',
    date: 'Nov 26',
    time: '5:00 PM',
    location: 'West Village Dining Community Kitchen',
    organizer: 'AI Organized',
    attendees: 6,
    maxAttendees: 12,
    tags: ['Food', 'Cooking', 'Learning', 'Social'],
    image: 'https://images.unsplash.com/photo-1578366941741-9e517759c620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVuJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU4OTk5NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Pet/Animals Events
  {
    id: '5',
    title: 'Paws & Pups @ GT',
    description: 'De-stress with therapy dogs and meet fellow pet lovers! Bring your own furry friend or just come to pet some pups.',
    date: 'Nov 27',
    time: '2:00 PM',
    location: 'Student Center Plaza',
    organizer: 'AI Organized',
    attendees: 15,
    maxAttendees: 30,
    tags: ['Pets', 'Social', 'Stress Relief', 'Animals'],
    image: 'https://images.unsplash.com/photo-1720908048545-039f780c3c9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2dzJTIwcGV0cyUyMGNhbXB1cyUyMHN0dWRlbnRzfGVufDF8fHx8MTc1ODk5OTQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: true,
    isAttending: false
  },
  // Gaming Events
  {
    id: '6',
    title: 'Board Game Night Café',
    description: 'Discover new board games and connect with fellow strategists. Pizza and snacks provided!',
    date: 'Nov 28',
    time: '7:00 PM',
    location: 'Student Center - Game Room',
    organizer: 'AI Organized',
    attendees: 9,
    maxAttendees: 16,
    tags: ['Gaming', 'Social', 'Food', 'Strategy'],
    image: 'https://images.unsplash.com/photo-1673547357683-9d49ea082f38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBuaWdodCUyMHN0dWRlbnRzfGVufDF8fHx8MTc1ODk5OTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Reading Events
  {
    id: '7',
    title: 'Cozy Book Club Gathering',
    description: 'This month we\'re reading "The Seven Husbands of Evelyn Hugo". Join us for discussion, tea, and literary conversations!',
    date: 'Nov 29',
    time: '4:00 PM',
    location: 'Library - East Commons',
    organizer: 'AI Organized',
    attendees: 8,
    maxAttendees: 12,
    tags: ['Reading', 'Books', 'Discussion', 'Cozy'],
    image: 'https://images.unsplash.com/photo-1737067304108-472b135f00e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY2x1YiUyMHJlYWRpbmclMjBncm91cHxlbnwxfHx8fDE3NTg5NDEwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Dance Events
  {
    id: '8',
    title: 'Beginner Salsa Dance Workshop',
    description: 'Learn the basics of salsa dancing in a fun, no-pressure environment. No partner needed!',
    date: 'Nov 30',
    time: '8:00 PM',
    location: 'Student Activities Center - Dance Studio',
    organizer: 'AI Organized',
    attendees: 11,
    maxAttendees: 20,
    tags: ['Dance', 'Learning', 'Social', 'Music'],
    image: 'https://images.unsplash.com/photo-1625574911871-b39590096628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGNsYXNzJTIwc3R1ZGVudHMlMjBzdHVkaW98ZW58MXx8fHwxNzU4OTk5NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Movies Events
  {
    id: '9',
    title: 'Outdoor Movie Night: Studio Ghibli',
    description: 'Watch "Spirited Away" under the stars! Blankets and popcorn provided. Perfect for a chill evening.',
    date: 'Dec 1',
    time: '7:30 PM',
    location: 'Tech Green',
    organizer: 'AI Organized',
    attendees: 18,
    maxAttendees: 50,
    tags: ['Movies', 'Outdoor', 'Animation', 'Chill'],
    image: 'https://images.unsplash.com/photo-1725004183188-5c4b2c670de5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMG5pZ2h0JTIwb3V0ZG9vciUyMHNjcmVlbmluZ3xlbnwxfHx8fDE3NTg5OTk0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: true,
    isAttending: false
  },
  // Art Events
  {
    id: '10',
    title: 'Watercolor Painting Workshop',
    description: 'Express your creativity with watercolors! All supplies provided. Create art while making new friends.',
    date: 'Dec 2',
    time: '3:00 PM',
    location: 'Student Center - Art Studio',
    organizer: 'AI Organized',
    attendees: 7,
    maxAttendees: 15,
    tags: ['Art', 'Painting', 'Creative', 'Relaxing'],
    image: 'https://images.unsplash.com/photo-1758522274945-7f000385a3dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcCUyMHBhaW50aW5nJTIwY2xhc3N8ZW58MXx8fHwxNzU4OTc0MDkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Technology Events
  {
    id: '11',
    title: 'Weekend Hackathon: AI Solutions',
    description: 'Build innovative AI solutions in 48 hours! All skill levels welcome. Prizes and free meals included.',
    date: 'Dec 3',
    time: '6:00 PM',
    location: 'Klaus Building - Atrium',
    organizer: 'AI Organized',
    attendees: 22,
    maxAttendees: 40,
    tags: ['Technology', 'Coding', 'AI', 'Competition'],
    image: 'https://images.unsplash.com/photo-1638202677704-b74690bb8fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwaGFja2F0aG9ufGVufDF8fHx8MTc1ODk5OTQ1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Music Events
  {
    id: '12',
    title: 'Acoustic Jam Session',
    description: 'Bring your instruments or just your voice! Open mic style session for musicians of all levels.',
    date: 'Dec 4',
    time: '7:00 PM',
    location: 'Student Center - Music Room',
    organizer: 'AI Organized',
    attendees: 8,
    maxAttendees: 15,
    tags: ['Music', 'Acoustic', 'Open Mic', 'Creative'],
    image: 'https://images.unsplash.com/photo-1706664771272-e635215ecd85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGphbSUyMHNlc3Npb24lMjBndWl0YXJ8ZW58MXx8fHwxNzU4OTk5NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Travel Events
  {
    id: '13',
    title: 'Spring Break Planning Meetup',
    description: 'Planning a trip for spring break? Join others looking for travel buddies and share tips for budget-friendly adventures!',
    date: 'Dec 5',
    time: '6:00 PM',
    location: 'Student Center - Conference Room B',
    organizer: 'AI Organized',
    attendees: 12,
    maxAttendees: 20,
    tags: ['Travel', 'Planning', 'Social', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1758272960256-45397872790b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB0cmlwJTIwcGxhbm5pbmclMjBncm91cHxlbnwxfHx8fDE3NTg5OTk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: false
  },
  // Photography Events
  {
    id: '14',
    title: 'Photography Walk Around Campus',
    description: 'Explore GT campus with fellow photography enthusiasts. All skill levels welcome! Cameras provided if needed.',
    date: 'Dec 6',
    time: '2:00 PM',
    location: 'Tech Tower (Meet Point)',
    organizer: 'AI Organized',
    attendees: 6,
    maxAttendees: 12,
    tags: ['Photography', 'Outdoor', 'Art', 'Nature'],
    image: 'https://images.unsplash.com/photo-1755192627753-8b3b463b5aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjBwaG90b2dyYXBoeSUyMG5hdHVyZSUyMHdhbGt8ZW58MXx8fHwxNzU4OTgxOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: true,
    isAttending: false
  },
  // Academic/Study Events
  {
    id: '15',
    title: 'CS 2110 Study Group',
    description: 'Collaborative study session focusing on data structures and algorithms. Bring your laptop and notes!',
    date: 'Dec 7',
    time: '7:00 PM',
    location: 'Klaus Building - Room 2425',
    organizer: 'AI Organized',
    attendees: 5,
    maxAttendees: 8,
    tags: ['Study', 'Computer Science', 'Academic', 'Technology'],
    image: 'https://images.unsplash.com/photo-1637255499922-f15bc6c4153f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZHklMjBsaWJyYXJ5JTIwY296eXxlbnwxfHx8fDE3NTg5ODE5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isInterested: false,
    isAttending: true
  }
];

// Helper function to filter events by user interests
export function filterEventsByInterests(events: Event[], userInterests: string[]): Event[] {
  if (userInterests.length === 0) {
    return events; // Show all events if no interests selected
  }
  
  return events.filter(event => {
    // Check if any of the event's tags match the user's interests
    return event.tags.some(tag => 
      userInterests.some(interest => 
        interest.toLowerCase() === tag.toLowerCase()
      )
    );
  });
}

// Helper function to find events by keyword for AI chat
export function findEventsByKeywords(events: Event[], keywords: string[]): Event[] {
  return events.filter(event => {
    const searchText = `${event.title} ${event.description} ${event.tags.join(' ')}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });
}