import React from 'react';
import Banner from '../Banner/Banner';
import ServicesSection from '../Services/ServicesSection';
import ClientLogosMarquee from '../ClientLogosMarquee/ClientLogosMarquee';
import BenefitSection from '../Benefits/BenefitSection';
import BeMerchant from '../BeMerchant/BeMerchant';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <ServicesSection></ServicesSection>
            <ClientLogosMarquee></ClientLogosMarquee>
            <BenefitSection></BenefitSection>
            <BeMerchant></BeMerchant>
        </div>
    );
};

export default Home;