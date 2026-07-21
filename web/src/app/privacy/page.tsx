import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Privacy & Data",
  description:
    "How the Brighton Pauper League collects, uses, stores, and protects your personal data under UK GDPR.",
  path: "/privacy",
});

const LAST_UPDATED = "6 July 2026";
const CONTACT_EMAIL = "contact@brightonpauperleague.com";
const CONTACT_SUBJECT = "FAO Data Controller";

function ContactLink({ label }: { label?: string }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`}
      className="border-b-2 border-primary-blue text-primary-blue hover:opacity-70 transition-opacity"
    >
      {label ?? CONTACT_EMAIL}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-28">
      <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl lg:text-4xl text-[#371e22] leading-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-4 font-(family-name:--font-bricolage-grotesque) text-base md:text-lg text-black/70 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-6">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
              Privacy &amp; Data
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl md:text-2xl text-light-purple max-w-200 leading-relaxed">
              How we collect, use, and protect your personal data when you take
              part in the Brighton Pauper League or use this website.
            </p>
            <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-light-purple/70">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-12 max-w-prose-xl">
            <Section id="who-we-are" title="Who we are">
              <p>
                The Brighton Pauper League (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;) is an independent, community-led Magic: The
                Gathering Pauper league based in Brighton, UK. This policy
                explains how we handle personal data in line with the UK General
                Data Protection Regulation (UK GDPR) and the Data Protection Act
                2018.
              </p>
              <p>
                The data controller responsible for your personal data is Roman
                Waters. If you have any questions about this policy or how your
                data is handled, you can contact the data controller by email at{" "}
                <ContactLink /> using the subject line{" "}
                <span className="text-black/90 font-semibold">
                  &ldquo;{CONTACT_SUBJECT}&rdquo;
                </span>
                .
              </p>
            </Section>

            <Section id="what-we-collect" title="What data we collect">
              <p>
                We keep the data we collect to the minimum needed to run the
                league and this website. Depending on how you interact with us,
                this may include:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>
                  <span className="text-black/90 font-semibold">
                    Player name and results.
                  </span>{" "}
                  We record the names and match results of players who take part
                  in league nights and events, so we can maintain standings,
                  rankings, and season histories.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">
                    Player profile content.
                  </span>{" "}
                  Where a player agrees to a public profile, this may include a
                  chosen display name, a photograph, and biographical details
                  they provide.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">
                    Contact details.
                  </span>{" "}
                  If you email us (for example to volunteer or make an enquiry),
                  we receive your email address and anything you choose to
                  include in your message.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">
                    Technical and usage data.
                  </span>{" "}
                  When you visit the site, our hosting provider automatically
                  records limited technical information such as your IP address,
                  browser type, and pages visited, in the form of server logs.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">
                    Analytics data.
                  </span>{" "}
                  If you consent to analytics cookies, we collect anonymised
                  usage statistics through Google Analytics (see{" "}
                  <Link
                    href="#cookies"
                    className="text-primary-blue border-b-2 border-primary-blue hover:opacity-70 transition-opacity"
                  >
                    Cookies and analytics
                  </Link>
                  ).
                </li>
              </ul>
            </Section>

            <Section
              id="how-we-use-it"
              title="How we use your data and our lawful bases"
            >
              <p>
                Under the UK GDPR we must have a lawful basis for processing your
                personal data. The bases we rely on are:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>
                  <span className="text-black/90 font-semibold">Consent.</span>{" "}
                  We publish player profiles, photographs, and publicly
                  attributed results on the basis of your consent. We record
                  names and results in order to run the league regardless, but
                  where you would prefer, these can be anonymised on the public
                  site at your request (see{" "}
                  <Link
                    href="#your-rights"
                    className="text-primary-blue border-b-2 border-primary-blue hover:opacity-70 transition-opacity"
                  >
                    Your rights
                  </Link>
                  ). We rely on consent for analytics cookies.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">
                    Legitimate interests.
                  </span>{" "}
                  We use limited technical data to keep the website secure,
                  available, and working correctly. We use contact details you
                  send us to respond to your enquiry.
                </li>
              </ul>
              <p>
                You can withdraw your consent at any time. Withdrawing consent
                does not affect any processing carried out before you withdrew
                it.
              </p>
            </Section>

            <Section id="cookies" title="Cookies and analytics">
              <p>
                Essential cookies needed for the website to function may be set
                without your consent. We also intend to use Google Analytics to
                understand how the site is used and to improve it. Google
                Analytics relies on cookies and is not strictly necessary, so it
                will only set analytics cookies and collect analytics data about
                your visit if you give your consent through our cookie banner.
                You can decline, or later withdraw, your consent at any time, and
                no analytics cookies will be set.
              </p>
              <p>
                Google Analytics is provided by Google. Data may be processed
                outside the UK; see{" "}
                <Link
                  href="#transfers"
                  className="text-primary-blue border-b-2 border-primary-blue hover:opacity-70 transition-opacity"
                >
                  International transfers
                </Link>
                .
              </p>
            </Section>

            <Section id="sharing" title="Who we share your data with">
              <p>
                We do not sell your personal data. We share it only with the
                service providers (&ldquo;processors&rdquo;) that help us run the
                league and website, and only to the extent needed:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>
                  <span className="text-black/90 font-semibold">Sanity</span> —
                  our content management system, which stores website content
                  including player profiles and results.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">Vercel</span> —
                  our website hosting provider, which processes server logs.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">Google</span> —
                  provides analytics, where you have consented.
                </li>
                <li>
                  <span className="text-black/90 font-semibold">Scryfall</span> —
                  supplies Magic: The Gathering card images. We do not send any
                  personal data to Scryfall.
                </li>
              </ul>
              <p>
                We may also disclose data where required by law or to protect our
                legal rights.
              </p>
            </Section>

            <Section id="transfers" title="International transfers">
              <p>
                Some of our providers, including Google and Vercel, may process
                data on servers outside the UK. Where personal data is
                transferred internationally, we rely on safeguards recognised
                under UK data protection law, such as adequacy decisions or the
                International Data Transfer Agreement, to ensure your data remains
                protected.
              </p>
            </Section>

            <Section id="retention" title="How long we keep your data">
              <p>
                We keep personal data only for as long as needed for the purposes
                described in this policy. Standings, results, and season
                histories may be retained indefinitely as a public record of the
                league, in anonymised form where you have requested it. Enquiry
                emails are kept only as long as needed to deal with your enquiry
                and any related follow-up. Server logs are retained for a limited
                period by our hosting provider.
              </p>
            </Section>

            <Section id="your-rights" title="Your rights">
              <p>Under the UK GDPR you have the right to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>be informed about how your data is used;</li>
                <li>access the personal data we hold about you;</li>
                <li>have inaccurate data corrected;</li>
                <li>have your data erased in certain circumstances;</li>
                <li>restrict or object to processing;</li>
                <li>data portability, where applicable;</li>
                <li>withdraw consent at any time.</li>
              </ul>
              <p>
                In particular, if you would prefer your name not to appear
                publicly, you can ask us to anonymise your results and remove
                your public profile, and we will do so. To exercise any of your
                rights, contact the data controller at <ContactLink />{" "}
                with the subject line &ldquo;{CONTACT_SUBJECT}&rdquo;.
              </p>
            </Section>

            <Section id="security" title="How we protect your data">
              <p>
                We take reasonable technical and organisational measures to keep
                your data secure and to prevent unauthorised access, loss, or
                misuse. Access to personal data is limited to those who need it
                to run the league. No method of transmission or storage is
                completely secure, but we work to protect your data and to
                address any issues promptly.
              </p>
            </Section>

            <Section id="children" title="Children's data">
              <p>
                This website is intended for a general audience. We do not
                knowingly collect personal data from children under 13 without
                appropriate consent. If you believe a child&apos;s data has been
                collected, please contact us and we will remove it.
              </p>
            </Section>

            <Section id="changes" title="Changes to this policy">
              <p>
                We may update this policy from time to time. Any changes will be
                posted on this page with a revised &ldquo;last updated&rdquo;
                date. Please check back periodically.
              </p>
            </Section>

            <Section id="complaints" title="Complaints and contact">
              <p>
                If you have any concerns about how we handle your data, please
                contact the data controller first at <ContactLink />{" "}
                using the subject line &ldquo;{CONTACT_SUBJECT}&rdquo;, and we will do our
                best to resolve them.
              </p>
              <p>
                You also have the right to lodge a complaint with the UK&apos;s
                data protection regulator, the Information Commissioner&apos;s
                Office (ICO), at{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue border-b-2 border-primary-blue hover:opacity-70 transition-opacity"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
