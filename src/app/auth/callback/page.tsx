'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { API_BASE_URL } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase session error:', error);
          throw error;
        }

        if (!session?.user) {
          console.error('No session or user data found');
          throw new Error('No session');
        }

        // Get user data from GitHub session
        const { user } = session;
        
        // Log the user metadata for debugging
        console.log('GitHub user metadata:', user.user_metadata);
        
        const githubData = {
          name: user.user_metadata.full_name || user.user_metadata.name || user.user_metadata.user_name,
          email: user.email,
          avatar: user.user_metadata.avatar_url,
          github_username: user.user_metadata.user_name,
          github: user.user_metadata.user_name,
          role: 'user', // Add default role
          _id: user.id, // Add user ID from Supabase
        };

        // Log the data being sent to the backend
        console.log('Data being sent to backend:', githubData);

        // Sync with MongoDB
        const response = await fetch(`${API_BASE_URL}/api/auth/github/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(githubData),
        });

        const data = await response.json();
        console.log('Response from backend:', data);

        if (!response.ok) {
          console.error('MongoDB sync error:', data);
          throw new Error(data.message || 'Failed to sync with MongoDB');
        }

        // Store token and user data - ensure we're storing the correct structure
        const userData = {
          _id: data.data.user._id || data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
          avatar: data.data.user.avatar,
          github_username: data.data.user.github_username,
          github: data.data.user.github,
          role: data.data.user.role || 'user',
        };

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Dispatch auth state change event
        const event = new CustomEvent('auth-state-change', { 
          detail: userData 
        });
        window.dispatchEvent(event);

        // Check for error in URL params and redirect accordingly
        const error_description = searchParams.get('error_description');
        if (error_description) {
          router.push(`/login?error=${encodeURIComponent(error_description)}`);
        } else {
          // Redirect to password setup if this is a new user
          console.log('Is new user:', data.data.isNewUser);
          if (data.data.isNewUser) {
            router.push('/setup-password');
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed')}`);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 