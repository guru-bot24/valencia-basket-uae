import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/privacy-policy");
}

export default function PrivacyPolicy() {
  return (
    <>
      <BreadcrumbJsonLd path="/privacy-policy" label="Privacy Policy" />
      {/* Header */}
      <div className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">Valencia Basket Academy UAE</p>
        </div>
      </div>

      {/* Document body */}
      <div className="bg-white py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          {/* Effective date — flagged for confirmation */}
          <div className="mb-10 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Effective date:</span>{" "}
              13 August 2026
            </p>
          </div>

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed mb-12">
            Valencia Basket Academy UAE (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting the
            privacy and personal data of everyone who visits our website, books a trial, registers for
            our programs, or otherwise interacts with us. This Privacy Policy explains what personal
            data we collect, why we collect it, how we use and protect it, and the rights available to
            you under the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021)
            (&ldquo;UAE PDPL&rdquo;) and, where applicable to visitors from the European Economic Area,
            the EU General Data Protection Regulation (&ldquo;GDPR&rdquo;).
          </p>

          <div className="space-y-12">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                1. Who We Are
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-semibold">Valencia Basket Academy UAE</span></li>
                <li><span className="font-semibold">Legal name:</span> Hoopsterz Basketball Academy LLC</li>
                <li>
                  <span className="font-semibold">Operating Venue:</span> Hadaeq Mohammed Bin Rashid,
                  AllSports Arena, Latifa Bint Hamdan St, Al Quoz Ind. First, Dubai, United Arab Emirates
                </li>
                <li>
                  <span className="font-semibold">Contact email:</span>{" "}
                  <a href="mailto:info@valenciabasket.ae" className="text-primary hover:underline">
                    info@valenciabasket.ae
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Contact number:</span>{" "}
                  <a href="tel:+971544386838" className="text-primary hover:underline">
                    +971 54 438 6838
                  </a>
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                2. Personal Data We Collect
              </h2>

              <h3 className="font-bold text-gray-900 mb-3">1. Information You Provide to Us</h3>
              <p className="text-gray-700 mb-3">
                When a parent or guardian books a free trial, registers a child, or contacts us, we may collect:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 mb-8">
                <li>Parent/Guardian name, email address, and phone number</li>
                <li>Child&apos;s name, age group, and current playing/skill level</li>
                <li>Area/locality in Dubai (or emirate) you are contacting us from</li>
                <li>How you heard about us, and any notes or preferred training days you share</li>
                <li>
                  At registration/admissions stage: emergency contact details, and any medical
                  conditions, allergies, or special requirements relevant to safe participation
                </li>
                <li>
                  Valencia Basket Academy UAE does not store full card numbers; these are handled directly by the payment
                  processor.
                </li>
                <li>
                  Photos or videos taken at training sessions, camps, or events, where consent has been
                  given (see Section 6)
                </li>
                <li>
                  Any information you send us directly via WhatsApp, email, or social media messages
                </li>
              </ul>

              <h3 className="font-bold text-gray-900 mb-3">2. Information Collected Automatically</h3>
              <p className="text-gray-700 mb-3">
                When you browse our website, we and our service providers may automatically collect:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 mb-8">
                <li>Device and browser information (device type, browser type, operating system)</li>
                <li>IP address and approximate location (city/area level)</li>
                <li>Pages visited, time spent on pages, referring website, and general browsing behaviour</li>
                <li>Data collected via Google Tag Manager and any tags configured within</li>
              </ul>

              <h3 className="font-bold text-gray-900 mb-3">3. Information We Do Not Knowingly Collect</h3>
              <p className="text-gray-700">
                We do not knowingly collect government ID numbers, financial account details (beyond what
                a payment processor requires to process a transaction), or sensitive personal data (such
                as religion or health information) beyond what a parent/guardian voluntarily provides for
                a child&apos;s safety at training (e.g., an allergy or medical condition relevant to participation).
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                3. Legal Basis for Processing
              </h2>
              <p className="text-gray-700 mb-3">
                Under the UAE PDPL, we only process personal data where we have a valid legal basis, including:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>
                  <span className="font-semibold">Consent</span> — e.g., when you submit the
                  trial-booking form, opt in to marketing communications, or consent to photos/videos
                  being used
                </li>
                <li>
                  <span className="font-semibold">Performance of a contract</span> — e.g., registering
                  your child for a program, processing payment, and delivering the service
                </li>
                <li>
                  <span className="font-semibold">Legal obligation</span> — e.g., accounting, tax, and
                  regulatory record-keeping
                </li>
                <li>
                  <span className="font-semibold">Legitimate interests</span> — e.g., improving our
                  website and services, preventing fraud, and general safeguarding at our facility
                </li>
                <li>
                  <span className="font-semibold">Vital interests</span> — e.g., contacting an emergency
                  contact or seeking medical attention in the event of an injury at training
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                4. How We Use Your Personal Data
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>To respond to trial-booking requests and enquiries</li>
                <li>
                  To assess and place a child in the appropriate program (Future Ballers, Mini Basket,
                  Youth Academy, Elite/Select, or Private Training)
                </li>
                <li>To register participants, process payments, and manage term schedules</li>
                <li>
                  To communicate updates, schedule changes, and academy policies to parents/guardians
                </li>
                <li>
                  To ensure the safety of participants, including using emergency contact and medical
                  information if needed
                </li>
                <li>
                  To send marketing communications about programs, camps, and events — only with
                  consent, and with an option to opt out at any time
                </li>
                <li>
                  To post photos, videos, or testimonials for marketing purposes — only with prior consent
                </li>
                <li>
                  To improve our website and services, using aggregated, de-identified analytics data
                </li>
                <li>To comply with legal, tax, and regulatory obligations in the UAE</li>
              </ul>
              <p className="mt-4 text-gray-700 font-medium">
                We do not sell personal data to third parties.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                5. Children&apos;s Privacy and Data from Minors
              </h2>
              <p className="text-gray-700 mb-4">
                Valencia Basket Academy UAE&apos;s programs are designed for children aged 4–18. Because our
                participants are minors, we collect information about children only from, or with the
                verified consent of, a parent or legal guardian — children do not submit information to
                us directly through the website.
              </p>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700 mb-4">
                <li>
                  The parent/guardian who submits the trial-booking or registration form is treated as
                  having provided consent on behalf of the child for the data described in Section 3.
                </li>
                <li>
                  Parents/guardians may review, correct, or request deletion of their child&apos;s
                  personal data at any time by contacting us using the details in Section 13.
                </li>
                <li>
                  Photos and videos of children are only used in our marketing (website, Instagram,
                  TikTok, Facebook) where a parent/guardian has given specific consent.
                </li>
                <li>
                  If a parent/guardian believes their child&apos;s data has been collected or used
                  incorrectly, they should contact us immediately and we will investigate and
                  remove/correct the data as appropriate.
                </li>
              </ul>
              <p className="text-gray-700">
                This section is also informed by Federal Decree-Law No. 26 of 2025 Regarding Child
                Digital Safety, a new UAE federal law that took effect on 1 January 2026 with a
                one-year compliance window. It requires verifiable parental consent before collecting
                personal data from children under 13, an easy way for parents to withdraw that consent,
                and prohibits using children&apos;s data for commercial purposes or targeted advertising.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                Our website uses cookies and similar technologies (such as those deployed via Google Tag
                Manager) to operate the site, understand how visitors use it, and — where applicable —
                to measure the performance of our marketing campaigns.
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 mb-4">
                <li>
                  <span className="font-semibold">Strictly necessary cookies</span> — required for the
                  website to function.
                </li>
                <li>
                  <span className="font-semibold">Analytics cookies</span> — to understand site usage
                  and visitor behaviour.
                </li>
                <li>
                  <span className="font-semibold">Advertising/marketing cookies</span> — to measure and
                  improve ad campaigns (e.g. Meta Pixel / TikTok Pixel / Google).
                </li>
              </ul>
              <p className="text-gray-700">
                You can control or disable cookies through your browser settings. Disabling certain
                cookies may affect the functionality of the website.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                7. How We Share Your Personal Data
              </h2>
              <p className="text-gray-700 mb-3">We may share personal data with:</p>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700 mb-4">
                <li>
                  Coaching and administrative staff who need the information to deliver our programs safely
                </li>
                <li>
                  Google Sheets and Meta forms, which store enquiry and registration data on our behalf
                </li>
                <li>A payment processor to process registration and program fees</li>
                <li>
                  Analytics and advertising platforms listed in Section 6, strictly for the purposes
                  described there
                </li>
                <li>
                  Participant data is not generally shared with the parent club in Spain (Valencia Basket
                  Club). However, information about promising players may be shared with the Technical
                  Director and other relevant personnel in Spain for player-development and pathway
                  purposes, with the aim of potentially giving those players an opportunity to train or
                  play with the club in Spain.
                </li>
                <li>Legal or regulatory authorities, where required by UAE law</li>
                <li>A successor entity, in the event of a business transfer, merger, or restructuring</li>
              </ul>
              <p className="text-gray-700 font-medium">
                We require third parties who process personal data on our behalf to protect it in line
                with this Policy and applicable law. We do not sell personal data to third parties.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                8. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Where personal data is transferred outside the UAE — for example to a cloud hosting
                provider, payment processor, or the marketing/analytics platforms above, or to Valencia
                Basket, Spain — we take reasonable steps to ensure it receives an adequate level of
                protection, such as standard contractual clauses, an applicable adequacy decision, or
                another legally recognised safeguard.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                9. Data Retention
              </h2>
              <p className="text-gray-700 mb-3">
                We retain personal data only for as long as necessary to fulfil the purposes described
                in this Policy, or as required by UAE law (e.g. financial/accounting records). Specifically:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>
                  Trial/enquiry data for participants who do not enrol: retained for retargeting purposes.
                </li>
                <li>
                  Registered participant and payment records: retained for 5 years.
                </li>
              </ul>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                10. Data Security
              </h2>
              <p className="text-gray-700">
                We implement reasonable technical and organisational measures designed to protect
                personal data against unauthorised access, loss, misuse, or alteration. However, no
                method of transmission over the internet or electronic storage is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                11. Your Data Protection Rights
              </h2>
              <p className="text-gray-700 mb-3">
                Under the UAE PDPL (and the GDPR, where applicable to you), you have the right to:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 mb-4">
                <li>Access the personal data we hold about you or your child</li>
                <li>Correct inaccurate or incomplete personal data</li>
                <li>
                  Request deletion of personal data (&ldquo;right to be forgotten&rdquo;), subject to
                  legal retention obligations
                </li>
                <li>Restrict or object to certain processing</li>
                <li>
                  Withdraw consent at any time, without affecting processing carried out before withdrawal
                </li>
                <li>Request data portability, where technically feasible</li>
                <li>Lodge a complaint with the UAE Data Office or relevant supervisory authority</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:info@valenciabasket.ae" className="text-primary hover:underline">
                  info@valenciabasket.ae
                </a>
                .
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                12. Automated Decision-Making
              </h2>
              <p className="text-gray-700">
                We do not use automated decision-making or profiling that produces legal or similarly
                significant effects on you or your child.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                13. Data Breach Notification
              </h2>
              <p className="text-gray-700">
                In the event of a personal data breach that poses a risk to your rights and freedoms, we
                will notify affected individuals and, where required, the relevant UAE data protection
                authority, within the timeframe required by applicable law.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                14. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                This Policy and any dispute arising from it are governed by the laws of the United Arab
                Emirates. If you are located outside the UAE, your continued use of this website and our
                services confirm your agreement to this Policy and to UAE law governing it.
              </p>
              <p className="text-gray-700 mb-2">
                This Policy is written with reference to the following laws:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>
                  Federal Decree-Law No. 45 of 2021 Regarding the Protection of Personal Data (UAE
                  PDPL), issued 20 September 2021, in effect since 2 January 2022.
                </li>
                <li>
                  Federal Decree-Law No. 26 of 2025 Regarding Child Digital Safety, issued 1 October
                  2025, in effect since 1 January 2026 (one-year compliance window).
                </li>
                <li>
                  Regulation (EU) 2016/679 (General Data Protection Regulation), applicable since 25 May
                  2018, referenced only for visitors from the EU/EEA.
                </li>
              </ul>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                15. Other Websites and Services
              </h2>
              <p className="text-gray-700">
                Our website and WhatsApp communications may contain links to third-party websites or
                services (e.g. Google Maps, social media platforms, our payment processor). We are not
                responsible for the privacy practices of those third parties, and we encourage you to
                review their privacy policies before providing personal data to them.
              </p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                16. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices
                or legal requirements. The &ldquo;Effective date&rdquo; at the top of this page will be
                updated accordingly, and significant changes will be communicated directly to affected
                individuals where appropriate.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                17. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your data protection
                rights, please contact us:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-semibold">Email:</span>{" "}
                  <a href="mailto:info@valenciabasket.ae" className="text-primary hover:underline">
                    info@valenciabasket.ae
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Phone / WhatsApp:</span>{" "}
                  <a href="tel:+971544386838" className="text-primary hover:underline">
                    +971 54 438 6838
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Operating Venue:</span> Hadaeq Mohammed Bin Rashid,
                  AllSports Arena, Latifa Bint Hamdan St, Al Quoz Ind. First, Dubai, United Arab Emirates
                </li>
              </ul>
            </section>

          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link href="/" className="text-sm text-primary hover:underline font-medium uppercase tracking-wider">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
