import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { UserProfile } from '../App';
import { profileAPI } from '../utils/api';

interface ProfileSetupProps {
  onNext: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  userId: string;
}

export function ProfileSetup({ onNext, onProfileUpdate, userId }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [genderPreference, setGenderPreference] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const predefinedInterests = [
    'Sports', 'Gaming', 'Music', 'Art', 'Technology', 'Food', 'Movies', 
    'Fitness', 'Reading', 'Travel', 'Photography', 'Dance'
  ];

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Extract first and last name from the name field
      const nameParts = name.trim().split(' ');
      const first = nameParts[0] || '';
      const last = nameParts.slice(1).join(' ') || '';
      
      // Call the backend API to update profile
      await profileAPI.update({
        uid: userId,
        first,
        last,
        interests
      });
      
      const profile: UserProfile = {
        name,
        year,
        interests,
        preferences: {
          groupSize,
          genderPreference,
          timePreference
        },
        community: ''
      };
      
      onProfileUpdate(profile);
      onNext();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && year && interests.length > 0 && groupSize && genderPreference && timePreference;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Set Up Your Profile</CardTitle>
          <p className="text-muted-foreground">Tell us about yourself so we can match you with the right events</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Public Username</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How others will see you (e.g., @username)"
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year/Status</Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., Freshman, Exchange Student"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (interests.includes(interest)) {
                      removeInterest(interest);
                    } else {
                      addInterest(interest);
                    }
                  }}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add custom interest"
                onKeyPress={(e) => e.key === 'Enter' && addInterest(newInterest)}
              />
              <Button 
                variant="outline" 
                onClick={() => addInterest(newInterest)}
                disabled={!newInterest}
              >
                Add
              </Button>
            </div>
            
            {interests.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Selected interests:</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInterests([])}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} className="flex items-center gap-1 pr-1">
                      {interest}
                      <button
                        type="button"
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeInterest(interest);
                        }}
                      >
                        <X className="w-3 h-3 hover:text-destructive transition-colors" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div>
            <Label>Group Size Preference</Label>
            <RadioGroup value={groupSize} onValueChange={setGroupSize} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">Small groups (2-5 people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium groups (6-15 people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">Large groups (15+ people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Any size</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Gender Preference for Events</Label>
            <RadioGroup value={genderPreference} onValueChange={setGenderPreference} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed">Mixed gender events</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same" id="same" />
                <Label htmlFor="same">Same gender preferred</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-preference" id="no-preference" />
                <Label htmlFor="no-preference">No preference</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Time Preference</Label>
            <RadioGroup value={timePreference} onValueChange={setTimePreference} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning">Morning person (8am-12pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="afternoon" />
                <Label htmlFor="afternoon">Afternoon (12pm-6pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" />
                <Label htmlFor="evening">Evening (6pm-11pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible">Flexible</Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Saving Profile...' : 'Continue to Community Selection'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}