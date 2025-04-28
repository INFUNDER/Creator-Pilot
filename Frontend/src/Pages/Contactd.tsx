"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";

export const Contact: React.FC = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <HowItWorks />
      <Footer />
    </div>
  );
};
