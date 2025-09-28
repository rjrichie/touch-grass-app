import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff, Sprout, Flower, TreePine, Mountain } from 'lucide-react';
import { Illustrations } from './Illustrations';
import { authAPI, ApiError } from '../utils/api';
import { setCookie, COOKIE_NAMES } from '../utils/cookies';

interface SignupProps {
  onSignup: (userId: string) => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

export function Signup({ onSignup, onSwitchToLogin, onBack, onShowTerms, onShowPrivacy }: SignupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');
    
    try {
      // Call the registration API
      const response = await authAPI.register({
        first: formData.firstName,
        last: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // Store the JWT token and user ID in cookies
      setCookie(COOKIE_NAMES.AUTH_TOKEN, response.token, 7); // 7 days
      setCookie(COOKIE_NAMES.USER_ID, response.user.id, 7);

      setIsLoading(false);
      // Call the success callback with the user ID
      onSignup(response.user.id);
      
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle API errors
      if (error && typeof error === 'object' && 'error' in error) {
        setApiError(error.error || 'Registration failed. Please try again.');
      } else {
        setApiError('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 opacity-20">
          <Illustrations.FlowerBunch className="w-20 h-20 text-primary" />
        </div>
        <div className="absolute top-16 right-12 opacity-15">
          <TreePine className="w-24 h-24 text-primary/80" />
        </div>
        <div className="absolute bottom-16 left-16 opacity-25">
          <Illustrations.TreeSilhouette className="w-28 h-28 text-primary/60" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <Illustrations.GrassCluster className="w-18 h-18 text-primary/70" />
        </div>
        <div className="absolute top-1/4 left-1/3 opacity-10">
          <Mountain className="w-36 h-36 text-primary/50" />
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-15">
          <Flower className="w-16 h-16 text-primary/60" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-12">
          <Illustrations.LeafPattern className="w-24 h-24 text-primary/40" />
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
              
              <CardTitle className="text-foreground">Join Our Community</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create your account and start discovering meaningful connections
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-input-background border-primary/20 focus:border-primary"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-input-background border-primary/20 focus:border-primary"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-input-background border-primary/20 focus:border-primary"
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
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
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-input-background border-primary/20 focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <button type="button" onClick={onShowTerms} className="text-primary hover:underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" onClick={onShowPrivacy} className="text-primary hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-destructive">{errors.terms}</p>
                )}

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
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <div className="relative">
                  <Separator className="bg-border" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                    or
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={onSwitchToLogin}
                    className="w-full border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Sign In
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