"use client";
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Page Components
import { Dashboard } from "./pages/Dashboard";
import { ImageCap } from "./pages/ImageCap";
import { VideoCap } from "./pages/VideoCap";
import { Feature2 } from "./pages/Feature2";
import { Contact } from "./pages/Contactd";

const App: React.FC = () => {
  return (
    <main className="bg-black">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/image-caption" element={<ImageCap />} />
          <Route path="/video-caption" element={<VideoCap />} />
          <Route path="/features" element={<Feature2 />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
