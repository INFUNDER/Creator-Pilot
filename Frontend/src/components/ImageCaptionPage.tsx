"use client";
import { useGSAP } from "@gsap/react";
import React, { useRef, useState } from "react";
import { animateWithGsap } from "../utils/animations";
import { FileUpload } from "../component/ui/file-upload";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";

const ImageCaptionPage: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useGSAP(() => {
    animateWithGsap("#features_title", { y: 0, opacity: 1 });
  }, []);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (uploadedFile) {
      setShowPreview(true);

      if (previewRef.current) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: previewRef.current.offsetTop },
        });
      }

      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("image", uploadedFile);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

        const response = await fetch("http://localhost:5001/caption", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to generate caption");
        }

        const data = await response.json();
        setGeneratedText(data.caption);
        toast.success("Caption generated successfully! 🎉");

      } catch (error) {
        console.error("Error generating caption:", error);
        toast.error("Failed to generate caption. Please try again.");
        setGeneratedText("Failed to generate caption. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const modifyCaption = (type: string) => {
    let newCaption = generatedText;
    switch (type) {
      case "humorize":
        newCaption = "Why did the image go to therapy? Too many layers!";
        break;
      case "rephrase":
        newCaption = "Here’s a different way to put it: A creatively generated caption!";
        break;
      case "sarcastic":
        newCaption = "Oh wow, another masterpiece. Truly breathtaking… 🙄";
        break;
      case "punify":
        newCaption = "This caption is so sharp—it might just pixelate your thoughts!";
        break;
      default:
        newCaption = generatedText;
    }
    setGeneratedText(newCaption);
  };

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <Toaster position="top-right" /> {/* Toast container */}
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">Image Caption Generation</h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-5">
            <h2 className="text-5xl lg:text-5xl font-semibold">Upload Your Image.</h2>
            <FileUpload onChange={handleFileChange} />
          </div>

          <button
            onClick={handleGenerate}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            disabled={isLoading}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              {isLoading ? "Generating..." : "Generate"}
            </span>
          </button>
        </div>

        <br />
        <br />

        {showPreview && previewUrl && (
          <div ref={previewRef} className="mt-16 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4">Your Uploaded Image</h2>
            <img src={previewUrl} alt="Preview" className="max-w-xl rounded-lg shadow-lg" />

            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-2xl font-semibold mb-2">Generated Caption:</h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
              ) : (
                <textarea
                  className="w-full p-3 border rounded-md bg-gray-100 text-lg"
                  rows={3}
                  readOnly
                  value={generatedText}
                  placeholder="Generating caption..."
                />
              )}
            </div>

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

export default ImageCaptionPage;
