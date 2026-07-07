import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventList } from "@/components/EventList";
import { StandingsTable } from "@/components/StandingsTable";
import { PastSeasonsList } from "@/components/PastSeasonsList";
import { CardCarousel } from "@/components/CardCarousel";
import {
  getActiveSeason,
  getStandings,
  getUpcomingEvents,
  getPastSeasons,
} from "@/lib/data";

export default async function Home() {
  const activeSeason = await getActiveSeason();
  const [upcomingEvents, pastSeasons, standings] = await Promise.all([
    getUpcomingEvents(3),
    getPastSeasons(),
    activeSeason ? getStandings(activeSeason._id) : Promise.resolve([]),
  ]);

  return (
    <>
      <Navbar/>

      {/* Hero Section */}
      <div className="relative bg-primary-blue min-h-[calc(100vh-72px)] w-full flex items-center py-16 lg:py-20">
        <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Hero Content */}
          <div className="flex flex-col gap-6 lg:gap-8 items-center lg:items-start text-center lg:text-left max-w-200 min-w-0">
            <h1 className="font-(family-name:--font-young-serif) text-[clamp(2.5rem,10vw,7.5rem)] text-secondary-yellow leading-none">
              Brighton Pauper League
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) font-medium text-xl md:text-2xl lg:text-[32px] xl:text-[36px] 2xl:text-[40px] text-light-purple leading-tight">
              Home of Pauper in Sussexx
            </p>
            <p className="font-(family-name:--font-bricolage-grotesque) text-base lg:text-lg text-white/80 max-w-150">
              Open to all, run by players, for players. Competitive Magic with common cards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 lg:mt-4">
              <Link
                  href="/events"
                  className="px-8 py-4 bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-[#d09602] transition-colors text-center"
              >
                Join the League
              </Link>
              <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-white text-white font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                Find out more
              </Link>
            </div>
          </div>

          {/* League Logo */}
          <div className="flex items-center justify-center w-full max-w-45 sm:max-w-60 lg:max-w-72 xl:max-w-100 2xl:max-w-140 shrink-0">
            <Image
                src="/logo.webp"
                alt="Brighton Pauper League"
                width={475}
                height={475}
                className="object-contain w-full h-auto"
                priority
            />
          </div>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="bg-light-purple px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left Column - Who is this for? */}
          <div className="w-full lg:w-155 flex flex-col gap-12">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-primary-blue leading-tight">
              Who is this for?
            </h2>

            {/* Cards */}
            <div className="flex flex-col gap-6">
              {/* New Players */}
              <div
                  className="bg-white p-8 rounded-2xl flex gap-6 items-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#004aad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" stroke-linecap="round" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke-linecap="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-2">
                    New Players
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                    A friendly place to learn the ropes and meet new people. We have a deck library available if you&#39;re just starting
                    out.
                  </p>
                </div>
              </div>

              {/* Returning Players */}
              <div
                  className="bg-white p-8 rounded-2xl flex gap-6 items-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#004aad" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-2">
                    Returning Players
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                    Rejoin the common scene at a relaxed pace. Find your new community of players waiting for you.
                  </p>
                </div>
              </div>

              {/* Seasoned Grinders */}
              <div
                  className="bg-white p-8 rounded-2xl flex gap-6 items-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#004aad" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                    <line x1="13" y1="19" x2="19" y2="13"/>
                    <line x1="16" y1="16" x2="20" y2="20"/>
                    <line x1="19" y1="21" x2="21" y2="19"/>
                    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
                    <line x1="5" y1="14" x2="9" y2="18"/>
                    <line x1="7" y1="17" x2="4" y2="20"/>
                    <line x1="3" y1="19" x2="5" y2="21"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-2">
                    Seasoned Grinders
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                    Competitive play with other experienced play is available here. Prizes up for grabs!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - What is Pauper? */}
          <div className="w-full lg:w-155 flex flex-col gap-8 justify-start">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-primary-blue leading-tight mb-4">
              What is Pauper?
            </h2>

            <div className="flex flex-col gap-8">
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black leading-relaxed">
                Pauper is an eternal Magic: The Gathering format where you play with only common cards. This includes old, new and downshifted cards, as well as powerful cards banned in other formats
              </p>
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black leading-relaxed">
                It's a format loved globally for being wallet friendly, accessible, with a high skill ceiling.
                It&#39;s widely beloved for being budget-friendly while remaining incredibly skill-intensive. It allows
                players to play powerful, iconic cards without the massive price tags of other competitive formats.
              </p>

              {/* Callout Card */}
              <div className="bg-primary-blue p-8 rounded-2xl mt-auto">
                <p className="font-(family-name:--font-bricolage-grotesque) font-semibold text-lg text-white text-center">
                  High skill. Low budget. All common.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <CardCarousel />
        </div>
      </section>

      {/* When/Where Section */}
      <section className="bg-primary-blue px-6 md:px-12 lg:px-20 lg:min-h-screen flex items-center">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10 py-20 w-full">
          {/* Left - Location */}
          <div className="flex-1 flex items-center">
            <div className="bg-white p-12 rounded-3xl flex flex-col gap-6 w-full">
              <h3 className="font-(family-name:--font-young-serif) text-5xl text-primary-blue">
                Dice Saloon Singles
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black">
                88 London Rd, Brighton and Hove, Brighton BN1 4JF
              </p>

              {/* Dice Saloon Image */}
              <div className="relative h-60 rounded-xl overflow-hidden">
                <Image
                    src="/dicesaloon.webp"
                    alt="Dice Saloon storefront"
                    fill
                    className="object-cover"
                />
              </div>

              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60">
                We are an independent league - not officially affiliated with Dice Saloon, just grateful to call it
                home.
              </p>
            </div>
          </div>

          {/* Right - Schedule */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-secondary-yellow leading-tight">
              Join us on the night
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-light-purple">
              We get together regularly to play and trade.
            </p>

            {/* Schedule Cards */}
            <div className="flex flex-col gap-6">
              <div
                  className="bg-darker-blue border-2 border-secondary-yellow p-10 rounded-2xl hover:bg-primary-blue hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer">
                <div className="flex flex-col gap-2">
                  <span
                      className="bg-secondary-yellow px-3 py-1 rounded text-dark-brown font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase w-fit">
                    League Nights
                  </span>
                  <h3 className="font-(family-name:--font-young-serif) text-2xl md:text-[32px] text-white">
                    Tuesdays
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) font-bold text-lg text-secondary-yellow">
                    Every other Tuesday
                  </p>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-light-purple">
                    6:45pm onwards
                  </p>
                </div>
              </div>

              <div
                  className="bg-darker-blue border-2 border-secondary-yellow p-10 rounded-2xl hover:bg-primary-blue hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer">
                <div className="flex flex-col gap-2">
                  <span
                      className="bg-sage-green px-3 py-1 rounded text-dark-brown font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase w-fit">
                    Casual Pauper
                  </span>
                  <h3 className="font-(family-name:--font-young-serif) text-2xl md:text-[32px] text-white">
                    Tuesdays
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) font-bold text-lg text-secondary-yellow">
                    On the Tuesdays in between
                  </p>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-light-purple">
                    6:45pm onwards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-dark-brown leading-tight">
              How the League Works
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70">
              Transparent, fair, and accessible competitive play.
            </p>
          </div>

          {/* Grid of 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col gap-6 items-start">
              <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="29" viewBox="0 0 26 29" fill="none">
                  <path
                      d="M7.66667 1.00006V6.33382M18.3333 1.00006V6.33382M1 11.6676H25M9 19.6682L11.6667 22.3351L17 17.0013M3.66667 3.66694H22.3333C23.8061 3.66694 25 4.86094 25 6.33382V25.002C25 26.4749 23.8061 27.6689 22.3333 27.6689H3.66667C2.19391 27.6689 1 26.4749 1 25.002V6.33382C1 4.86094 2.19391 3.66694 3.66667 3.66694Z"
                      stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
                </svg>

              </div>
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown">
                League Nights
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 w-full">
                Swiss rounds with tiebreakers. Every match counts towards your seasonal standing.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-start">
              <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                      d="M13.3333 2.6656V5.33227M18.6667 2.6656V5.33227M21.3333 10.6656C21.687 10.6656 22.0261 10.8061 22.2761 11.0561C22.5262 11.3062 22.6667 11.6453 22.6667 11.9989V22.6656C22.6667 24.0801 22.1048 25.4366 21.1046 26.4368C20.1044 27.437 18.7478 27.9989 17.3333 27.9989H9.33333C7.91885 27.9989 6.56229 27.437 5.5621 26.4368C4.5619 25.4366 4 24.0801 4 22.6656V11.9989C4 11.6453 4.14048 11.3062 4.39052 11.0561C4.64057 10.8061 4.97971 10.6656 5.33333 10.6656H24C25.4145 10.6656 26.771 11.2275 27.7712 12.2277C28.7714 13.2279 29.3333 14.5844 29.3333 15.9989C29.3333 17.4134 28.7714 18.77 27.7712 19.7702C26.771 20.7704 25.4145 21.3323 24 21.3323H22.6667M8 2.6656V5.33227"
                      stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown">
                Casual Nights
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 w-full">
                Relaxed play, deck testing, and trading. Not recorded on the standings.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-start">
              <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                  <path
                      d="M1 14.3341C0.999373 14.5892 1.0719 14.839 1.20898 15.0541C1.34605 15.2692 1.54194 15.4404 1.77339 15.5475L13.2409 20.7612C13.5865 20.9177 13.9615 20.9986 14.3409 20.9986C14.7203 20.9986 15.0954 20.9177 15.441 20.7612L26.8818 15.5609C27.1178 15.4548 27.3179 15.2823 27.4576 15.0645C27.5973 14.8467 27.6706 14.5929 27.6685 14.3341M1 21.0012C0.999373 21.2562 1.0719 21.5061 1.20898 21.7212C1.34605 21.9362 1.54194 22.1075 1.77339 22.2146L13.2409 27.4282C13.5865 27.5847 13.9615 27.6657 14.3409 27.6657C14.7203 27.6657 15.0954 27.5847 15.441 27.4282L26.8818 22.2279C27.1178 22.1218 27.3179 21.9494 27.4576 21.7315C27.5973 21.5137 27.6706 21.2599 27.6685 21.0012M15.4416 1.24055C15.0942 1.08207 14.7167 1.00006 14.3349 1.00006C13.953 1.00006 13.5756 1.08207 13.2281 1.24055L1.80066 6.44084C1.56404 6.54517 1.36287 6.71605 1.22164 6.93268C1.0804 7.1493 1.00521 7.40231 1.00521 7.66091C1.00521 7.9195 1.0804 8.17252 1.22164 8.38914C1.36287 8.60576 1.56404 8.77665 1.80066 8.88098L13.2415 14.0946C13.5889 14.2531 13.9663 14.3351 14.3482 14.3351C14.7301 14.3351 15.1075 14.2531 15.4549 14.0946L26.8957 8.89431C27.1324 8.78998 27.3335 8.6191 27.4748 8.40248C27.616 8.18585 27.6912 7.93284 27.6912 7.67424C27.6912 7.41565 27.616 7.16263 27.4748 6.94601C27.3335 6.72939 27.1324 6.55851 26.8957 6.45418L15.4416 1.24055Z"
                      stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown">
                Loaner Decks
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 w-full">
                Competitive decks available to borrow. No barrier to entry.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-start">
              <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                  <path
                      d="M11.6675 17.8816V20.0498C11.6625 20.5067 11.5402 20.9546 11.3123 21.3506C11.0844 21.7466 10.7586 22.0774 10.3661 22.3113C9.53287 22.9284 8.85508 23.7314 8.38657 24.6564C7.91806 25.5814 7.67175 26.6029 7.6672 27.6397M17.0013 17.8816V20.0498C17.0063 20.5067 17.1286 20.9546 17.3565 21.3506C17.5844 21.7466 17.9102 22.0774 18.3027 22.3113C19.1359 22.9284 19.8137 23.7314 20.2822 24.6564C20.7507 25.5814 20.9971 26.6029 21.0016 27.6397M22.335 10.3341H24.3352C25.2193 10.3341 26.0672 9.98292 26.6924 9.35775C27.3176 8.73258 27.6688 7.88467 27.6688 7.00054C27.6688 6.11642 27.3176 5.2685 26.6924 4.64333C26.0672 4.01816 25.2193 3.66694 24.3352 3.66694H22.335M22.335 10.3341C22.335 12.456 21.4921 14.491 19.9917 15.9914C18.4913 17.4919 16.4563 18.3348 14.3344 18.3348C12.2125 18.3348 10.1775 17.4919 8.67709 15.9914C7.17668 14.491 6.33376 12.456 6.33376 10.3341M22.335 10.3341V2.3335C22.335 1.97985 22.1946 1.64069 21.9445 1.39062C21.6944 1.14055 21.3553 1.00006 21.0016 1.00006H7.6672C7.31355 1.00006 6.97438 1.14055 6.72432 1.39062C6.47425 1.64069 6.33376 1.97985 6.33376 2.3335V10.3341M6.33376 10.3341H4.3336C3.44947 10.3341 2.60156 9.98292 1.97639 9.35775C1.35122 8.73258 1 7.88467 1 7.00054C1 6.11642 1.35122 5.2685 1.97639 4.64333C2.60156 4.01816 3.44947 3.66694 4.3336 3.66694H6.33376M3.66688 27.6689H25.0019"
                      stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown">
                Standings & Prizes
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 w-full">
                Public standings with MTG tiebreakers. Prize support for Top 8.
              </p>
            </div>
          </div>

          {/* Season Cycle Card */}
          <div className="bg-primary-blue p-8 lg:p-16 rounded-3xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col min-w-1/3">
                <h3 className="font-(family-name:--font-young-serif) text-3xl md:text-[40px] text-secondary-yellow">
                  The Season Cycle
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/80">
                  How our competitive structure works:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex gap-3 items-start">
                  <span className="text-secondary-yellow text-2xl leading-none">•</span>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white">
                    3 seasons a year - Spring, Summer &amp; Winter
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-secondary-yellow text-2xl leading-none">•</span>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white">
                    7-8 fortnightly Swiss stages per season
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-secondary-yellow text-2xl leading-none">•</span>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white">
                    Win 3, Draw 1, Loss 0 - worst two results dropped
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-secondary-yellow text-2xl leading-none">•</span>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white">
                    OMW% tiebreaks and a Top 8 single-elimination bracket
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
        <Link
            href="/how-it-works"
            className="place-self-center mt-8 bg-secondary-yellow h-12 px-6 flex items-center justify-center w-fit rounded-md font-(family-name:--font-inter) font-semibold text-sm text-dark-brown hover:bg-secondary-yellow transition-colors"
        >
          How the League Works →
        </Link>
      </section>

      {/* Our Values Section */}
      <section className="bg-dark-brown px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col gap-10">
          {/* Left - Our Values */}
          <div className="flex flex-col gap-12">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-secondary-yellow leading-tight">
              Our Values
            </h2>

            <div className="flex flex-col gap-6">
              <div
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Accessible Competitive Play
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  Everyone deserves the chance to compete at a high level. Pauper keeps costs low without sacrificing
                  skill or strategy.
                </p>
              </div>

              <div
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Inclusive & Community-Focused
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  We welcome players of all backgrounds and skill levels. Respect, sportsmanship, and fun are
                  non-negotiable.
                </p>
              </div>

              <div
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  100% Non-Profit
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  Run entirely by volunteers. Every penny goes back into prize support, loaner decks, and the community.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Community Run */}
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-white leading-tight">
              Community Run
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-white/70">
              The league is powered by player volunteers who organize events, manage standings, and keep the community
              thriving.
            </p>

            {/* Volunteer Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Judging & Rules
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  We play according to the <Link
                    href="https://magic.wizards.com/en/formats/pauper"
                    target="_blank"
                    className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-base w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
                >
                  official Pauper rules
                </Link>. Judging is handling casually between players, with the venue team on hand to help.
                </p>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Content Creation
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  We share our love of pauper with match videos, deck and tourney write-ups, and a host of other engaging MTG content.
                </p>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Event Support
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  We collaborate with our local venues and the wider pauper scene in the UK to help be part of the nations growing common Magic the Gathering movement.
                </p>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-3">
                  Deck Donation
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70">
                  Our ever expanding <Link
                    href="/loaner-decks"
                    className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-base w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
                >
                  deck library
                </Link> is available thanks to the generosity of our great members.
                </p>
              </div>
            </div>
            <Link
                href="/volunteer"
                className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-lg pb-1 w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
            >
              About Us →
            </Link>
          </div>
        </div>
      </section>

      {/* Loaner Decks Section */}
      <section className="bg-sage-green px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          <div className="flex-1 flex flex-col gap-12">
            <div className="max-w-200">
              <h2 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl lg:text-[72px] xl:text-[80px] 2xl:text-[88px] text-dark-brown leading-none mb-8">
                No deck? No problem.
              </h2>
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-dark-brown/80 leading-relaxed">
                We maintain a library of competitive loaner decks available to borrow at every event. Come empty-handed
                and leave with a full deck box.
              </p>
            </div>

            {/* Steps Block */}
            <div className="flex flex-col gap-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
            <span className="font-(family-name:--font-bricolage-grotesque) font-bold text-2xl text-white">
              1
            </span>
                </div>
                <div>
                  <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mb-2">
                    Pick a deck
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown/70">
                    Browse our collection and choose a strategy that fits your playstyle.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
            <span className="font-(family-name:--font-bricolage-grotesque) font-bold text-2xl text-white">
              2
            </span>
                </div>
                <div>
                  <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mb-2">
                    Play & return
                  </h3>
                  <p className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown/70">
                    Use it for the event and return it at the end of the night. It&#39;s that simple.
                  </p>
                </div>
              </div>

              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/60 mt-4">
                All loaner decks are tournament-legal and competitively viable. Decks are updated regularly to reflect
                the current meta.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-150 h-auto shrink-0">
            <Image
                src="/loaner-decks.jpg"
                alt="Loaner Decks"
                width={600}
                height={600}
                className="w-full h-auto object-contain rounded-4xl"
                priority
            />
          </div>

        </div>
      </section>
      {/* Events Section */}
      <section className="bg-light-purple px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-primary-blue leading-tight">
              Upcoming Events
            </h2>
            <Link
                href="/events"
                className="border-b-2 border-primary-blue text-primary-blue font-(family-name:--font-bricolage-grotesque) font-semibold text-lg pb-1 hover:border-darker-blue hover:text-darker-blue transition-colors"
            >
              View full calendar →
            </Link>
          </div>

          {/* Event Cards */}
          <EventList events={upcomingEvents} />
        </div>
      </section>

      {/* Standings Section */}
      <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left - Standings Table */}
          <div className="flex-1">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-dark-brown leading-tight mb-4">
              Season Standings
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60 mb-12">
              {activeSeason
                ? `Current standings — ${activeSeason.name}`
                : "No season is currently active."}
            </p>

            <StandingsTable
              rows={standings}
              variant="preview"
              maxRows={8}
              emptyMessage={
                activeSeason
                  ? "Standings will appear here once the season's first results are in."
                  : "Standings will appear here when a new season begins."
              }
            />
          </div>

          {/* Right - Sidebar */}
          <div className="w-full lg:w-95 flex flex-col gap-8">
            <div className="bg-light-purple p-8 rounded-2xl">
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-4">
                Past Seasons
              </h3>
              <PastSeasonsList seasons={pastSeasons} />
            </div>

            <Link
                href="/standings"
                className="border-b-2 border-primary-blue text-primary-blue font-(family-name:--font-bricolage-grotesque) font-semibold text-lg pb-1 w-fit hover:border-darker-blue hover:text-darker-blue transition-colors"
            >
              Full standings →
            </Link>

            <div className="bg-primary-blue p-8 rounded-2xl">
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/80 leading-relaxed">
                Standings are based on match points, with tiebreakers using OMW%, GW%, and OGW% following official MTG
                rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Code of Conduct */}
          <div className="flex flex-col gap-6">
            <h3 className="font-(family-name:--font-young-serif) text-2xl md:text-[32px] text-secondary-yellow">
              Code of Conduct
            </h3>
            <p className="font-(family-name:--font-bricolage-grotesque) text-base text-light-purple leading-relaxed">
              We maintain a welcoming, respectful environment for all players. Harassment, discrimination, and
              unsportsmanlike conduct will not be tolerated.
            </p>
            <Link
                href="/code-of-conduct"
                className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-base pb-1 w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
            >
              Read more
            </Link>
          </div>

          {/* League Rules */}
          <div className="flex flex-col gap-6">
            <h3 className="font-(family-name:--font-young-serif) text-2xl md:text-[32px] text-secondary-yellow">
              League Rules
            </h3>
            <p className="font-(family-name:--font-bricolage-grotesque) text-base text-light-purple leading-relaxed">
              League nights run Swiss rounds with REL Casual enforcement. Match points determine standings, with
              official MTG tiebreakers.
            </p>
            <Link
                href="/rules"
                className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-base pb-1 w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
            >
              Read more
            </Link>
          </div>

          {/* Data & Privacy */}
          <div className="flex flex-col gap-6">
            <h3 className="font-(family-name:--font-young-serif) text-2xl md:text-[32px] text-secondary-yellow">
              Data & Privacy
            </h3>
            <p className="font-(family-name:--font-bricolage-grotesque) text-base text-light-purple leading-relaxed">
              Your data is stored securely and never shared with third parties. We only collect what&#39;s needed to run the
              league.
            </p>
            <Link
                href="/privacy"
                className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-base pb-1 w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
            >
              Read more
            </Link>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="bg-dark-brown px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-white leading-tight">
            Follow the League
          </h2>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left - Feature Video */}
            <div className="w-full lg:w-190 flex flex-col gap-4">
              <div className="bg-dark-card h-100 rounded-3xl flex items-center justify-center px-6">
                <p className="font-(family-name:--font-bricolage-grotesque) text-white/50 text-center">
                  YouTube thumbnail here :)
                </p>
              </div>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/60">
                Season 1 Recap: Alex Morgan&#39;s Championship Run
              </p>
            </div>

            {/* Right - Social Feed */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark-card aspect-square rounded-xl flex items-center justify-center px-2">
                  <p className="font-(family-name:--font-bricolage-grotesque) text-white/50 text-xs text-center">
                    Event photo
                  </p>
                </div>
                <div className="bg-dark-card aspect-square rounded-xl flex items-center justify-center px-2">
                  <p className="font-(family-name:--font-bricolage-grotesque) text-white/50 text-xs text-center">
                    Event photo
                  </p>
                </div>
                <div className="bg-dark-card aspect-square rounded-xl flex items-center justify-center px-2">
                  <p className="font-(family-name:--font-bricolage-grotesque) text-white/50 text-xs text-center">
                    Event photo
                  </p>
                </div>
              </div>

              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/70 leading-relaxed">
                Follow us on social media for event updates, deck techs, tournament coverage, and community highlights.
              </p>

              {/* Social Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                    href="https://instagram.com/brightonpauperleague"
                    className="px-6 py-3 bg-dark-card text-white font-(family-name:--font-inter) font-semibold text-sm rounded-lg hover:bg-[#5a3a40] transition-colors"
                >
                  Instagram
                </Link>
                <Link
                    href="https://youtube.com/@brightonpauperleague"
                    className="px-6 py-3 bg-dark-card text-white font-(family-name:--font-inter) font-semibold text-sm rounded-lg hover:bg-[#5a3a40] transition-colors"
                >
                  YouTube
                </Link>
                <Link
                    href="https://twitter.com/brightonpauper"
                    className="px-6 py-3 bg-dark-card text-white font-(family-name:--font-inter) font-semibold text-sm rounded-lg hover:bg-[#5a3a40] transition-colors"
                >
                  X / Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="bg-sage-green px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y 2xl:py-[10rem]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <div className="max-w-200">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] text-dark-brown leading-tight mb-6">
              Want to help?
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-dark-brown/80 leading-relaxed">
              The league runs entirely on volunteer power. Whether you want to judge, create content, or just help set
              up, we&#39;d love to have you on the team.
            </p>
          </div>

          {/* Volunteer Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-off-white p-8 rounded-2xl flex flex-col gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                    d="M12.0004 15.9993L14.6668 18.666L19.9996 13.3325M26.6656 17.3333C26.6656 24.0002 21.9994 27.3336 16.4533 29.267C16.1629 29.3654 15.8474 29.3607 15.5601 29.2537C10.0006 27.3336 5.33441 24.0002 5.33441 17.3333V7.99963C5.33441 7.646 5.47487 7.30685 5.7249 7.05679C5.97492 6.80674 6.31402 6.66626 6.66761 6.66626C9.33401 6.66626 12.667 5.0662 14.9868 3.03947C15.2692 2.79813 15.6285 2.66553 16 2.66553C16.3715 2.66553 16.7308 2.79813 17.0132 3.03947C19.3463 5.07954 22.666 6.66626 25.3324 6.66626C25.686 6.66626 26.0251 6.80674 26.2751 7.05679C26.5252 7.30685 26.6656 7.646 26.6656 7.99963V17.3333Z"
                    stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown">
                Judging & Rules
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/70">
                Help answer rules questions and resolve disputes during events.
              </p>
            </div>

            <div className="bg-off-white p-8 rounded-2xl flex flex-col gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                <path
                    d="M18.3637 1.37654C17.9505 1.1301 17.4784 0.999993 16.9973 1H11.6729C11.1923 0.999974 10.7206 1.1298 10.3077 1.37574C9.89483 1.62168 9.5561 1.97461 9.32733 2.39719L8.67528 3.60241C8.44652 4.02499 8.10779 4.37792 7.69491 4.62386C7.28204 4.8698 6.81036 4.99963 6.32976 4.9996H3.66688C2.95958 4.9996 2.28125 5.28052 1.78111 5.78057C1.28097 6.28062 1 6.95883 1 7.666V19.6648C1 20.372 1.28097 21.0502 1.78111 21.5502C2.28125 22.0503 2.95958 22.3312 3.66688 22.3312H25.0019C25.7092 22.3312 26.3876 22.0503 26.8877 21.5502C27.3878 21.0502 27.6688 20.372 27.6688 19.6648V7.666C27.6688 6.95883 27.3878 6.28062 26.8877 5.78057C26.3876 5.28052 25.7092 4.9996 25.0019 4.9996H22.339C21.8579 4.99961 21.3858 4.8695 20.9727 4.62306C20.5595 4.37661 20.2207 4.02302 19.9922 3.59974L19.3441 2.39986C19.1156 1.97658 18.7768 1.62299 18.3637 1.37654Z"
                    stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown">
                Content Creation
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/70">
                Write articles, create videos, or design graphics for the community.
              </p>
            </div>

            <div className="bg-off-white p-8 rounded-2xl flex flex-col gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                    d="M21.3338 28V25.3333C21.3338 23.9188 20.7718 22.5623 19.7715 21.5621C18.7713 20.5619 17.4146 20 16 20H7.99936C6.58476 20 5.2281 20.5619 4.22783 21.5621C3.22755 22.5623 2.6656 23.9188 2.6656 25.3333V28M21.3338 4.17057C22.4775 4.46707 23.4905 5.13493 24.2136 6.06932C24.9367 7.00372 25.329 8.15176 25.329 9.33324C25.329 10.5147 24.9367 11.6628 24.2136 12.5972C23.4905 13.5316 22.4775 14.1994 21.3338 14.4959M29.3344 27.9998V25.3332C29.3335 24.1515 28.9402 23.0035 28.2161 22.0696C27.4921 21.1357 26.4783 20.4686 25.3341 20.1732M17.3334 9.33333C17.3334 12.2789 14.9454 14.6667 11.9997 14.6667C9.05393 14.6667 6.66592 12.2789 6.66592 9.33333C6.66592 6.38781 9.05393 4 11.9997 4C14.9454 4 17.3334 6.38781 17.3334 9.33333Z"
                    stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown">
                Event Support
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/70">
                Assist with setup, registration, and keeping events running smoothly.
              </p>
            </div>

            <div className="bg-off-white p-8 rounded-2xl flex flex-col gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="29" viewBox="0 0 26 29" fill="none">
                <path
                    d="M1.39974 7.66445L12.9997 14.3315M12.9997 14.3315L24.5997 7.66445M12.9997 14.3315L13 27.6656M25 8.99773C24.9995 8.53007 24.8761 8.07075 24.6421 7.66587C24.408 7.26098 24.0717 6.92476 23.6667 6.69093L14.3333 1.35729C13.9279 1.12322 13.4681 1 13 1C12.5319 1 12.0721 1.12322 11.6667 1.35729L2.33333 6.69093C1.92835 6.92476 1.59197 7.26098 1.35795 7.66587C1.12392 8.07075 1.00048 8.53007 1 8.99773V19.665C1.00048 20.1327 1.12392 20.592 1.35795 20.9969C1.59197 21.4018 1.92835 21.738 2.33333 21.9718L11.6667 27.3054C12.0721 27.5395 12.5319 27.6627 13 27.6627C13.4681 27.6627 13.9279 27.5395 14.3333 27.3054L23.6667 21.9718C24.0717 21.738 24.408 21.4018 24.6421 20.9969C24.8761 20.592 24.9995 20.1327 25 19.665V8.99773Z"
                    stroke="#004AAD" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown">
                Donating Decks
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/70">
                Contribute cards or full decks to expand our loaner library.
              </p>
            </div>
          </div>

          <p className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown">
            Interested? Email us at{' '}
            <a
                href="mailto:contact@brightonpauperleague.com?subject=Volunteering enquiry"
                className="border-b-2 border-primary-blue text-primary-blue font-semibold hover:border-darker-blue hover:text-darker-blue transition-colors"
            >
              contact@brightonpauperleague.com
            </a>
          </p>
        </div>
      </section>

      <Footer/>
    </>
  );
}
