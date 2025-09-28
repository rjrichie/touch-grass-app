import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card className="shadow-natural">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              Effective Date: December 2024
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as your name, email address, academic year, 
                interests, and preferences. We also collect information about your usage of our service to improve 
                your experience and provide better event recommendations.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To create and manage your account</li>
                <li>To match you with relevant events and other users</li>
                <li>To facilitate communication between event participants</li>
                <li>To improve our AI-powered event recommendation system</li>
                <li>To send you important updates about your account or events</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except as described in this policy. We may share your basic profile information (name, year, interests) 
                with other participants of events you join to facilitate connections.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">5. AI and Data Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AI system processes your preferences and interests to recommend relevant events and potential connections. 
                This processing is done to enhance your experience and is based on the information you voluntarily provide.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services. 
                You may request deletion of your account and associated data at any time.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communications</li>
                <li>Export your data in a machine-readable format</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">8. College Community Focus</h2>
              <p className="text-muted-foreground leading-relaxed">
                Touch Grass is designed specifically for college communities. We verify student status through institutional 
                email addresses to maintain the integrity and safety of our community environment.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify users of any significant changes 
                and post the updated policy on this page with a new effective date.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at privacy@touchgrass.app
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}