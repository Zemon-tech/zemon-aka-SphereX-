"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import UserAvatar from "./UserAvatar";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    const handleAuthChange = (event: CustomEvent) => {
      setUser(event.detail);
    };

    window.addEventListener('auth-state-change', handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('auth-state-change', handleAuthChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const event = new CustomEvent('auth-state-change', { detail: null });
    window.dispatchEvent(event);
    window.location.href = '/';
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Repos", path: "/repos" },
    { name: "Store", path: "/store" },
    { name: "Events", path: "/events" },
    { name: "Community", path: "/community" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Zemon</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-primary
                  ${pathname === item.path ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.name}
                {isClient && pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    layoutId="navbar-underline"
                  />
                )}
              </Link>
            ))}
            {isClient && (user ? (
              <UserAvatar 
                user={user} 
                onLogout={handleLogout}
                showDashboard={true}
              />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && isClient && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent
                    ${pathname === item.path ? "text-primary bg-accent" : "text-muted-foreground"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="px-4">
                  <UserAvatar 
                    user={user} 
                    onLogout={handleLogout}
                    showDashboard={true}
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
} 