import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Video,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const handleSendMessage = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      alert("⚠️ Please fill in both subject and message fields.");
      return;
    }

    // Simulate sending message
    alert(
      `📧 Message Sent Successfully!\n\nSubject: ${contactForm.subject}\n\nWe'll get back to you within 24 hours at chaitanya@sonicly.app`,
    );

    // Clear form
    setContactForm({ subject: "", message: "" });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: () => {
        alert(
          "💬 Live Chat: Opening chat widget...\n\n🤖 Hi! I'm the Sonicly AI assistant. How can I help you today?",
        );
        // In a real app, this would open live chat widget
      },
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: () => {
        window.location.href =
          "mailto:support@sonicly.app?subject=Sonicly Support Request&body=Hi Sonicly Team,%0A%0APlease describe your issue here...";
      },
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "Talk to our experts directly",
      action: () => {
        alert(
          "📞 Call Support: +1-800-SONICLY\n\n⏰ Support Hours:\nMonday-Friday: 9 AM - 6 PM PST\nWeekend: 10 AM - 4 PM PST",
        );
        // In a real app, this might open phone dialer on mobile
      },
    },
  ];

  const resources = [
    {
      icon: Book,
      title: "User Guide",
      description: "Complete guide to using Sonicly",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
    },
  ];

  const faqs = [
    {
      id: "1",
      question: "How do I upload my music files?",
      answer:
        "You can upload music files by clicking the '+' button in the playlist area or by using the 'Scan Device' feature to automatically detect music files on your device.",
    },
    {
      id: "2",
      question: "What audio formats are supported?",
      answer:
        "We support most common audio formats including MP3, WAV, FLAC, AAC, OGG, and M4A files.",
    },
    {
      id: "3",
      question: "How do I create playlists?",
      answer:
        "Click on the playlist icon in the header, then select 'Create New Playlist'. You can add songs by dragging them from your library or using the '+' button next to each track.",
    },
    {
      id: "4",
      question: "Can I use the app offline?",
      answer:
        "Yes! With a Premium subscription, you can download songs for offline listening. Look for the download icon next to each track.",
    },
    {
      id: "5",
      question: "How do I change the audio quality?",
      answer:
        "Go to Settings > Audio > Audio Quality and select your preferred quality level. Higher quality requires more storage space.",
    },
    {
      id: "6",
      question: "Is my music data secure?",
      answer:
        "Absolutely! All your music files are stored locally on your device. We use end-to-end encryption for any data that's synced to the cloud.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Help & Support</h1>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Offline Mode
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Search */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white cursor-pointer hover:bg-white/15 transition-colors"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQs */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription className="text-gray-300">
              Find answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openFaq === faq.id}
                onOpenChange={(isOpen) => setOpenFaq(isOpen ? faq.id : null)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                  <span className="font-medium">{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-gray-300 mt-2">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle>Helpful Resources</CardTitle>
            <CardDescription className="text-gray-300">
              Learn more about using Sonicly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Icon className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription className="text-gray-300">
              Send us a message and we'll get back to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                placeholder="What do you need help with?"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Describe your issue in detail..."
                className="bg-white/10 border-white/20 text-white min-h-[120px]"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
