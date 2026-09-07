"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdmissionsClient() {
  const faqs = [
    {
      q: "What is the assessment process?",
      a: "Every new player undergoes a free skill assessment session. Our coaches evaluate their technical ability, physical literacy, and game understanding to place them in the most appropriate group for their development."
    },
    {
      q: "Do you offer competitive games?",
      a: "Yes. Players in our Youth Academy and Elite programs participate in local leagues, friendly matches, and internal tournaments. Competition is a key pillar of our methodology."
    },
    {
      q: "What is the coach-to-player ratio?",
      a: "We maintain strict ratios to ensure quality. Typically 1:12 for Youth Academy and 1:8 for Future Ballers, Mini Basket, and Elite groups."
    },
    {
      q: "Is the uniform included?",
      a: "A starter kit (jersey, shorts, socks) is included with the registration fee. Additional gear can be purchased separately."
    },
    {
        q: "Do you offer sibling discounts?",
        a: "Yes, we offer a 10% discount for the second child and 15% for the third child registered from the same family."
    }
  ];

  return (
    <>
       <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Admissions</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the Valencia Basket family. Simple steps to start your journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-black uppercase mb-8">How to Join</h2>
                
                <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-12">
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <h3 className="text-xl font-bold uppercase mb-2">1. Book a Free Trial</h3>
                        <p className="text-gray-600">Register online for an assessment session. Choose a convenient time and location.</p>
                        <Link href="/#book-trial"><Button className="uppercase font-bold tracking-wider rounded-none h-12 px-8 mt-2">Book Now</Button></Link>
                    </div>
                     <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <h3 className="text-xl font-bold uppercase mb-2">2. Attend Assessment</h3>
                        <p className="text-gray-600">Come to the court! Meet the coaches and enjoy a training session. We&apos;ll evaluate your level.</p>
                    </div>
                     <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <h3 className="text-xl font-bold uppercase mb-2">3. Placement &amp; Registration</h3>
                        <p className="text-gray-600">Receive your group placement and schedule options. Complete the registration forms and payment.</p>
                    </div>
                     <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                        <h3 className="text-xl font-bold uppercase mb-2">4. Start Training</h3>
                        <p className="text-gray-600">Receive your kit and start your development journey with Valencia Basket UAE.</p>
                    </div>
                </div>

                <div className="mt-20">
                    <h2 className="text-3xl font-black uppercase mb-8">Parent FAQs</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger className="font-bold text-left">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            <div className="bg-gray-50 p-8 h-fit border-t-4 border-primary">
                <h3 className="text-xl font-black uppercase mb-6">Academy Term Dates</h3>
                
                <div className="space-y-6 mb-8">
                    <div>
                        <span className="block text-xs font-bold uppercase text-gray-400">Term 1 (Autumn)</span>
                        <p className="font-bold">Sep 1st - Dec 15th</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold uppercase text-gray-400">Term 2 (Winter)</span>
                        <p className="font-bold">Jan 5th - Mar 28th</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold uppercase text-gray-400">Term 3 (Spring)</span>
                        <p className="font-bold">Apr 14th - Jun 30th</p>
                    </div>
                </div>

                <Link href="/#book-trial">
                    <Button className="w-full uppercase font-bold tracking-wider rounded-none h-12">
                        Register Now
                    </Button>
                </Link>
                <p className="text-xs text-center text-gray-400 mt-4">
                    Spaces are limited per age group.
                </p>
            </div>
        </div>
      </div>
    </>
  );
}
