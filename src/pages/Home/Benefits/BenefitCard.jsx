import React from "react";

const BenefitCard = ({ title, description, image }) => {
  return (
    <div className="card bg-base-100 shadow-lg flex flex-col md:flex-row items-center p-6 rounded-xl">
      {/* Left: Illustration */}
      <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
        <img
          src={image}
          alt={title}
          className="h-32 w-32 md:h-48 md:w-48 object-contain"
        />
      </div>

      {/* Middle: Vertical Dashed Line */}
      <div className="hidden md:block h-24 border-l-2 border-dashed border-gray-300 mx-6" />

      {/* Right: Text Content */}
      <div className="w-full md:w-3/4 ml-0 md:ml-8 text-center md:text-left">
        <h3 className="text-2xl font-extrabold text-primary mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default BenefitCard;
