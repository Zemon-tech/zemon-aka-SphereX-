"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Github,
  Linkedin,
  Link as LinkIcon,
  Save,
  AlertTriangle,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  name: string;
  displayName: string;
  email: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  personalWebsite?: string;
  company?: string;
  role?: string;
  education?: {
    university?: string;
    graduationYear?: number;
  };
  password?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Get existing user data from localStorage
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Merge the updated data with existing user data
        const updatedUserData = {
          ...existingUser,
          ...data.data,
          linkedin: data.data.linkedin || "",
          personalWebsite: data.data.personalWebsite || "",
        };

        // Update local storage with merged data
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Update profile state
        setProfile(updatedUserData);

        // Dispatch auth state change event with merged data
        const event = new CustomEvent("auth-state-change", {
          detail: updatedUserData,
        });
        window.dispatchEvent(event);

        // Fetch fresh data from the server
        await fetchProfile();

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        // Close the dialog
        setIsDialogOpen(false);

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Show success message
        toast({
          title: "Success",
          description: "Your account has been deleted successfully",
        });

        // Redirect to home page
        router.push("/");
      } else {
        throw new Error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract fetchProfile function to be reusable
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        // Update local storage with complete profile data
        const updatedProfile = {
          ...data.data,
          linkedin: data.data.linkedin || "",
          personalWebsite: data.data.personalWebsite || "",
        };
        setProfile(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));

        // Automatically save the profile to ensure data consistency
        try {
          const saveResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updatedProfile),
            }
          );

          const saveData = await saveResponse.json();
          if (saveData.success) {
            // Update local storage with saved data
            localStorage.setItem("user", JSON.stringify(saveData.data));

            // Dispatch auth state change event
            const event = new CustomEvent("auth-state-change", {
              detail: saveData.data,
            });
            window.dispatchEvent(event);
          }
        } catch (saveError) {
          console.error("Error auto-saving profile:", saveError);
        }
      } else {
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add an interval to periodically fetch profile data
  useEffect(() => {
    fetchProfile();

    // Set up an interval to fetch profile data every 30 seconds
    const intervalId = setInterval(fetchProfile, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Your GitHub profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile?.avatar} />
                      <AvatarFallback>
                        {profile?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        value={profile?.name || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile?.displayName || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            displayName: e.target.value,
                          }))
                        }
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile?.role || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile?.company || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Where do you work?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">College/University</Label>
                      <Input
                        id="university"
                        value={profile?.education?.university || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            education: {
                              ...prev?.education,
                              university: e.target.value,
                            },
                          }))
                        }
                        placeholder="University name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        min={1900}
                        max={new Date().getFullYear() + 10}
                        value={profile?.education?.graduationYear || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            education: {
                              ...prev?.education,
                              graduationYear:
                                parseInt(e.target.value) || undefined,
                            },
                          }))
                        }
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5" />
                      <Input
                        value={profile?.github || ""}
                        disabled
                        className="bg-muted"
                        placeholder="GitHub username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5" />
                      <Input
                        value={profile?.linkedin || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            linkedin: e.target.value,
                          }))
                        }
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5" />
                      <Input
                        value={profile?.personalWebsite || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            personalWebsite: e.target.value,
                          }))
                        }
                        placeholder="Portfolio website URL"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password Management</CardTitle>
                  <CardDescription>
                    View your current password and set a new one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const newPassword = (
                        form.elements.namedItem(
                          "newPassword"
                        ) as HTMLInputElement
                      ).value;

                      if (!newPassword || newPassword.length < 6) {
                        toast({
                          title: "Error",
                          description:
                            "Password must be at least 6 characters long",
                          variant: "destructive",
                        });
                        return;
                      }

                      try {
                        setIsSaving(true);
                        const token = localStorage.getItem("token");
                        if (!token) throw new Error("Not authenticated");

                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              password: newPassword,
                            }),
                          }
                        );

                        const data = await response.json();
                        if (data.success) {
                          toast({
                            title: "Success",
                            description: "Password updated successfully",
                          });
                          form.reset();
                        } else {
                          throw new Error(
                            data.message || "Failed to update password"
                          );
                        }
                      } catch (error) {
                        console.error("Error updating password:", error);
                        toast({
                          title: "Error",
                          description:
                            error instanceof Error
                              ? error.message
                              : "Failed to update password",
                          variant: "destructive",
                        });
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Current Password (Hashed)
                      </Label>
                      <Input
                        id="currentPassword"
                        value={profile?.password || ""}
                        disabled
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is your current hashed password (visible for
                        development)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border border-destructive p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Once you delete your account, there is no going
                            back. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                              {isDeleting ? "Deleting..." : "Delete Account"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove all
                                your data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isDeleting}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            {/* Integrations content */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage your connected services and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Add integrations settings here */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
