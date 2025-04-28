"use client";
import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Explorefeature from "../components/Explorefeature";

export const Feature2: React.FC = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <Explorefeature />
      <Footer />
    </div>
  );
};
