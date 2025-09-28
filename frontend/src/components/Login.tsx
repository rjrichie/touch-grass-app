import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Eye, EyeOff, TreePine, Sprout, Mountain } from 'lucide-react';
import { Illustrations } from './Illustrations';
import { authAPI, ApiError } from '../utils/api';
import { setCookie, COOKIE_NAMES } from '../utils/cookies';

interface LoginProps {
  onLogin: (userId: string) => void;
  onSwitchToSignup: () => void;
  onBack: () => void;
}

export function Login({ onLogin, onSwitchToSignup, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');
    
    try {
      // Call the login API
      const response = await authAPI.login(email, password);

      // Store the JWT token and user ID in cookies
      setCookie(COOKIE_NAMES.AUTH_TOKEN, response.token, 7); // 7 days
      setCookie(COOKIE_NAMES.USER_ID, response.user.id, 7);

      setIsLoading(false);
      // Call the success callback with the user ID
      onLogin(response.user.id);
      
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle API errors
      if (error && typeof error === 'object' && 'error' in error) {
        setApiError(error.error || 'Login failed. Please try again.');
      } else {
        setApiError('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20">
          <Illustrations.TreeSilhouette className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute top-20 right-16 opacity-15">
          <Illustrations.FlowerBunch className="w-20 h-20 text-primary/80" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-25">
          <Illustrations.GrassCluster className="w-16 h-16 text-primary/60" />
        </div>
        <div className="absolute bottom-32 right-12 opacity-20">
          <Mountain className="w-28 h-28 text-primary/70" />
        </div>
        <div className="absolute top-1/3 left-1/4 opacity-10">
          <Illustrations.LeafPattern className="w-32 h-32 text-primary/50" />
        </div>
        <div className="absolute top-2/3 right-1/3 opacity-15">
          <TreePine className="w-20 h-20 text-primary/60" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-natural texture-paper border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              {/* Logo Section */}
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="relative">
                  <Sprout className="w-8 h-8 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/30"></div>
                </div>
                <span className="text-2xl font-medium text-primary">Touch Grass</span>
              </div>
              
              <CardTitle className="text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue your journey and discover new connections
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (apiError) setApiError('');
                    }}
                    className="bg-input-background border-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (apiError) setApiError('');
                      }}
                      className="bg-input-background border-primary/20 focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {apiError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{apiError}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 shadow-natural"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </button>

                <div className="relative">
                  <Separator className="bg-border" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                    or
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    New to Touch Grass?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={onSwitchToSignup}
                    className="w-full border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Welcome */}
          <div className="text-center mt-6">
            <button 
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center space-x-1"
            >
              <span>← Back to Welcome</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    </div>
  );
}