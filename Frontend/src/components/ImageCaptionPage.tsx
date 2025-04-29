"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { animateWithGsap } from "../utils/animations";
import { FileUpload } from "../component/ui/file-upload";
import gsap from "gsap";
import { toast } from "sonner";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const ImageCaptionPage: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useGSAP(() => {
    animateWithGsap("#features_title", { y: 0, opacity: 1 });
  }, []);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      console.log("✅ Selected file:", newFiles[0]);
      setSelectedFile(newFiles[0]);
      setShowPreview(false);
      setGeneratedText("");
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      console.error("❌ No file selected");
      return;
    }

    setLoading(true);
    console.log("🚀 Starting caption generation...");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5001/caption", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,  // <<< ADD THIS
      });

      console.log("✅ Caption generated:", response.data);

      setGeneratedText(response.data.caption);
      setShowPreview(true);
      toast.success("Caption generated successfully!");

      if (previewRef.current) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: previewRef.current.offsetTop },
        });
      }
    } catch (error) {
      console.error("❌ Error generating caption:", error);
      toast.error("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modifyCaption = async (style: string) => {
    if (!generatedText) {
      toast.error("No caption available to transform!");
      console.error("❌ No caption to transform");
      return;
    }

    console.log(`🚀 Sending caption for transformation (${style})...`);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/transform_caption", {
        caption: generatedText,
        style: style,
      });

      console.log("✅ Transformation Response:", response.data);

      const transformed_caption = response.data.transformed_caption;

      if (transformed_caption) {
        setGeneratedText(transformed_caption);
        console.log("✅ Updated caption to transformed text");
        toast.success(`Caption transformed to ${style}!`);
      } else {
        console.error("❌ No transformed caption received from backend.");
        toast.error("No transformed caption received.");
      }
    } catch (error) {
      console.error("❌ Error transforming caption:", error);
      toast.error("Failed to transform caption.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCaption = () => {
    if (!generatedText) {
      console.error("❌ No caption to download");
      return;
    }
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "caption.txt";
    a.click();
    URL.revokeObjectURL(url);

    console.log("✅ Download initiated");
  };

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">Image Caption Generation</h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-5">
            <h2 className="text-5xl lg:text-5xl font-semibold">Upload Your Image</h2>
            <FileUpload onChange={handleFileChange} />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none"
          >
             <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
             <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              {loading ? <ClipLoader size={20} color="white" /> : "Generate"}
            </span>
          </button>
        </div>

        {showPreview && (
          <div ref={previewRef} className="mt-16 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4">Your Uploaded Image</h2>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-w-xl rounded-lg shadow-lg"
              />
            )}

            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-2xl font-semibold mb-2">Generated Caption:</h3>
              <textarea
                className="w-full p-3 border rounded-md bg-gray-100 text-lg"
                rows={4}
                value={generatedText}
                readOnly
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {["humor", "sarcasm", "punify", "rephrase"].map((type) => (
                <button
                  key={type}
                  onClick={() => modifyCaption(type)}
                  
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none capitalize"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    {type}
                  </span>
                </button>
              ))}

              <button
                onClick={downloadCaption}
                disabled={!generatedText}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Download
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageCaptionPage;
