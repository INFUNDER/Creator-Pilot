"use client";
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import { animateWithGsap } from '../utils/animations';
import { explore1Img, explore2Img, exploreVideo } from '../utils';
import gsap from 'gsap';

const Features: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    gsap.to('#exploreVideo', {
      scrollTrigger: {
        trigger: '#exploreVideo',
        toggleActions: 'play pause reverse restart',
        start: '-10% bottom',
      },
      onComplete: () => {
        videoRef.current?.play();
      }
    });

    animateWithGsap('#features_title', { y: 0, opacity: 1 });
    animateWithGsap(
      '.g_grow',
      { scale: 1, opacity: 1, ease: 'power1' },
      { scrub: 5.5 }
    );
    animateWithGsap(
      '.g_text',
      { y: 0, opacity: 1, ease: 'power2.inOut', duration: 1 }
    );
  }, []);

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-width">
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">About Technology used.</h1>
        </div>

        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24">
            <h2 className="text-5xl lg:text-7xl font-semibold">We do the heavy lifting.</h2>
            <h2 className="text-5xl lg:text-7xl font-semibold">You Create.</h2>
          </div>

          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50vh] w-full flex items-center">
              <video
                playsInline
                id="exploreVideo"
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                loop
                ref={videoRef}
              >
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>

            <div className="flex flex-col w-full relative">
              <div className="feature-video-container flex">
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img src={explore1Img} alt="titanium" className="feature-video g_grow" />
                </div>
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img src={explore2Img} alt="titanium 2" className="feature-video g_grow" />
                </div>
              </div>

              <div className="feature-text-container flex">
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                  For image caption generation, we used a custom-trained model based on a <span className="text-white">CNN (EfficientNetB0)</span> for extracting visual features, followed by a {' '}<span className="text-white">Transformer-based encoder-decoder architecture</span> for generating natural language captions. The CNN encodes the image into feature vectors, and the Transformer decodes those features into coherent captions.

For{' '} <span className="text-white">caption sentiment transformation </span>(e.g., making captions humorous, sarcastic, or pun-filled), we integrated the{' '} <span className="text-white"> Mistral-7B-Instruct model</span> via a local Ollama server. This powerful LLM (Large Language Model) receives the original caption and a style prompt, generating a creative, contextually styled version of the caption in real-time.{' '}
                  </p>
                </div>

                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    We extract audio from the video and convert it to captions using the{' '}
                    <span className="text-white">Whisper model</span>. Then, we embed the captions
                    back into the video and enhance their appearance with CSS for a visually
                    appealing display.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
