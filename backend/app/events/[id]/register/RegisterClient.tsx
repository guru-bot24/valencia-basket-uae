"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Event } from "@shared/schema";
import { isPastEvent } from "@/lib/utils";

export default function RegisterClient() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    playerName: "",
    playerAge: "",
  });

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          playerName: formData.playerName,
          playerAge: parseInt(formData.playerAge),
        }),
      });

      if (!res.ok) throw new Error("Registration failed");

      setSubmitted(true);
      toast({
        title: "Registration Successful",
        description: `You've been registered for ${event.title}!`,
      });
    } catch {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <Link href="/events">
          <Button variant="outline">Back to Events</Button>
        </Link>
      </div>
    );
  }

  if (isPastEvent(event.endDate)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-black uppercase" data-testid="text-registration-closed">Registration Closed</h1>
        <p className="text-gray-500 max-w-md">
          <span className="font-bold text-black">{event.title}</span> has already ended, so registration is no longer available.
        </p>
        <Link href="/events" data-testid="link-back-to-events">
          <Button className="bg-[#FF6C0E] hover:bg-[#ff8534] text-white uppercase font-bold tracking-wider rounded-none mt-2">
            View Upcoming Events
          </Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <div className="bg-[#FF6C0E] text-white py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Registration Complete</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-2xl text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4">You&apos;re Registered!</h2>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for registering for <span className="font-bold text-black">{event.title}</span>.
          </p>
          <p className="text-gray-500 mb-8">
            We&apos;ve sent a confirmation to your email. Our team will be in touch with further details about the event.
          </p>
          <div className="bg-gray-50 p-6 text-left mb-8">
            <h3 className="font-bold uppercase text-sm tracking-wider mb-4 text-gray-400">Event Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#FF6C0E]" />
                <span className="font-medium">{event.date}, {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FF6C0E]" />
                <span className="font-medium">{event.location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/events" data-testid="link-back-to-events">
              <Button variant="outline" className="uppercase font-bold tracking-wider rounded-none">
                View All Events
              </Button>
            </Link>
            <Link href="/" data-testid="link-back-home">
              <Button className="bg-[#FF6C0E] hover:bg-[#ff8534] text-white uppercase font-bold tracking-wider rounded-none">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-[#FF6C0E] text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
            {event.status}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4" data-testid="text-registration-title">
            Register for {event.title}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/90 font-bold uppercase tracking-widest text-sm">
            <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> {event.date}</div>
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {event.location}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl">
        <Link href={`/events/${slug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 uppercase tracking-wider font-bold" data-testid="link-back-to-event">
          <ArrowLeft className="h-4 w-4" /> Back to Event Details
        </Link>

        <div className="bg-white border border-gray-200 p-8 md:p-10">
          <h2 className="text-2xl font-black uppercase mb-2">Registration Form</h2>
          <p className="text-gray-500 text-sm mb-8">
            Complete the form below to register for <span className="font-bold text-black">{event.title}</span>.
            {event.price && <span> Cost: <span className="text-[#FF6C0E] font-bold">{event.price}</span></span>}
          </p>

          <div className="bg-gray-50 p-4 mb-8 border-l-4 border-[#FF6C0E]">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Registering For</p>
            <p className="font-bold text-lg" data-testid="text-registration-event-name">{event.title}</p>
            <p className="text-sm text-gray-500">{event.date}, {event.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Parent / Guardian</h3>
              <div>
                <Label htmlFor="parentName" className="text-sm font-bold uppercase tracking-wider">Full Name *</Label>
                <Input
                  id="parentName"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Parent or guardian full name"
                  className="mt-1 rounded-none"
                  data-testid="input-parent-name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="mt-1 rounded-none"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 XX XXX XXXX"
                    className="mt-1 rounded-none"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Player Details</h3>
              <div>
                <Label htmlFor="playerName" className="text-sm font-bold uppercase tracking-wider">Player Name *</Label>
                <Input
                  id="playerName"
                  required
                  value={formData.playerName}
                  onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                  placeholder="Player full name"
                  className="mt-1 rounded-none"
                  data-testid="input-player-name"
                />
              </div>
              <div>
                <Label htmlFor="playerAge" className="text-sm font-bold uppercase tracking-wider">Player Age *</Label>
                <Input
                  id="playerAge"
                  type="number"
                  inputMode="numeric"
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                  min="4"
                  max="18"
                  value={formData.playerAge}
                  onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                  placeholder="Age (4-18)"
                  className="mt-1 rounded-none"
                  data-testid="input-player-age"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#FF6C0E] hover:bg-[#ff8534] text-white uppercase font-bold tracking-wider rounded-none h-14 text-lg"
              data-testid="button-submit-registration"
            >
              {submitting ? "Submitting..." : "Complete Registration"}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              By registering, you agree to our terms and conditions. A member of our team will contact you to confirm your spot.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
