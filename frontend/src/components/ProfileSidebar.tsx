import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Edit, MapPin, Clock, Users, Heart, LogOut } from 'lucide-react';
import { UserProfile } from '../App';
import { userAPI, UserStatsResponse } from '../utils/api';

interface ProfileSidebarProps {
  userProfile: UserProfile;
  onEdit: () => void;
  onLogout?: () => void;
  userId: string;
}

export function ProfileSidebar({ userProfile, onEdit, onLogout, userId }: ProfileSidebarProps) {
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await userAPI.getStats(userId);
        setUserStats(stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStats();
    }
  }, [userId]);
  const getGroupSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small groups (2-5)';
      case 'medium': return 'Medium groups (6-15)';
      case 'large': return 'Large groups (15+)';
      default: return 'Any size';
    }
  };

  const getGenderPreferenceLabel = (pref: string) => {
    switch (pref) {
      case 'mixed': return 'Mixed gender';
      case 'same': return 'Same gender preferred';
      default: return 'No preference';
    }
  };

  const getTimePreferenceLabel = (time: string) => {
    switch (time) {
      case 'morning': return 'Morning (8am-12pm)';
      case 'afternoon': return 'Afternoon (12pm-6pm)';
      case 'evening': return 'Evening (6pm-11pm)';
      default: return 'Flexible';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Your Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-foreground mb-1">{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.year}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {userProfile.community === 'georgia-tech' ? 'Georgia Tech' : userProfile.community}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm text-foreground mb-2 flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Interests
            </h4>
            <div className="flex flex-wrap gap-1">
              {userProfile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm text-foreground">Preferences</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{getGroupSizeLabel(userProfile.preferences.groupSize)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{getTimePreferenceLabel(userProfile.preferences.timePreference)}</span>
              </div>
              
              <div className="text-muted-foreground">
                <span className="text-muted-foreground">Gender:</span> {getGenderPreferenceLabel(userProfile.preferences.genderPreference)}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm text-foreground mb-2">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {userProfile.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading stats...</div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Events seen</span>
                <span className="text-foreground">{userStats?.eventsSeen || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Events attended</span>
                <span className="text-foreground">{userStats?.eventsAttended || 0}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {onLogout && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}