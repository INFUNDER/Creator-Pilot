import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface AnimationProps {
  [key: string]: any;
}

interface ScrollProps {
  [key: string]: any;
}

/**
 * Animate a target element with GSAP and optional ScrollTrigger.
 */
export const animateWithGsap = (
  target: string | Element | Element[] | null,
  animationProps: AnimationProps,
  scrollProps?: ScrollProps
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

/**
 * Animate using a GSAP Timeline for complex sequences (like 3D rotations and target animations).
 */
export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: React.RefObject<any>,
  rotationState: number,
  firstTarget: string | Element | Element[] | null,
  secondTarget: string | Element | Element[] | null,
  animationProps: AnimationProps
) => {
  if (!rotationRef.current) return;

  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
