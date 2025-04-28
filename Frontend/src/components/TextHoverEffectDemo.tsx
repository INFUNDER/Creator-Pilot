"use client";
import React from "react";
import { TextHoverEffect } from "../component/ui/text-hover-effect";

export const TextHoverEffectDemo: React.FC = () => {
  return (
    <div className="h-[40rem] flex items-center justify-center">
      <TextHoverEffect text="Creator" />
    </div>
  );
};
