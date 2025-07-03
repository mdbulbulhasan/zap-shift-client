import React from 'react';

const ServiceCard = ({ service }) => {
    const {icon, title, description} = service;
  return (
    <div className="card bg-base-200 hover:bg-[#c9df8a] transform hover:-translate-y-2 transition-all duration-300 shadow-xl h-full">
      <div className="card-body items-center hover:text-black text-center">
        {icon}
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;