"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { animateWithGsap } from "../utils/animations";
import { SignupFormDemo } from "../components/SignupFormDemo";

const HowItWorks: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    gsap.from("#chip", {
      scrollTrigger: {
        trigger: "#chip",
        start: "20% bottom",
      },
      opacity: 0,
      scale: 5,
      duration: 2,
      ease: "power2.inOut",
    });

    animateWithGsap(".g_fadeIn", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <p className="text-3xl">Contact Us</p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            Have questions?
            <br />
          </h2>

          <p className="hiw-subtitle">
            We're here to help! Reach out to us and let's connect.
          </p>
        </div>

        <div className="hiw-text-container">
          <div className="flex flex-1 justify-center flex-col">
            {/* You can add extra content here if needed */}
          </div>
        </div>

        <br />
        <br />

        <SignupFormDemo />
      </div>
    </section>
  );
};

export default HowItWorks;
