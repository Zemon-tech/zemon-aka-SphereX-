"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, Code, Users, Star, GitBranch, Wrench, Calendar, 
  Newspaper, CheckCircle, Sparkles, MessageSquare, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  github_username?: string;
  github?: string;
  phone?: string;
  role?: string;
  linkedin?: string;
  personalWebsite?: string;
  displayName?: string;
  education?: {
    university?: string;
    graduationYear?: string;
  };
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Open Source Projects",
      description: "Discover and contribute to innovative projects from developers worldwide",
      link: "/repos",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Developer Tools",
      description: "Find the best tools to enhance your development workflow",
      link: "/store",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Tech Events",
      description: "Stay updated with hackathons, workshops, and conferences",
      link: "/events",
    },
    {
      icon: <Newspaper className="w-6 h-6" />,
      title: "Tech News",
      description: "Get the latest updates from the tech world",
      link: "/news",
    },
  ];

  const stats = [
    { number: "50K+", label: "Elite Developers" },
    { number: "10K+", label: "Successful Projects" },
    { number: "2M+", label: "Monthly Visitors" },
    { number: "150+", label: "Partner Companies" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      content: "Zemon has transformed how I collaborate on open source projects. The community is incredibly supportive!",
    },
    {
      name: "Alex Kumar",
      role: "Tech Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      content: "The quality of projects and tools I've discovered here is outstanding. A must-have for any serious developer.",
    },
    {
      name: "Maria Rodriguez",
      role: "Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      content: "The developer community here is amazing. I've learned so much from collaborating with others.",
    },
  ];

  const highlights = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "Active Community Support" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Weekly Tech Events" },
    { icon: <MessageSquare className="w-5 h-5" />, text: "Expert Discussions" },
    { icon: <Heart className="w-5 h-5" />, text: "Open Source First" },
  ];

  useEffect(() => {
    const checkUserAndAlert = async () => {
      // Check if user is logged in
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      console.log('Stored user data:', storedUser);
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Simulate "Save Changes" by making a profile update API call
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: userData.name,
              displayName: userData.displayName,
              github: userData.github,
              linkedin: userData.linkedin,
              personalWebsite: userData.personalWebsite,
              education: userData.education
            })
          });

          const data = await response.json();
          if (data.success) {
            console.log('Profile data refreshed:', data.data);
            // Update local storage with fresh data
            localStorage.setItem('user', JSON.stringify(data.data));
            setUser(data.data);
          }
        } catch (error) {
          console.error('Error refreshing profile data:', error);
        }

        // Clear the ignored state on new login session
        const lastLoginTime = localStorage.getItem('last_login_time');
        const currentTime = new Date().getTime();
        
        if (!lastLoginTime || (currentTime - parseInt(lastLoginTime)) > 1000 * 60 * 60) {
          console.log('New login session detected, clearing ignored state');
          localStorage.removeItem('profile_alert_ignored');
          localStorage.setItem('last_login_time', currentTime.toString());
        }

        const hasIncompleteProfile = !userData.education?.university || 
                                   !userData.education?.graduationYear || 
                                   !userData.linkedin || 
                                   !userData.personalWebsite;

        const isIgnored = localStorage.getItem('profile_alert_ignored');

        console.log('Profile completion status:', {
          isIgnored,
          hasIncompleteProfile,
          education: userData.education,
          linkedin: userData.linkedin,
          personalWebsite: userData.personalWebsite
        });

        setShowProfileAlert(hasIncompleteProfile && !isIgnored);
      } else {
        setUser(null);
        setShowProfileAlert(false);
      }
    };

    // Initial check
    checkUserAndAlert();

    // Listen for auth state changes
    const handleAuthChange = () => {
      console.log('Auth state changed, rechecking profile alert');
      checkUserAndAlert();
    };

    window.addEventListener('auth-state-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, []);

  const handleIgnoreAlert = () => {
    setShowProfileAlert(false);
    localStorage.setItem('profile_alert_ignored', 'true');
  };

  // Handle logout
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('profile_alert_ignored');
      localStorage.removeItem('last_login_time');
      setUser(null);
      setShowProfileAlert(false);
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Profile Completion Alert - Updated to full-width banner */}
      {showProfileAlert && user && (
        <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-y">
          <div className="container mx-auto py-2">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  Complete your profile to unlock all features:-
                  {!user.education?.university && " ( University ) "}
                  {!user.education?.graduationYear && " ( Graduation Year ) "}
                  {!user.linkedin && " ( LinkedIn ) "}
                  {!user.personalWebsite && " ( Personal Website ) "}
                  {!user.displayName && " ( Display Name ) "}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={handleIgnoreAlert}
                  className="text-sm h-8"
                >
                  Ignore
                </Button>
                <Button 
                  onClick={() => router.push('/settings')}
                  size="sm"
                  className="h-8"
                >
                  Complete Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Enhanced with better gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)'
            }}
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(0)"
              >
                <rect width="100%" height="100%" fill="none" />
                <path
                  d="M0 0h40v40H0z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-900/[0.05]"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <Badge className="px-4 py-2 rounded-full mb-4" variant="secondary">
              🚀 Join 10,000+ developers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b]">
              Build Your Tech Legacy
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with elite developers, showcase your innovations, and shape the future of technology.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Opportunities
              </Button>
            </div>
            <div className="pt-8 flex justify-center gap-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Smoother transition */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="bg-background/60 backdrop-blur-sm border-primary/5 hover:border-primary/20 transition-all">
                <CardContent className="p-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">{stat.number}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean background */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">
              A complete platform for developers to learn, share, and grow together
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link href={feature.link} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-lg border bg-gradient-to-br from-background to-muted/30 hover:border-primary/50 transition-all h-full group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Subtle gradient */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold">Loved by Developers</h2>
            <p className="text-muted-foreground mt-2">
              See what our community members have to say
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-background/60 backdrop-blur-sm hover:border-primary/20 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Clean background */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Featured Projects</Badge>
            <h2 className="text-3xl font-bold">Trending This Week</h2>
            <p className="text-muted-foreground mt-2">
              Discover popular projects from our community
            </p>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="justify-center mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web Dev</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="ai">AI/ML</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add project cards here */}
              </div>
            </TabsContent>
            {/* Add other tab contents */}
          </Tabs>
        </div>
      </section>

      {/* Community Section - Gradient background */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-primary/5">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Where Innovation Happens</h2>
              <p className="text-muted-foreground">
                Be part of an elite network of developers building the next generation of technology. Your expertise and innovations deserve a powerful platform.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Elite Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <span>Industry Leaders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Top Opportunities</span>
                </div>
              </div>
              <Button className="gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-card border animate-pulse" />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final gradient */}
      <section className="relative py-24 bg-gradient-to-b from-background to-muted">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <Badge variant="secondary" className="mb-4">Limited Access</Badge>
            <h2 className="text-3xl font-bold">Ready to Make an Impact?</h2>
            <p className="text-muted-foreground">
              Join an exclusive platform where top developers collaborate on groundbreaking projects.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Benefits
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
