import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, Copy, ExternalLink, Clock, Check, BookOpen } from "lucide-react";
import xhsQrCode from "@/assets/xiaohongshu-qr.jpg";

const CONTACT_EMAIL = "pengxiaowanli.service@gmail.com";
const XHS_ACCOUNT = "鹏霄万里 康复留学";

const Contact = () => {
  const { t, language } = useTranslation();
  const isZh = language === "zh";

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedXhs, setCopiedXhs] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const copyToClipboard = async (text: string, type: "email" | "xhs") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedXhs(true);
        setTimeout(() => setCopiedXhs(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const errReq = t.contact.form.errorRequired;
    if (!name.trim()) e.name = errReq;
    if (!email.trim()) {
      e.email = errReq;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = t.contact.form.errorEmail;
    }
    if (!topic) e.topic = errReq;
    if (!message.trim()) e.message = errReq;
    if (!consent) e.consent = errReq;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Since no backend form service is wired yet, open mailto as fallback
    const subject = encodeURIComponent(`[Contact Form] ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\nLocale: ${language}\nTime: ${new Date().toISOString()}\n\nMessage:\n${message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");

    setSubmitting(false);
    setSubmitted(true);
    toast({
      title: "✓",
      description: t.contact.form.success,
    });
  };

  const topicOptions = [
    { value: "h1b", label: t.contact.form.topics.h1b },
    { value: "greenCard", label: t.contact.form.topics.greenCard },
    { value: "dpt", label: t.contact.form.topics.dpt },
    { value: "other", label: t.contact.form.topics.other },
  ];

  return (
    <>
      <Helmet>
        <title>{isZh ? "联系我们 | 鹏霄万里" : "Contact Us | Pengxiaowanli"}</title>
        <meta name="description" content={t.contact.metaDesc} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-muted/30">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.contact.title}</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">{t.contact.subtitle}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 space-y-10">
          {/* Quick Contact Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Email Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  {t.contact.email.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground break-all">{CONTACT_EMAIL}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(CONTACT_EMAIL, "email")}
                    aria-label={t.contact.email.copy}
                  >
                    {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedEmail ? t.contact.email.copied : t.contact.email.copy}
                  </Button>
                  <Button size="sm" asChild>
                    <a href={`mailto:${CONTACT_EMAIL}`} aria-label={t.contact.email.send}>
                      <ExternalLink className="h-4 w-4" />
                      {t.contact.email.send}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Xiaohongshu Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t.contact.xiaohongshu.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{XHS_ACCOUNT}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(XHS_ACCOUNT, "xhs")}
                  aria-label={t.contact.xiaohongshu.copyName}
                >
                  {copiedXhs ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedXhs ? t.contact.email.copied : t.contact.xiaohongshu.copyName}
                </Button>
                <p className="text-xs text-muted-foreground">{t.contact.xiaohongshu.searchNote}</p>
                <div className="mt-2">
                  <img src={xhsQrCode} alt={t.contact.xiaohongshu.qrPlaceholder} className="w-full max-w-[200px] rounded-lg mx-auto" />
                </div>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  {t.contact.responseTime.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.contact.responseTime.content}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <h2 className="text-xl font-semibold leading-none tracking-tight">{t.contact.form.heading}</h2>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8 space-y-2">
                  <Check className="h-10 w-10 text-primary mx-auto" />
                  <p className="font-medium">{t.contact.form.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">{t.contact.form.name} *</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.form.namePlaceholder}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">{t.contact.form.email} *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.contact.form.emailPlaceholder}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  {/* Topic */}
                  <div className="space-y-1.5">
                    <Label>{t.contact.form.topic} *</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger aria-invalid={!!errors.topic}>
                        <SelectValue placeholder={t.contact.form.topicPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {topicOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.topic && <p className="text-sm text-destructive">{errors.topic}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">{t.contact.form.message} *</Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.contact.form.messagePlaceholder}
                      rows={5}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="contact-consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                      aria-invalid={!!errors.consent}
                    />
                    <Label htmlFor="contact-consent" className="text-sm leading-snug font-normal">
                      {t.contact.form.consent} *
                    </Label>
                  </div>
                  {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? t.contact.form.submitting : t.contact.form.submit}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto text-xs text-muted-foreground text-center pb-8">
            {t.contact.disclaimer}
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
