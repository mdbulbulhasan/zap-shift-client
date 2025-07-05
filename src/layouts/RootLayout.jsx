import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';

const RootLayout = () => {
    return (
      <div>
        <div className="w-full bg-base-100 shadow-2xl mb-3">
          <Navbar></Navbar>
        </div>
        <div className="max-w-[85%] mx-auto">
          <Outlet></Outlet>
        </div>
        <Footer></Footer>
      </div>
    );
};

export default RootLayout;