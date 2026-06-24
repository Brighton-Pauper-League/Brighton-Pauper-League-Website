"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
const CARDS = [
  { src: "/p10-1-lightning-bolt.jpg", alt: "Lightning Bolt" },
  { src: "/mmq-61-brainstorm.jpg", alt: "Brainstorm" },
  { src: "/usg-270-priest-of-titania.jpg", alt: "Priest of Titania" },
  { src: "/mrd-211-myr-enforcer.jpg", alt: "Myr Enforcer" },
  { src: "/hop-24-dark-ritual.jpg", alt: "Dark Ritual" },
  { src: "/tmp-294-lotus-petal.jpg", alt: "Lotus Petal" },
  { src: "/leb-55-counterspell.jpg", alt: "Counterspell" },
  { src: "/cmr-216-annoyed-altisaur.jpg", alt: "Annoyed Altisaur" },
  { src: "/vis-55-crypt-rats.jpg", alt: "Crypt Rats" },
  { src: "/me1-10-dust-to-dust.jpg", alt: "Dust to Dust" },
  { src: "/mh1-7-ephemerate.jpg", alt: "Ephemerate" },
  { src: "/neo-138-experimental-synthesizer.jpg", alt: "Experimental Synthesizer" },
  { src: "/cmm-229-guttersnipe.jpg", alt: "Guttersnipe" },
  { src: "/jud-18-prismatic-strands.jpg", alt: "Prismatic Strands" },
  { src: "/mmq-162-snuff-out.jpg", alt: "Snuff Out" },
  { src: "/lrw-89-spellstutter-sprite.jpg", alt: "Spellstutter Sprite" },
  { src: "/dmu-72-tolarian-terror.jpg", alt: "Tolarian Terror" },
  { src: "/atq-85a-urza-s-tower.jpg", alt: "Urza's Tower" },
  { src: "/mh1-191-weather-the-storm.jpg", alt: "Weather the Storm" },
];

export function CardCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop={true}
      slidesPerView={2}
      spaceBetween={12}
      breakpoints={{
        640: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
      }}
      className="w-full"
    >
      {CARDS.map((card) => (
        <SwiperSlide key={card.src}>
          <div className="relative w-full aspect-[63/88] rounded-lg overflow-hidden">
            <Image
              src={card.src}
              alt={card.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
