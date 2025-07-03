import React from 'react';
import location from "../../../assets/location-merchant.png"
const BeMerchant = () => {
    return (
      <div
        data-aos="zoom-in-up"
        className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] shadow-2xl rounded-4xl p-20"
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={location} className=" rounded-lg" />
          <div>
            <h1 className="text-5xl text-white font-bold">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6 text-gray-400">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
            <button className="btn btn-primary rounded-full mr-2 text-black font-bold">
              Become a Merchant
            </button>
            <button className="btn btn-primary rounded-full btn-outline">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    );
};

export default BeMerchant;