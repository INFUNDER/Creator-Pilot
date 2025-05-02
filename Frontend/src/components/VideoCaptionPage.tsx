"use client";
import { useGSAP } from "@gsap/react";
import React, { useRef, useState } from "react";
import { animateWithGsap } from "../utils/animations";
import { FileUpload } from "../component/ui/file-upload";
import gsap from "gsap";
import axios from "axios";

const VideoCaptionPage: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useGSAP(() => {
    animateWithGsap("#features_title", { y: 0, opacity: 1 });
  }, []);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setSelectedFile(URL.createObjectURL(file));
      setUploadedVideo(file);
      setShowPreview(false);
      setGeneratedVideoUrl("");
      setGeneratedText("");
    }
  };

  const handleGenerate = async () => {
    if (!uploadedVideo) return;

    setShowPreview(true);
    setGeneratedText("Processing video...");

    if (previewRef.current) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: previewRef.current.offsetTop },
      });
    }

    const formData = new FormData();
    formData.append("video", uploadedVideo);

    try {
      const response = await axios.post("http://localhost:5001/caption_video", formData, {
        responseType: "blob",
      });

      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);
      setGeneratedText("✅ Captioned video ready!");
    } catch (error) {
      console.error("❌ Error generating video caption:", error);
      setGeneratedText("❌ Failed to generate captioned video.");
    }
  };

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">Video Caption Generation</h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-5">
            <h2 className="text-5xl lg:text-5xl font-semibold">Upload Your Video</h2>
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

        {showPreview && (
          <div ref={previewRef} className="mt-16 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-4">Your Captioned Video</h2>

            {generatedVideoUrl ? (
              <>
                <video controls src={generatedVideoUrl} className="max-w-xl rounded-lg shadow-lg" />
                <div className="mt-4 flex gap-4">
                <button
 onClick={() => {
  const a = document.createElement("a");
  a.href = generatedVideoUrl;
  a.download = "captioned_video.mp4";
  a.click();
}}  // your download function
  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
>
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Download
  </span>
</button>

                </div>
              </>
            ) : (
              <p className="text-lg font-medium text-white">{generatedText}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoCaptionPage;


