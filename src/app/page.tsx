'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import useAudio from "./hooks/useAudio";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import morsunistEmblem from "@/app/assets/morsunistEmblem.png";
import cityPanorama from "@/app/assets/cityPanorama.png";

type Phase = 'black' | 'static' | 'emblem' | 'title' | 'tagline' | 'city' | 'features' | 'final';

const PHASES: { phase: Phase; duration: number }[] = [
  { phase: 'black', duration: 1500 },
  { phase: 'static', duration: 2000 },
  { phase: 'emblem', duration: 4000 },
  { phase: 'title', duration: 3500 },
  { phase: 'tagline', duration: 3000 },
  { phase: 'city', duration: 4000 },
  { phase: 'features', duration: 6000 },
  { phase: 'final', duration: 999999 },
];

const GlitchText = ({ children, className = '' }: { children: string, className?: string }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setInterval(() => setGlitch(false), 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitch ? 'animate-glitch' : ''}>
        {children}
      </span>
      {glitch && (
        <>
          <span className="absolute top-0 left-0.5 opacity-70" style={{ color: 'hsl(var(--mrs-gray-foreground))', clipPath: 'inset(0 0 50% 0)' }}>
            {children}
          </span>
          <span className="absolute top-0 -left-0.5 opacity-70" style={{ color: 'hsl(var(--mrs-gray))', clipPath: 'inset(50% 0 0 0)' }}>
            {children}
          </span>
        </>
      )}
    </span>
  );
}

const TypewriterText = ({ text, delay = 0, speed = 50, className = '' }: { text: string; delay?: number; speed?: number; className?: string }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;

      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;

        if(i >= text.length) clearInterval(interval);
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return <span className={className}>{displayed}<span className="animate-flicker">█</span></span>;
}

const FeatureItem = ({ text, delay }: { text: string; delay: number; }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 font-sharetech text-sm md:text-base"
  >
    <span className="text-glow-cyan" style={{ color: 'hsl(var(--mrs-green))' }}>{'>'}</span>
    <span className="text-foreground">{text}</span>
  </motion.div>
);

const Home = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('black');
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const { isPlaying, toggle, start } = useAudio();

  const handleStart = () => {
    setStarted(true);
    start();
  }

  useEffect(() => {
    if(!started) return;
    if(phaseIndex >= PHASES.length) return;

    setCurrentPhase(PHASES[phaseIndex].phase);

    if(PHASES[phaseIndex].phase === 'final') return;

    const timer = setTimeout(() => {
      setPhaseIndex(i => i + 1);
    }, PHASES[phaseIndex].duration);

    return () => clearTimeout(timer);
  }, [phaseIndex, started]);

  if(!started) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background cursor-pointer" onClick={handleStart}>
        <div className="scanlines absolute inset-0 z-10" />
        <div className="vignette absolute inset-0 z-20" />
        <motion.div
          className="text-center z-30 relative"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="font-vt323 text-2xl md:text-4xl tracking-widest uppercase text-foreground">
            Click to start the broadcast
          </p>
          <p className="font-sharetech text-xs mt-4 text-muted-foreground uppercase">
            The Morsunist State // Imperial Department of Information
          </p>
        </motion.div>
      </div>
    );
  }

  const phaseGte = (p: Phase) => {
    const order: Phase[] = ['black', 'static', 'emblem', 'title', 'tagline', 'city', 'features', 'final'];

    return order.indexOf(currentPhase) >= order.indexOf(p);
  }

  const features = [
    "Character Creation",
    "Personality and Needs System",
    "Random Events",
    "Relationships",
    "Travel System",
    "Seals"
  ];
  
  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <div className="scanlines absolute inset-0 z-50" />
      <div className="vignette absolute inset-0 z-40" />
      <div className="noise-overlay absolute inset-0 z-30" />

      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-60 p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Static Noise Phase */}
      <AnimatePresence>
        {currentPhase === 'static' && (
          <motion.div
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2, 0.8, 0.1, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              animation: 'static-noise 0.1s steps(5) infinite',
            }}
          />
        )}
      </AnimatePresence>

      {/* Emblem */}
      <AnimatePresence>
        {phaseGte('emblem') && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0, scale: 3 }}
            animate={{ 
              opacity: phaseGte('city') ? 0 : 1,
              scale: phaseGte('city') ? 0.5 : 1,
            }}
            transition={{ duration: 1.5 }}
          >
            <Image 
              src={morsunistEmblem}
              alt="Morsunist Emblem"
              className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_30px_hsl(var(--mrs-gray)/0.5)]"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <AnimatePresence>
        {phaseGte('title') && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: phaseGte('city') ? 0 : 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mt-64 md:mt-72 text-center">
              <h1 className="font-vt323 text-5xl md:text-8xl tracking-[0.2em] uppercase text-mrs-gray" style={{ color: 'hsl(var(--mrs-green))' }}>
                <GlitchText>The Morsunist State</GlitchText>
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagline */}
      <AnimatePresence>
        {phaseGte('tagline') && !phaseGte('city') && (
          <motion.div
            className="absolute inset-0 flex items-end justify-center pb-32 z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-sharetech text-sm md:text-lg text-muted-foreground tracking-[0.3em] uppercase">
              <TypewriterText text="Citizen, your life belongs to the State." speed={60} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City Panorama */}
      <AnimatePresence>
        {phaseGte('city') && (
          <motion.div
            className="absolute inset-0 z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full"
            >
              <Image 
                src={cityPanorama}
                alt="Morswald Panorama"
                className="w-full h-full object-cover"
                style={{ imageRendering: 'auto' }}
                fill
              />
            </motion.div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 40%, transparent 70%, hsl(var(--background)) / 0.6 100%)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features */}
      <AnimatePresence>
        {phaseGte('features') && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-16 px-6 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-vt323 text-4xl md:text-7xl tracking-[0.2em] uppercase text-mrs-green" style={{ color: 'hsl(var(--mrs-green))' }}>
                <GlitchText>Project Morswaldia</GlitchText>
              </h2>
              <p className="font-sharetech text-xs md:text-sm text-muted-foreground mt-2 tracking-[0.2em] uppercase">
                Sim-life // Discord Bot // Idk what to put here
              </p>
            </motion.div>

            {/* Features list */}
            <div className="max-w-lg w-full space-y-2 mb-8 p-4 rounded" style={{ background: 'hsl(var(--background) / 0.85)', border: '1px solid hsl(var(--background))' }}>
              <p className="font-vt323 text-xs tracking-widest uppercase mb-3 text-mrs-gray" style={{ color: 'hsl(var(--mrs-gray-foreground))' }}>
                {'// SYSTEM FUNCTIONS'}
              </p>
              {features.map((f, i) => (
                <FeatureItem key={f} text={f} delay={0.5 + i * 0.3} />
              ))}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            >
              <p className="font-sharetech text-xs text-muted-foreground animate-flicker tracking-widest">
                COMING SOON
              </p>
              <p className="font-sharetech text-[10px] text-muted-foreground mt-2 opacity-50 uppercase">
                Imperial Department of Propaganda of the Morsunist State - All rights reserved
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;