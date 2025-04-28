"use client";
import React from "react";
import Navbar from "../components/Navbar";
import { ShootingStarsAndStarsBackgroundDemo } from "../components/ShootingStarsAndStarsBackgroundDemo";
import Highlights from "../components/Highlights";
import Features from "../components/Features";
import Footer from "../components/Footer";

export const Dashboard: React.FC = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <ShootingStarsAndStarsBackgroundDemo />
      <Highlights />
      <Features />
      <Footer />
    </div>
  );
};
