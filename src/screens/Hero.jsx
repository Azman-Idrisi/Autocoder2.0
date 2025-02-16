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
  const [isLoading, setIsLoading] = useState(true);
  const [LoadedVideos, setLoadedVideos] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const totalVideos = scenes.length; // Total videos count
  const nextVideoRef = useRef(null);
  const audioRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume
      audioRef.current.muted = true; // Start muted
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction.");
      });
    }
  }, []);

  useEffect(() => {
    if (LoadedVideos === totalVideos - 1) {
      setIsLoading(false);
    }
  }, [LoadedVideos]);

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
          onStart: () => nextVideoRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

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

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

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

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="audio/music.mp3" type="audio/mp3" />
      </audio>

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

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

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

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          <b>STORYTELLING</b>
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-12 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              r<b>edef</b>i<b>ne</b>
            </h1>

            {/* Display the title and description of the currently playing video */}
            <div
              ref={textRef}
              className="absolute lg:left-5 lg:top-40 top-[6.5rem] left-3 right-3 z-50 bg-white/20 p-5 rounded-lg backdrop-blur-md max-w-md"
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
