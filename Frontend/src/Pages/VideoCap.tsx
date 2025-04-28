"use client";
import React from "react";
import Navbar from "../components/Navbar";
import VideoCaptionPage from "../components/VideoCaptionPage";
import Footer from "../components/Footer";

export const VideoCap: React.FC = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <VideoCaptionPage />
      <Footer />
    </div>
  );
};
