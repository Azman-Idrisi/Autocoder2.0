import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { scenes } from "../constants/index";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const totalVideos = scenes.length;
  const nextVideoRef = useRef(null);
  const audioRef = useRef(null);
  const narrationAudioRef = useRef(null);
  const textRef = useRef(null);

  // Ensure background audio plays on load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.muted = true; // Start muted
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
      });
    }
  }, []);

  // Fade-in animation for text
  useGSAP(
    () => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        }
      );
    },
    { dependencies: [currentIndex] }
  );

  // Video click animation
  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current?.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  // Video mask animation
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  // Handle video loading
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  // Get next video index
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  // Handle mini video click
  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

  // Toggle background music
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.muted = false;
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Play narration audio on scene change
  useEffect(() => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.src = getAudioSrc(currentIndex);
      narrationAudioRef.current.play().catch(() => {
        console.log(
          "Narration autoplay blocked, waiting for user interaction."
        );
      });
    }
  }, [currentIndex]);

  // Get video and audio sources
  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
  const getAudioSrc = (index) => `script/${index}.mp3`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
    {/* Marquee Text for Mobile */}
    <div className="absolute top-0 text-center w-full bg-transparent text-white py-2 overflow-hidden z-50 block md:hidden">
      <div className="whitespace-nowrap select-none text-sm animate-marquee font-bold">
        To go to the next part, take the cursor to the center and click. This website is best displayed on laptops.
      </div>
    </div>
  
    {/* Fixed Text for Laptops */}
    <div className="hidden md:flex select-none md:fixed md:top-0 md:left-1/2 md:-translate-x-1/2 md:bg-transparent md:text-white md:py-2 md:z-50 md:text-sm md:font-bold">
      To go to the next part, take the cursor to the center and click. This website is best displayed on laptops.
    </div>

      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="audio/music.mp3" type="audio/mp3" />
      </audio>

      <audio ref={narrationAudioRef} />

      {/* Toggle Audio Button */}
      <Button
        className="absolute top-5 right-5 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={toggleAudio}
      >
        {isMusicPlaying ? "Pause Music" : "Play Music"}
      </Button>

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          {/* Mini Video Preview */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          {/* Next Video */}
          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          {/* Main Video */}
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* Title & Description */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          <b>STORYTELLING</b>
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-12 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              r<b>edef</b>i<b>ne</b>
            </h1>

            {/* Scene Title & Description */}
            <div
              ref={textRef}
              className="absolute lg:left-5 lg:top-40 top-[6.5rem] left-3 right-3 z-50 bg-white/20 p-5 rounded-lg backdrop-blur-md max-w-md hidden lg:block"
            >
              <h2 className="text-white text-2xl font-bold">
                {scenes[currentIndex - 1]?.title || "Unknown Scene"}
              </h2>
              <p className="text-white text-sm mt-2">
                {scenes[currentIndex - 1]?.description ||
                  "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
