"use client"

import {useEffect, useRef, useState} from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--x", `${x}%`);
        el.style.setProperty("--y", `${y}%`);
    };

    const videos = ["/3326997-hd_1920_1080_24fps.mp4", "/4762443-hd_1920_1080_25fps.mp4", "/855574-hd_1920_1080_25fps.mp4"];
    const [current, setCurrent] = useState(0);
    const [next, setNext] = useState(1);
    const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
    const [fade, setFade] = useState(0); // 0 = show current, 1 = show next

    useEffect(() => {
        const handleEnded = () => {
            setFade(1); // start fade transition
            setTimeout(() => {
                // swap videos after fade
                setCurrent(next);
                setNext((next + 1) % videos.length);
                setFade(0);
            }, 1000); // match transition duration in CSS
        };

        const currentVideo = videoRefs[0].current;
        if (currentVideo) {
            currentVideo.addEventListener("ended", handleEnded);
        }

        return () => {
            if (currentVideo) currentVideo.removeEventListener("ended", handleEnded);
        };
    }, [current, next]);

    return (
        <section aria-labelledby="hero-title" className="relative">
            <div
                ref={ref}
                onMouseMove={handleMove}
                className="relative overflow-hidden spotlight"
            >
                {/* Background video */}
                <video
                    ref={videoRefs[0]}
                    src={videos[current]}
                    autoPlay
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        fade === 1 ? "opacity-0" : "opacity-100"
                    }`}
                />
                {/* Next video (preload for smooth fade) */}
                <video
                    ref={videoRefs[1]}
                    src={videos[next]}
                    autoPlay
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        fade === 1 ? "opacity-100" : "opacity-0"
                    }`}
                />


                {/* Soft gradient veil for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/0" />

                <div className="relative container mx-auto flex flex-col items-center text-center py-24 md:py-32">
                    <Badge variant="secondary" className="mb-6">Solstice &#39;25 Collection</Badge>
                    <h1 id="hero-title" className="font-display tracking-tight text-4xl md:text-6xl leading-tight max-w-4xl animate-enter">
                        Luxury Eyewear, Crafted to Elevate
                    </h1>
                    <p className="mt-4 text-base md:text-lg max-w-2xl animate-fade-in">
                        Premium sunglasses and optical frames with timeless silhouettes and modern materials.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" size="lg" asChild>
                            <a href="#sunglasses" aria-label="Shop sunglasses">Shop Sunglasses</a>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <a href="#eyeglasses" aria-label="Shop eyeglasses">Shop Eyeglasses</a>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <ChevronDown
                    className="w-8 h-8 text-primary animate-bounce"
                    aria-hidden="true"
                />
                <span className="sr-only">Scroll down</span>
            </div>
        </section>
    );
}