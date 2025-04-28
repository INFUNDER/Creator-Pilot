"use client";
import { useGSAP } from "@gsap/react";
import React, { useRef, useState } from "react";
import { animateWithGsap } from "../utils/animations";
import { FileUpload } from "../component/ui/file-upload";
import gsap from "gsap";

const VideoCaptionPage: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null); // For scrolling to preview
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false); // Controls visibility

  useGSAP(() => {
    animateWithGsap("#features_title", { y: 0, opacity: 1 });
  }, []);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setSelectedFile(URL.createObjectURL(file)); // Store video URL
      setShowPreview(false); // Keep hidden until "Generate" is clicked
    }
  };

  const handleGenerate = () => {
    if (selectedFile) {
      setShowPreview(true);

      if (previewRef.current) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: previewRef.current.offsetTop },
        });
      }

      // Simulate AI processing delay
      setTimeout(() => {
        setGeneratedText("This is a sample AI-generated caption for your video.");
      }, 1500);
    }
  };

  const modifyCaption = (type: string) => {
    let newCaption = generatedText;
    switch (type) {
      case "humorize":
        newCaption = "This video deserves an Oscar… for best unexpected twist!";
        break;
      case "rephrase":
        newCaption = "Here’s a different take: A brilliantly summarized caption!";
        break;
      case "sarcastic":
        newCaption = "Oh wow, another cinematic masterpiece. Truly life-changing… 🙄";
        break;
      case "punify":
        newCaption = "This video is on a reel roll! 🎬";
        break;
      default:
        newCaption = generatedText;
    }
    setGeneratedText(newCaption);
  };

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">Video Caption Generation</h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-5">
            <h2 className="text-5xl lg:text-5xl font-semibold">Upload Your Video.</h2>
            <FileUpload onChange={handleFileChange} />
          </div>

          <button
            onClick={handleGenerate}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Generate
            </span>
          </button>
        </div>

        <br />

        {showPreview && selectedFile && (
          <div ref={previewRef} className="mt-16 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4">Your Generated Video</h2>
            <video controls src={selectedFile} className="max-w-xl rounded-lg shadow-lg"></video>

            <div className="mt-4 flex flex-wrap gap-4">
              {["Humorize", "Rephrase", "Sarcastic", "Punify"].map((label, index) => (
                <button
                  key={index}
                  onClick={() => modifyCaption(label.toLowerCase())}
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoCaptionPage;
