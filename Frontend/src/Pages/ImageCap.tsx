"use client";
import React from "react";
import Navbar from "../components/Navbar";
import ImageCaptionPage from "../components/ImageCaptionPage";
import Footer from "../components/Footer";

export const ImageCap: React.FC = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <ImageCaptionPage />
      <Footer />
    </div>
  );
};
