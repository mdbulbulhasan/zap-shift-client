import React from "react";
import Marquee from "react-fast-marquee";

// Import local images
import casio from "../../../assets/brands/casio.png";
import amazon from "../../../assets/brands/amazon.png";
import amazonVector from "../../../assets/brands/amazon_vector.png";
import moonstar from "../../../assets/brands/moonstar.png";
import start from "../../../assets/brands/start.png";
import startPeople from "../../../assets/brands/start-people 1.png";
import randstad from "../../../assets/brands/randstad.png";

const logos = [
  casio,
  amazon,
  amazonVector,
  moonstar,
  start,
  startPeople,
  randstad,
];

const ClientLogosMarquee = () => {
  return (
    <section className="bg-white py-10">
      <h2 className="text-2xl md:text-3xl text-primary font-extrabold text-center mb-6">
        We've helped thousands of sales teams
      </h2>

      <Marquee gradient={false} speed={50} pauseOnHover={true} direction="left">
        {logos.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt={`Client ${idx + 1}`}
            className="w-32 h-6 mx-24 object-contain"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;
