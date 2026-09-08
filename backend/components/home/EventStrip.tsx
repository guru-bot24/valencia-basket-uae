import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { cn, isPastEvent, resolveImageSrc } from "@/lib/utils";
import { storage } from "@/lib/storage";

export async function EventStrip() {
  const allEvents = await storage.getAllEvents();
  const events = allEvents.filter((e) => e.featured && !isPastEvent(e.endDate));

  if (events.length === 0) return null;

  return (
    <div className="w-full bg-neutral-50 border-b border-neutral-200 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary"></div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Upcoming Events</h2>
          </div>
          
          <Link href="/events">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors cursor-pointer group" data-testid="link-view-calendar">
              View Calendar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} data-testid={`link-event-strip-${event.slug}`}>
              <div className="block h-full group cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative z-10">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <span className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-primary")}>
                      {event.category || "Camp"}
                    </span>
                  </div>
                  <Image 
                    src={resolveImageSrc(event.image) || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/mini-basket-team.jpg"}
                    alt={event.imageAlt?.trim() || event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest mb-2">
                    <Calendar className="h-3 w-3" /> {event.date}
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2 leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-xs font-bold uppercase text-gray-400">Learn More</span>
                     <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                     </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
