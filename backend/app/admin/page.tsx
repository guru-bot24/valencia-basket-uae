"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Calendar, Plus, Pencil, Trash2, Trophy, LogOut, Shield, Lock, Search } from "lucide-react";
import { CopyValueButton, SeoManager } from "./SeoManager";
import { BlogManager } from "./BlogManager";
import { useToast } from "@/hooks/use-toast";
import type {
  TrialBooking,
  EventRegistration,
  Event,
  InsertEvent,
} from "@shared/schema";

interface AdminAuthUser {
  id: string;
  username: string;
  role: string;
}

function LoginScreen({ onLogin }: { onLogin: (user: AdminAuthUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      const data = await res.json();
      onLogin(data.user);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-black text-white p-8 text-center mb-0">
          <Lock className="h-12 w-12 mx-auto mb-4 text-[#FF6C0E]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter" data-testid="text-login-title">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-2">Valencia Basket UAE Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm" data-testid="text-login-error">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="username" className="text-sm font-bold uppercase tracking-wider">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="mt-1 rounded-none"
              data-testid="input-login-username"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 rounded-none"
              data-testid="input-login-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6C0E] hover:bg-[#ff8534] text-white uppercase font-bold tracking-wider rounded-none h-12"
            data-testid="button-login-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function UserManagementDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: users = [] } = useQuery<{ id: string; username: string; role: string; createdAt: string }[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: open,
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setNewUsername("");
      setNewPassword("");
      toast({ title: "User created successfully" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User deleted" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    createUserMutation.mutate({ username: newUsername, password: newPassword });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">Manage Admin Users</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddUser} className="space-y-3 border-b pb-4 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-bold uppercase">Username</Label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="rounded-none mt-1"
                data-testid="input-new-admin-username"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase">Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="rounded-none mt-1"
                data-testid="input-new-admin-password"
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="bg-[#FF6C0E] hover:bg-[#ff8534] rounded-none uppercase font-bold text-xs" data-testid="button-add-admin-user">
            <Plus className="h-4 w-4 mr-1" /> Add User
          </Button>
        </form>

        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 border">
              <div>
                <span className="font-bold" data-testid={`text-admin-user-${user.id}`}>{user.username}</span>
                <span className="text-xs text-gray-400 ml-2 uppercase">{user.role}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600"
                data-testid={`button-delete-admin-user-${user.id}`}
                onClick={() => {
                  if (confirm(`Delete admin user "${user.username}"?`)) {
                    deleteUserMutation.mutate(user.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No admin users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function EventFormDialog({
  event,
  open,
  onOpenChange,
}: {
  event?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [endDate, setEndDate] = useState(event?.endDate ?? "");
  const [time, setTime] = useState(event?.time ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [status, setStatus] = useState(event?.status ?? "Registration Open");
  const [price, setPrice] = useState(event?.price ?? "");
  const [image, setImage] = useState(event?.image ?? "");
  const [imageAlt, setImageAlt] = useState(event?.imageAlt ?? event?.title ?? "");
  const [imageAltIsCustom, setImageAltIsCustom] = useState(Boolean(event?.imageAlt?.trim()));
  const [category, setCategory] = useState(event?.category ?? "Camp");
  const [featured, setFeatured] = useState(event?.featured ?? true);

  const createMutation = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event created successfully" });
      onOpenChange(false);
    },
    onError: () => toast({ title: "Failed to create event", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertEvent>) => {
      const res = await fetch(`/api/events/${event!.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event updated successfully" });
      onOpenChange(false);
    },
    onError: () => toast({ title: "Failed to update event", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: InsertEvent = {
      title,
      slug: slug || generateSlug(title),
      date,
      endDate,
      time,
      location,
      description,
      status,
      price: price || null,
      image: image || null,
      imageAlt: imageAltIsCustom ? imageAlt.trim() || null : null,
      category,
      featured,
    };
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="event-dialog-title">
            {isEditing ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                data-testid="input-event-title"
                value={title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  setTitle(nextTitle);
                  if (!isEditing) setSlug(generateSlug(nextTitle));
                  if (!imageAltIsCustom) setImageAlt(nextTitle);
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-slug">Slug</Label>
              <Input
                id="event-slug"
                data-testid="input-event-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                data-testid="input-event-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. June 15-20, 2026"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-end-date">End Date (for sorting past events)</Label>
              <Input
                id="event-end-date"
                data-testid="input-event-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                data-testid="input-event-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 9:00 AM - 3:00 PM"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              data-testid="input-event-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              data-testid="input-event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus} data-testid="select-event-status">
                <SelectTrigger data-testid="select-trigger-event-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registration Open" data-testid="select-item-registration-open">Registration Open</SelectItem>
                  <SelectItem value="Limited Spots" data-testid="select-item-limited-spots">Limited Spots</SelectItem>
                  <SelectItem value="Coming Soon" data-testid="select-item-coming-soon">Coming Soon</SelectItem>
                  <SelectItem value="Sold Out" data-testid="select-item-sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category || "Camp"} onValueChange={setCategory} data-testid="select-event-category">
                <SelectTrigger data-testid="select-trigger-event-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Camp" data-testid="select-item-camp">Camp</SelectItem>
                  <SelectItem value="International" data-testid="select-item-international">International</SelectItem>
                  <SelectItem value="Clinic" data-testid="select-item-clinic">Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-price">Price</Label>
              <Input
                id="event-price"
                data-testid="input-event-price"
                value={price || ""}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. AED 1,500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-image">Image Path</Label>
              <Input
                id="event-image"
                data-testid="input-event-image"
                value={image || ""}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/event-photo.jpg"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="event-image-alt">Image Alt Text (SEO)</Label>
                <CopyValueButton value={imageAlt} />
              </div>
              <Input
                id="event-image-alt"
                data-testid="input-event-image-alt"
                value={imageAlt}
                onChange={(e) => {
                  setImageAlt(e.target.value);
                  setImageAltIsCustom(true);
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-400">
                  {imageAltIsCustom ? "Custom image description." : "Using the event title as the fallback."}
                </p>
                {imageAltIsCustom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-none px-2 text-xs"
                    onClick={() => {
                      setImageAlt(title);
                      setImageAltIsCustom(false);
                    }}
                  >
                    Use event title
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="event-featured"
              data-testid="checkbox-event-featured"
              checked={featured ?? true}
              onCheckedChange={(checked) => setFeatured(checked === true)}
            />
            <Label htmlFor="event-featured">Featured Event</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              data-testid="button-cancel-event"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="button-submit-event"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Admin() {
  const [authUser, setAuthUser] = useState<AdminAuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data.authenticated) setAuthUser(data.user);
      })
      .catch(() => {})
      .finally(() => setAuthChecking(false));
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!authUser) {
    return <LoginScreen onLogin={setAuthUser} />;
  }

  return <AdminDashboard authUser={authUser} onLogout={() => { fetch("/api/admin/auth", { method: "DELETE" }); setAuthUser(null); }} />;
}

function AdminDashboard({ authUser, onLogout }: { authUser: AdminAuthUser; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [activeTab, setActiveTab] = useState("trials");

  const { data: trialBookings = [], isLoading: loadingTrials } = useQuery<TrialBooking[]>({
    queryKey: ["trial-bookings"],
    queryFn: async () => {
      const response = await fetch("/api/trial-bookings");
      if (!response.ok) throw new Error("Failed to fetch trial bookings");
      return response.json();
    },
  });

  const { data: eventRegistrations = [], isLoading: loadingEventRegs } = useQuery<EventRegistration[]>({
    queryKey: ["event-registrations"],
    queryFn: async () => {
      const response = await fetch("/api/event-registrations");
      if (!response.ok) throw new Error("Failed to fetch event registrations");
      return response.json();
    },
  });

  const { data: adminEvents = [], isLoading: loadingAdminEvents } = useQuery<Event[]>({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/events/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event deleted" });
    },
    onError: () => toast({ title: "Failed to delete event", variant: "destructive" }),
  });

  const editEventFromSeo = (eventId: string) => {
    const event = adminEvents.find((candidate) => candidate.id === eventId);
    if (!event) {
      toast({ title: "That event is no longer available", variant: "destructive" });
      return;
    }
    setEditingEvent(event);
    setActiveTab("manage-events");
    setEventDialogOpen(true);
  };

  return (
    <>
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-xl text-gray-400" data-testid="text-admin-subtitle">Manage bookings, events, blog content, and website SEO</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Signed in as <span className="text-white font-bold">{authUser.username}</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-white rounded-none uppercase text-xs font-bold"
                onClick={() => setUserMgmtOpen(true)}
                data-testid="button-manage-users"
              >
                <Shield className="h-4 w-4 mr-1" /> Users
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-white rounded-none uppercase text-xs font-bold"
                onClick={onLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UserManagementDialog open={userMgmtOpen} onOpenChange={setUserMgmtOpen} />

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card data-testid="card-trial-bookings-count">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trial Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-trial-count">{trialBookings.length}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-event-registrations-count">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-registrations-count">{eventRegistrations.length}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-events-count">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-events-count">{adminEvents.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="trials" data-testid="tab-trigger-trials">Trial Bookings</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-trigger-registrations">Event Registrations</TabsTrigger>
            <TabsTrigger value="manage-events" data-testid="tab-trigger-events">Events</TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-trigger-blog">Blog</TabsTrigger>
            <TabsTrigger value="seo" data-testid="tab-trigger-seo"><Search className="h-4 w-4 mr-1" /> Website SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="trials" className="mt-6">
            {loadingTrials ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-loading-trials">Loading...</div>
            ) : trialBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-no-trials">No trial bookings yet</div>
            ) : (
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="font-bold">Child</TableHead>
                      <TableHead className="font-bold">Age Group</TableHead>
                      <TableHead className="font-bold">Parent</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Phone</TableHead>
                      <TableHead className="font-bold">Area</TableHead>
                      <TableHead className="font-bold">Level</TableHead>
                      <TableHead className="font-bold">Source</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialBookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{booking.playerName}</TableCell>
                        <TableCell>{booking.ageGroup || booking.playerAge || "—"}</TableCell>
                        <TableCell>{booking.parentName}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.phone}{booking.whatsapp ? " ✓WA" : ""}</TableCell>
                        <TableCell>{booking.area || "—"}</TableCell>
                        <TableCell className="capitalize">{booking.programInterest || "—"}</TableCell>
                        <TableCell>{booking.howHeard || "—"}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {loadingEventRegs ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-loading-registrations">Loading...</div>
            ) : eventRegistrations.length === 0 ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-no-registrations">No event registrations yet</div>
            ) : (
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="font-bold">Event</TableHead>
                      <TableHead className="font-bold">Player Name</TableHead>
                      <TableHead className="font-bold">Age</TableHead>
                      <TableHead className="font-bold">Parent</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Phone</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventRegistrations.map((registration) => (
                      <TableRow key={registration.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{registration.eventTitle}</TableCell>
                        <TableCell>{registration.playerName}</TableCell>
                        <TableCell>{registration.playerAge}</TableCell>
                        <TableCell>{registration.parentName}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage-events" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight" data-testid="text-events-heading">Events Management</h2>
              <Button
                data-testid="button-create-event"
                onClick={() => {
                  setEditingEvent(undefined);
                  setEventDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            {loadingAdminEvents ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-loading-events">Loading events...</div>
            ) : adminEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500" data-testid="text-no-events">No events yet. Create your first event.</div>
            ) : (
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="font-bold">Title</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="font-bold">Location</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Category</TableHead>
                      <TableHead className="font-bold">Featured</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-gray-50" data-testid={`row-event-${event.id}`}>
                        <TableCell className="font-medium" data-testid={`text-event-title-${event.id}`}>{event.title}</TableCell>
                        <TableCell data-testid={`text-event-date-${event.id}`}>{event.date}</TableCell>
                        <TableCell data-testid={`text-event-location-${event.id}`}>{event.location}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              event.status === "Registration Open"
                                ? "bg-green-100 text-green-800"
                                : event.status === "Limited Spots"
                                ? "bg-yellow-100 text-yellow-800"
                                : event.status === "Sold Out"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                            data-testid={`text-event-status-${event.id}`}
                          >
                            {event.status}
                          </span>
                        </TableCell>
                        <TableCell data-testid={`text-event-category-${event.id}`}>{event.category}</TableCell>
                        <TableCell data-testid={`text-event-featured-${event.id}`}>{event.featured ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            data-testid={`button-edit-event-${event.id}`}
                            onClick={() => {
                              setEditingEvent(event);
                              setEventDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            data-testid={`button-delete-event-${event.id}`}
                            className="text-red-600"
                            onClick={() => {
                              if (confirm(`Delete event "${event.title}"?`)) {
                                deleteEventMutation.mutate(event.slug);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <EventFormDialog
              event={editingEvent}
              open={eventDialogOpen}
              onOpenChange={setEventDialogOpen}
            />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManager adminName={authUser.username} />
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <SeoManager onEditEvent={editEventFromSeo} />
          </TabsContent>

        </Tabs>
      </div>
    </>
  );
}
