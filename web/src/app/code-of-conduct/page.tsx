import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Code of Conduct",
  description:
    "Our commitment to a welcoming, respectful environment for all Brighton Pauper League players.",
  path: "/code-of-conduct",
});

const LAST_UPDATED = "21 July 2026";
const LAST_UPDATED_BY = "Michael Whelan";

const linkClass =
  "text-primary-blue border-b-2 border-primary-blue hover:opacity-70 transition-opacity";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {children}
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

export default function CodeOfConductPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-6">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
              Code of Conduct
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-light-purple/70">
              Last updated {LAST_UPDATED} by {LAST_UPDATED_BY}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-12 max-w-prose-xl">
            <Section id="about" title="About Brighton Pauper League">
              <p>
                The Brighton Pauper League is an entity that oversees and manages
                competitive weekly Magic: The Gathering play in Brighton. The
                Brighton Pauper League are associated with and largely hosts its
                events in partnership with{" "}
                <ExternalLink href="https://dicesaloonsingles.co.uk/">
                  Dice Saloon Singles
                </ExternalLink>{" "}
                on London Road in Brighton, but are a separate entity with their
                own management and autonomy.
              </p>
              <p>
                The Brighton Pauper League is (soon to be) an official member
                league of{" "}
                <ExternalLink href="https://www.legapauperitalia.it/home">
                  Lega Pauper Italia
                </ExternalLink>
                , and its events and results are (soon to be) officially
                recognised by the LPI.
              </p>
              <p>
                When playing as part of an event hosted/managed by the Brighton
                Pauper League, or representing the Brighton Pauper League
                officially at external events, participants are expected to abide
                by the following code of conduct. Failure to do so can lead to
                penalties and temporary and/or permanent bannings based on the
                severity and frequency of the incident(s).
              </p>
              <p>
                The Code of Conduct as laid out below is in place to preserve the
                friendly, sportsmanlike, and inclusive atmosphere we strive for at
                Brighton Pauper League events. It&rsquo;s recommended you take
                time to look over the CoC to ensure you&rsquo;re behaving in a way
                that best represents our local community, and are fully informed
                on what constitutes as behaviour we will not tolerate from our
                players.
              </p>
              <p>
                If you witness any Brighton Pauper League game night attendants or
                representatives of the Brighton Pauper League at external events
                behaving in a way that breaks this Code of Conduct please do not
                hesitate to inform either a member of the Brighton Pauper League
                management committee or a staff member at Dice Saloon Singles.
              </p>
            </Section>

            <Section id="inclusivity" title="Inclusivity">
              <p>
                The Brighton Pauper League is an inclusive space and organisation
                that welcomes players of all backgrounds. We strive to create an
                environment where all players, no matter who they are, feel
                welcome and included so long as they behave in a way that
                encourages that environment in return.
              </p>
              <p>
                We have an absolute zero tolerance on discrimination and abuse of
                any kind, including but not limited to:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Racism</li>
                <li>Homophobia</li>
                <li>Transphobia</li>
                <li>Ableism</li>
                <li>Sexism</li>
              </ul>
              <p>
                Inclusivity is one of our core tenets as players and as a league
                and we treat any behaviour contrary to this example with the
                utmost severity.
              </p>
            </Section>

            <Section id="sportsmanship" title="Sportsmanship">
              <p>
                The Brighton Pauper League encourages all its players to treat
                their opponents with the respect they deserve, and that they would
                like to receive in return from them. We are polite to our
                opponents and obey the rules as written in Magic: The Gathering.
              </p>
              <p>
                We do not tolerate cheating and/or abuse of Magic&rsquo;s rules
                for personal gain. We strive to play games on an even playing
                field between two honest opponents that treat each other with
                respect and dignity.
              </p>
            </Section>

            <Section
              id="inflammatory-behaviour"
              title="Inflammatory behaviour and abuse"
            >
              <p>
                The Brighton Pauper League does not tolerate abusive and
                inflammatory behaviour to other members of the Magic: The
                Gathering community. We discourage our players from getting into
                arguments with opponents and judges, and encourage our players to
                take the high road in social situations involving the game.
              </p>
              <p>
                If opponents try to engage us in such behaviour we take a step
                back, call a judge, de-escalate the situation as best we can.
                We&rsquo;re passionate about Magic, we strive for a win, but we do
                so with level heads and calm communication.
              </p>
            </Section>

            <Section id="generative-ai" title="Generative AI">
              <p>
                The Brighton Pauper League does not engage in the use of
                Generative AI Art. We vow never to willingly sell, purchase, or
                distribute Generative AI Art. That includes official BPL
                playmats, tokens, advertising, and online media. It will also
                influence our decisions when hosting artists and vendors at any
                official Brighton Pauper League events.
              </p>
            </Section>

            <Section
              id="enforcement"
              title="Enforcement and Disciplinary Action"
            >
              <p>
                Brighton Pauper League members and event guests that do not abide
                by the above rulings and go against the Brighton Pauper League
                Code of Conduct could be subject to penalties and enforcement at
                the discretion of the BPL organisation committee based on the
                severity of the infraction.
              </p>
              <p>These could include but are not limited to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Points deductions and penalties</li>
                <li>Banning from Brighton Pauper League hosted events</li>
                <li>
                  Removal from Brighton Pauper League&rsquo;s official scoring
                  tables and prizing structures
                </li>
                <li>
                  Reports to Dice Saloon, Brighton and the LPI for further
                  disciplinary action
                </li>
              </ul>
            </Section>

            <Section id="questions" title="Questions and Support">
              <p>
                For any questions on the above information or to report any
                infractions that you&rsquo;ve seen please reach out to a member of
                the Brighton Pauper League organisation committee either at a BPL
                event or via our{" "}
                <ExternalLink href="https://chat.whatsapp.com/DBl3FEz0Xl0J7ScF5sQlte">
                  Whatsapp Community Channel
                </ExternalLink>
                .
              </p>
              <p>
                You can also{" "}
                <Link href="/contact" className={linkClass}>
                  get in touch via our contact page
                </Link>
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