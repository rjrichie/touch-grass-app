import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Calendar, Sparkles, Bot, Sprout } from 'lucide-react';
import { WelcomeIllustration, PeopleConnectingIllustration, SmartOrganizationIllustration, CommunityIllustration, SmallDecorationIllustration } from './Illustrations';

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function WelcomeScreen({ onLogin, onSignup }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 texture-paper relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 opacity-30">
        <SmallDecorationIllustration className="w-12 h-12" />
      </div>
      <div className="absolute top-20 right-16 opacity-40">
        <SmallDecorationIllustration className="w-8 h-8" />
      </div>
      <div className="absolute bottom-16 left-20 opacity-25">
        <SmallDecorationIllustration className="w-10 h-10" />
      </div>
      <div className="absolute bottom-32 right-12 opacity-35">
        <SmallDecorationIllustration className="w-6 h-6" />
      </div>
      
      <Card className="max-w-2xl w-full p-8 text-center texture-organic shadow-natural border-organic relative z-10">
        <div className="mb-6 flex justify-center">
          <WelcomeIllustration className="w-full h-50" />
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Sprout className="w-10 h-10 text-primary" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/30"></div>
          </div>
          <h1 className="text-4xl font-medium text-primary tracking-wide">Touch Grass</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Step outside your comfort zone and into real connections. 
          New to campus? Let us help you find events and people that match your vibe.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 bg-accent/20 rounded-lg border-organic texture-grass">
            <div className="mb-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <PeopleConnectingIllustration className="w-14 h-14" />
              </div>
            </div>
            <h3 className="text-foreground mb-2">AI-Powered Matching</h3>
            <p className="text-sm text-muted-foreground">
              Our AI organizes events and matches you with people based on your preferences and comfort level
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-accent/20 rounded-lg border-organic texture-wood">
            <div className="mb-3">
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center border-2 border-orange/20">
                <SmartOrganizationIllustration className="w-14 h-14 flex-shrink-0" />
              </div>
            </div>
            <h3 className="text-foreground mb-2">Smart Organization</h3>
            <p className="text-sm text-muted-foreground">
              Just tell our AI what you want to do, and it'll create and organize the perfect event for you
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-accent/20 rounded-lg border-organic texture-stone">
            <div className="mb-3">
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center border-2 border-orange/20">
                <CommunityIllustration className="w-14 h-14 flex-shrink-0" />
              </div>
            </div>
            <h3 className="text-foreground mb-2">Community First</h3>
            <p className="text-sm text-muted-foreground">
              Join your college community and meet people who share your interests in real life
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onSignup}
            size="lg"
            className="w-full md:w-80 px-8 bg-primary hover:bg-primary/90 shadow-lg"
          >
            Create Account
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Already have an account?
            </p>
            <Button 
              onClick={onLogin}
              size="lg"
              className="w-full md:w-80 px-8 bg-orange text-orange-foreground hover:bg-orange/90 shadow-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}