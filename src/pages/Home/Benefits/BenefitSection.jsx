import React from "react";
import BenefitCard from "./BenefitCard";
import liveTracking from "../../../assets/live-tracking.png";
import safeDelivery from "../../../assets/safe-delivery.png";

const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: liveTracking,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safeDelivery,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: safeDelivery,
  },
];

const BenefitSection = () => {
  return (
    <section className="space-y-8 w-full mx-auto">
      {benefits.map((benefit) => (
        <BenefitCard
          key={benefit.id}
          title={benefit.title}
          description={benefit.description}
          image={benefit.image}
        />
      ))}
    </section>
  );
};

export default BenefitSection;
