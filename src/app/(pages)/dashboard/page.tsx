"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateUserData } from '@/utils/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          console.log('No user found in localStorage');
          router.push('/login');
          return;
        }

    try {
      // Get user data from localStorage
        const userData = JSON.parse(storedUser);
        if (!validateUserData(userData)) {
          console.error('Invalid user data structure:', userData);
          router.push('/login');
          return;
        }

      // Redirect to the user's dashboard
      const username = userData.displayName || userData.name;
      router.push(`/dashboard/${username}`);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  // Return empty div while redirecting
  return <div></div>;
} 