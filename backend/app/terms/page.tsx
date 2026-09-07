import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/terms");
}

export default function TermsAndConditions() {
  return (
    <>
      <BreadcrumbJsonLd path="/terms" label="Terms and Conditions" />
      {/* Header */}
      <div className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">
            Legal
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-400 text-lg">Valencia Basket Academy UAE</p>
        </div>
      </div>

      {/* Document body */}
      <div className="bg-white py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          {/* Effective date */}
          <div className="mb-10 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Effective date:</span>{" "}
              13 August 2026
            </p>
          </div>

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed mb-12">
            Welcome to Valencia Basket Academy UAE. Before enrolling a student/player, the parent or legal
            guardian (&ldquo;you&rdquo;) must read these Terms and Conditions carefully. By submitting
            a trial-booking form, completing registration, or making a payment to{" "}
            <span className="font-semibold">Valencia Basket Academy UAE</span>, you confirm on behalf of yourself and the student/player that you accept these Terms and
            Conditions in full.
          </p>

          <div className="space-y-12">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                1. Registration and Enrollment
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Registration is open to children in the following age groups and programs: Future
                  Ballers (4–6 years), Mini Basket (7–10 years), Youth Academy (11–18 years) and
                  Private Training.
                </li>
                <li>
                  The following documents are required at registration: a copy of the participant&apos;s
                  passport or Emirates ID so that the necessary documents are available if the player
                  participates in tournaments or represents the country. A medical form may also be
                  requested when required by tournament organisers.
                </li>
                <li>
                  Registration is valid for one term at a time, in line with the following term dates:
                  Term 1 (September to December), Term 2 (January to March), and Term 3 (April to June).
                </li>
                <li>
                  Applications submitted online, by phone, or by WhatsApp are not confirmed until the
                  applicable fee has been received.
                </li>
                <li>
                  Places in each program are limited and are allocated on a first-come, first-served basis.
                </li>
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> may request
                  additional information or documents from the player or parent/guardian at any time
                  during the program to meet its obligations.
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                2. Fees and Payment
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  The relevant fee must accompany all applications and be paid in full before the start
                  of the term to secure a place in the program.
                </li>
                <li>
                  Note that there are no hidden or additional fees. All program fees are communicated
                  clearly.
                </li>
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> reserves the right
                  to make changes to fees, with reasonable notice given to parents/guardians before the
                  change takes effect.
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                3. Refunds, Credit Notes and Cancellations
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Refunds may be provided depending on the participant&apos;s circumstances and the
                  reason given. Where approved, the refund is issued as a cash refund rather than a
                  credit note.
                </li>
                <li>
                  Once payment has been received in full, registrations cannot be cancelled for a refund,
                  except where a documented medical emergency prevents the Student from participating.
                </li>
                <li>
                  Sessions cancelled due to national or religious holidays, adverse weather, or other
                  circumstances outside{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s control will
                  not be refunded; a credit note or make-up session may be offered at{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s discretion.
                </li>
                <li>
                  Where a credit note is issued, it may be transferred to the next term or academic year,
                  but is not redeemable for cash.
                </li>
                <li>
                  If a parent/guardian registers for a program that later clashes with another school or
                  provider&apos;s activities, no refund will be given.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                4. Make-Up Sessions
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>Missed sessions for personal reasons will not be compensated or added to the program.</li>
                <li>
                  Where a player misses a session due to illness, injury, or documented special
                  circumstances, a make-up session may be offered, subject to a valid medical certificate
                  where applicable.
                </li>
                <li>
                  Make-up sessions must be completed within the same term or academic year and cannot be
                  used if there is an outstanding balance on the account.
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                5. Schedule Changes, Cancellations and Force Majeure
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Training timings may shift based on facility availability, coach arrangements, or the
                  number of participants in a group.
                </li>
                <li>
                  During Ramadan, training schedules may be adjusted to accommodate Iftar timings.
                </li>
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> may cancel or change
                  any course, session, or venue where necessary, including but not limited to Force
                  Majeure events (adverse weather, venue unavailability, epidemic or pandemic measures,
                  strikes, civil disturbance, or other circumstances beyond{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s reasonable control). Where
                  possible, an alternative session will be offered and communicated to parents/guardians
                  in advance.
                </li>
                <li>
                  As a user of a third-party facility, sessions may be moved between indoor and outdoor
                  areas at AllSports Arena depending on facility management decisions.
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                6. Uniform Policy
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Players must bring their official academy kit, suitable basketball shoes, and a water
                  bottle.
                </li>
              </ul>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                7. Health, Fitness and Assumption of Risk
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  By registering, the parent/guardian confirms that the student is physically fit and
                  able to take part in basketball training and related activities, and accepts all risks
                  associated with participation.
                </li>
                <li>
                  The parent/guardian confirms that the Student has no physical or mental condition that
                  would prevent safe participation in academy activities, and agrees to immediately
                  disclose any change in circumstances that may affect the Student&apos;s ability to
                  train safely.
                </li>
                <li>
                  Basketball and related physical activity carry inherent risks, including the risk of
                  injury. The parent/guardian and Student voluntarily accept these risks, including the
                  risk of illness, personal injury, or property loss, with full knowledge and
                  understanding of the activity.
                </li>
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> does not currently
                  provide participant accident or injury insurance. Participation is therefore subject to
                  the family&apos;s own responsibility and insurance arrangements.
                </li>
              </ul>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                8. Photography and Media Release
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> may photograph or
                  video Students during training, matches, and events, and may use this content for
                  promotional purposes on our website and social media, where consent has been given as
                  described in our{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </li>
                <li>
                  A parent/guardian who does not wish their child to be included in such photos or videos
                  may submit a written objection to{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span> using the contact details in the{" "}
                  <a href="#contact" className="text-primary hover:underline">
                    Contact Us section below
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                9. Code of Conduct
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Students are expected to show sportsmanship, discipline, and respect toward coaches,
                  teammates, and opponents at all times.
                </li>
                <li>
                  Disruptive, unlawful, or unethical behaviour by a Student or parent/guardian may result
                  in removal from the program without a refund, at{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s discretion, following a warning
                  where appropriate.
                </li>
                <li>
                  Parents/guardians agree not to argue or engage in confrontation with coaches or academy
                  staff. Such conduct will be treated as a breach of this Code of Conduct and may result
                  in cancellation of the registration without notice or refund.
                </li>
                <li>
                  The cost of any damage caused by a Student or parent/guardian to{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span> or venue property will be charged to
                  the responsible party.
                </li>
              </ul>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                10. Parent/Guardian Responsibilities
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  Parents/guardians are responsible for ensuring the Student arrives on time and is
                  collected promptly at the end of each session.
                </li>
                <li>
                  Parents/guardians must inform{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span> of any health concerns or special
                  requirements relevant to the Student&apos;s safe participation.
                </li>
                <li>
                  Parents/guardians are kindly asked to remain outside the training area during sessions,
                  so coaches and players can stay focused. Any communication with coaches should take
                  place before or after the session.
                </li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                11. Competitive Programs and Selection
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> offers a
                  competitive/selection program called &ldquo;Elite / Select&rdquo; which is separate
                  from the three standard programs. Selection is by invitation, and is at the sole
                  discretion of the coaching staff. Selection is not guaranteed and does not form part of
                  standard program enrollment.
                </li>
                <li>
                  Participation in external competitions or leagues, where offered, is separate from
                  standard program membership and may be subject to additional terms and fees.
                </li>
              </ul>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                12. Intellectual Property
              </h2>
              <p className="text-gray-700">
                All intellectual property relating to{" "}
                <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s programs, training
                methodology, branding, and materials belongs to{" "}
                <span className="font-semibold">Valencia Basket Academy UAE</span> (and, where applicable, its licensing
                partner, Valencia Basket, Spain). Registration does not grant the Student or
                parent/guardian any ownership or licence over this intellectual property.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                13. Limitation of Liability and Indemnification
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-3 text-gray-700">
                <li>
                  To the fullest extent permitted by UAE law,{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span> is not liable for
                  personal injury, loss of property, or damages occurring during training sessions,
                  matches, or events, except where caused by{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span>&apos;s proven negligence.
                </li>
                <li>
                  <span className="font-semibold">Valencia Basket Academy UAE</span> is not responsible for items lost or
                  left behind at training venues.
                </li>
                <li>
                  The parent/guardian agrees to indemnify{" "}
                  <span className="font-semibold">Valencia Basket Academy UAE</span> and its staff, coaches, and affiliates
                  against any claim, loss, or expense arising from a breach of these Terms and Conditions
                  by the Student or parent/guardian.
                </li>
              </ul>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                14. Data Protection
              </h2>
              <p className="text-gray-700">
                Personal data collected during registration and participation, including the
                Student&apos;s health information where relevant, is collected, used, and protected as
                described in our{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
                , which forms part of these Terms and Conditions by reference.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                15. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-700">
                These Terms and Conditions are governed by the laws applicable in the Emirate of Dubai
                and the United Arab Emirates. Any dispute arising from these Terms shall first be
                addressed amicably between the parties. If it cannot be resolved amicably, the dispute
                shall be referred to the Dubai courts (excluding the DIFC courts) for final resolution.
              </p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                16. Changes to These Terms
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Valencia Basket Academy UAE</span> may update these Terms
                and Conditions from time to time. The &ldquo;Effective date&rdquo; at the top of this
                page will be updated accordingly, and continued enrollment or participation after such
                changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* 17 */}
            <section id="contact">
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 pb-2 border-b border-gray-200">
                17. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms and Conditions, please contact us:
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
