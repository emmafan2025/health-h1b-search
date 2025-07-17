
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

const EmailSubscription = () => {
  const { t } = useTranslation();
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
      <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">{t.email.thankYou}</h3>
              <p className="text-gray-600">{t.email.successMessage}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              {t.email.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600 text-center mb-6">
              {t.email.subtitle}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder={t.email.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 rounded-xl"
              >
                {t.email.subscribe}
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              {t.email.privacy}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailSubscription;
