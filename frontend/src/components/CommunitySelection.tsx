import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Search, MapPin, Users } from 'lucide-react';

interface CommunitySelectionProps {
  onNext: () => void;
  onCommunitySelect: (community: string) => void;
}

const communities = [
  {
    id: 'georgia-tech',
    name: 'Georgia Tech',
    description: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    members: 45000,
    tags: ['Engineering', 'Research', 'Innovation']
  },
  {
    id: 'emory',
    name: 'Emory University',
    description: 'Private research university',
    location: 'Atlanta, GA',
    members: 15000,
    tags: ['Liberal Arts', 'Medicine', 'Business']
  },
  {
    id: 'uga',
    name: 'University of Georgia',
    description: 'Public research university',
    location: 'Athens, GA',
    members: 40000,
    tags: ['Journalism', 'Agriculture', 'Athletics']
  },
  {
    id: 'georgia-state',
    name: 'Georgia State University',
    description: 'Public research university',
    location: 'Atlanta, GA',
    members: 53000,
    tags: ['Urban', 'Diverse', 'Business']
  }
];

export function CommunitySelection({ onNext, onCommunitySelect }: CommunitySelectionProps) {
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunity(communityId);
    onCommunitySelect(communityId);
  };

  const handleContinue = () => {
    if (selectedCommunity) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle>Join Your Community</CardTitle>
          <p className="text-muted-foreground">Select your school or community to connect with fellow students</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your school or community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <Card 
                key={community.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCommunity === community.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => handleCommunitySelect(community.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg text-foreground mb-1">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">{community.description}</p>
                    </div>
                    {selectedCommunity === community.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {community.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.members.toLocaleString()} members
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No communities found matching your search.</p>
              <Button variant="outline" className="mt-4">
                Request to Add Community
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Can't find your community? You can request to add it after joining.
            </p>
            <Button 
              onClick={handleContinue}
              disabled={!selectedCommunity}
            >
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}