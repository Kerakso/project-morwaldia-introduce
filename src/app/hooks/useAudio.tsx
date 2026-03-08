import { useCallback, useRef, useState } from "react";

const useAudio = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<OscillatorNode[]>([]);
    const gainRef = useRef<GainNode | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const start = useCallback(() => {
        if(audioCtxRef.current) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0;
        masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3);
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;

        // Deep Drone
        const drone = ctx.createOscillator();
        drone.type = 'sawtooth';
        drone.frequency.value = 55;
        
        const droneGain = ctx.createGain();
        droneGain.gain.value = 0.3;

        const droneFilter = ctx.createBiquadFilter();
        droneFilter.type = 'lowpass';
        droneFilter.frequency.value = 200;

        drone.connect(droneFilter).connect(droneGain).connect(masterGain);
        drone.start();

        // Eerie Pad
        const pad = ctx.createOscillator();
        pad.type = 'sine';
        pad.frequency.value = 110;
        pad.frequency.setValueAtTime(110, ctx.currentTime);
        pad.frequency.linearRampToValueAtTime(116, ctx.currentTime + 8);
        pad.frequency.linearRampToValueAtTime(110, ctx.currentTime + 16);

        const padGain = ctx.createGain();
        padGain.gain.value = 0.15;

        pad.connect(padGain).connect(masterGain);
        pad.start();

        // Dissonant High Tone
        const high = ctx.createOscillator();
        high.type = 'sine';
        high.frequency.value = 330;

        const highGain = ctx.createGain();
        highGain.gain.value = 0.04;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.3;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.03;

        lfo.connect(lfoGain).connect(highGain.gain);
        lfo.start();

        high.connect(highGain).connect(masterGain);
        high.start();

        // Sub Bass Rumble
        const sub = ctx.createOscillator();
        sub.type = 'sine';
        sub.frequency.value = 30;

        const subGain = ctx.createGain();
        subGain.gain.value = 0.2;

        sub.connect(subGain).connect(masterGain);
        sub.start();

        nodesRef.current = [drone, pad, high, sub, lfo];
        setIsPlaying(true);
    }, []);

    const stop = useCallback(() => {
        const ctx = audioCtxRef.current;
        if(!ctx || !gainRef.current) return;

        gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
            nodesRef.current.forEach(n => { try { n.stop(); } catch {} });
            ctx.close();

            audioCtxRef.current = null;
            nodesRef.current = [];
            gainRef.current = null;

            setIsPlaying(false);
        }, 1200);
    }, []);

    const toggle = useCallback(() => {
        if(isPlaying) stop();
        else start();
    }, [isPlaying, start, stop]);

    return { start, isPlaying, toggle };
}

export default useAudio;