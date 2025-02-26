"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UsernamePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.replace(`/dashboard/${username}`);
  }, [username, router]);

  // Return null as this page will redirect immediately
  return null;
}
