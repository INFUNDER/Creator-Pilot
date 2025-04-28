"use client";
import React from "react";
import { ShootingStars } from "../component/ui/shooting-stars";
import { StarsBackground } from "../component/ui/stars-background";
import { TextHoverEffect } from "../component/ui/text-hover-effect";

export const ShootingStarsAndStarsBackgroundDemo: React.FC = () => {
  return (
    <div className="h-[30rem] rounded-md bg-black flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 w-full text-[clamp(3rem,10vw,12rem)] leading-none text-center font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white">
        <TextHoverEffect text="CreatorPilot" />
      </h2>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};
