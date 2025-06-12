
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
    }
  };

  if (isSubscribed) {
    return (
      <div className="w-full bg-blue-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white shadow-md">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">You've successfully subscribed to our H1B and Immigration Updates Newsletter.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-white shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-blue-800 flex items-center justify-center gap-2">
              <Mail className="h-6 w-6" />
              H1B and Immigration Updates Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 text-center mb-6">
              Subscribe and get H1B, Green Card, USCIS, and fresh data updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailSubscription;
