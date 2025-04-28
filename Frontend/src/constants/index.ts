import {
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
} from "../utils";

// --- NAVIGATION LISTS ---
export const navLists: string[] = ["Dashboard", "Features", "Contact"];

// --- HIGHLIGHTS SLIDES ---
export interface HighlightSlide {
  id: number;
  textLists: string[];
  video: string;
  videoDuration: number;
}

export const hightlightsSlides: HighlightSlide[] = [
  {
    id: 1,
    textLists: [
      "Image Generation",
      "Further Modify the Caption.",
      "Upload Your Image and Generate Caption.",
    ],
    video: highlightFirstVideo,
    videoDuration: 5,
  },
  {
    id: 2,
    textLists: ["Modify the Caption.", "Sarcasm, Humor, and More."],
    video: highlightSecondVideo,
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Video Caption Generation",
      "Generate Captions for Your Videos.",
    ],
    video: highlightThirdVideo,
    videoDuration: 5,
  },
  {
    id: 4,
    textLists: ["Embed Captions.", "Embed Different Styles."],
    video: highlightFourthVideo,
    videoDuration: 5,
  },
];

// --- FOOTER LINKS ---
export const footerLinks: string[] = [
  "Privacy Policy",
  "Terms of Use",
  "Policy",
  "Legal",
];
