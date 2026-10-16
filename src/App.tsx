/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  BookmarkCheck,
  Search,
  CheckCircle2,
  Printer,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Send,
  ExternalLink,
  BookOpen,
  Mail,
  ArrowRight,
  RotateCcw,
  Menu,
  X,
  Play,
  Pause
} from 'lucide-react';
import { HarvestAmbience } from './components/HarvestAmbience';

interface ProgramItem {
  id: number;
  timeEstimate: string;
  title: string;
  assigned: string;
  category: 'gathering' | 'worship' | 'word' | 'giving' | 'closing';
  categoryLabel: string;
  description?: string;
}

const PROGRAM_ITEMS: ProgramItem[] = [
  {
    id: 1,
    timeEstimate: '09:00 AM',
    title: 'Opening Prayer',
    assigned: 'Sonier Perlas',
    category: 'gathering',
    categoryLabel: 'Gathering & Invocation',
    description: 'Invoking the Holy Spirit and setting our hearts in reverence and gratitude.'
  },
  {
    id: 2,
    timeEstimate: '09:12 AM',
    title: 'Parade of Blessings',
    assigned: 'Per Family',
    category: 'gathering',
    categoryLabel: 'Processional of Thanksgiving',
    description: 'Each family marches forward presenting thanksgiving symbols and offerings of gratitude.'
  },
  {
    id: 3,
    timeEstimate: '09:30 AM',
    title: 'Opening Remarks',
    assigned: 'Ptr. Elias Tumando',
    category: 'gathering',
    categoryLabel: 'Pastoral Greetings',
    description: 'Welcoming the congregation and setting the spiritual tone for our Thanksgiving celebration.'
  },
  {
    id: 4,
    timeEstimate: '09:38 AM',
    title: 'Welcome Address',
    assigned: 'Charme Barrios',
    category: 'gathering',
    categoryLabel: 'Church Fellowship',
    description: 'Extending warm Christian hospitality to church members, visiting families, and honoured guests.'
  },
  {
    id: 5,
    timeEstimate: '09:45 AM',
    title: 'Testimonies',
    assigned: 'Dulce, Jingjing, Denden Barrios',
    category: 'worship',
    categoryLabel: 'Witness & Praise',
    description: 'Sharing real-life accounts of God’s deliverance, healing, and unshakeable faithfulness through every trial.'
  },
  {
    id: 6,
    timeEstimate: '10:05 AM',
    title: 'Birthday Offering',
    assigned: 'Tata Villanueva',
    category: 'giving',
    categoryLabel: 'Celebration of Life',
    description: 'Special thanksgiving praise offering honoring God for the gift of life and milestones.'
  },
  {
    id: 7,
    timeEstimate: '10:15 AM',
    title: 'Praise and Worship',
    assigned: 'Honey, Ian, Mildred, Ritchel, Michael',
    category: 'worship',
    categoryLabel: 'Adoration & Exaltation',
    description: 'Lifting joyful voices in songs of adoration, celebration, and thanksgiving to our faithful Lord.'
  },
  {
    id: 8,
    timeEstimate: '10:45 AM',
    title: 'Introduction of Speaker',
    assigned: 'AVP (Audio-Visual Presentation)',
    category: 'word',
    categoryLabel: 'Ministry of the Word',
    description: 'Presenting the life, calling, and ministry of our esteemed Resource Speaker.'
  },
  {
    id: 9,
    timeEstimate: '10:50 AM',
    title: 'Special Number',
    assigned: 'CMS Students',
    category: 'worship',
    categoryLabel: 'Choral / Musical Offering',
    description: 'A special musical performance of thanksgiving rendered by our church children & youth.'
  },
  {
    id: 10,
    timeEstimate: '11:00 AM',
    title: 'Keynote Message',
    assigned: 'Ptr. Kimuel Tito',
    category: 'word',
    categoryLabel: 'Resource Speaker',
    description: 'Exposition of the theme “Faithful in Every Season” anchored on Lamentations 3:22–23.'
  },
  {
    id: 11,
    timeEstimate: '11:45 AM',
    title: 'Giving of Plaque and Token',
    assigned: 'Emcee',
    category: 'word',
    categoryLabel: 'Recognition',
    description: 'Conferment of plaque of gratitude and love gift to our guest speaker.'
  },
  {
    id: 12,
    timeEstimate: '11:55 AM',
    title: 'Thanksgiving Offering',
    assigned: 'MEME DE ASIS (FY – offering basket)',
    category: 'giving',
    categoryLabel: 'Tithe & Harvest Offering',
    description: 'Giving cheerfully from our harvest and resources for the work of the Kingdom and church ministry.'
  },
  {
    id: 13,
    timeEstimate: '12:10 PM',
    title: 'Announcements',
    assigned: 'Emcee',
    category: 'closing',
    categoryLabel: 'Church Family Updates',
    description: 'Important announcements on fellowship lunch, upcoming church ministries, and community services.'
  },
  {
    id: 14,
    timeEstimate: '12:18 PM',
    title: 'Closing Remarks',
    assigned: 'Ptr. Elias',
    category: 'closing',
    categoryLabel: 'Benediction',
    description: 'Concluding pastoral exhortation and sending off in the joy and peace of the Lord.'
  },
  {
    id: 15,
    timeEstimate: '12:25 PM',
    title: 'Closing Prayer',
    assigned: 'Bro. Sasag',
    category: 'closing',
    categoryLabel: 'Final Blessing',
    description: 'Dedicating our families and the fellowship lunch into the hands of our Almighty God.'
  },
  {
    id: 16,
    timeEstimate: '12:30 PM',
    title: 'Master of Ceremonies',
    assigned: 'Rubelyn Estigoy',
    category: 'closing',
    categoryLabel: 'Presider & Coordination',
    description: 'Guiding the congregation seamlessly through each sacred part of our Thanksgiving service.'
  }
];

interface GratitudeNote {
  id: string;
  name: string;
  message: string;
  date: string;
}

import { db } from './firebase';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';

const INITIAL_TESTIMONIES: GratitudeNote[] = [
  {
    id: '1',
    name: 'Barrios Family',
    message: 'Through the stormy months and high mountains, God proved that His compassion never fails. All glory to Jesus!',
    date: 'October 2026'
  },
  {
    id: '2',
    name: 'Mildred & Family',
    message: 'New mercies every single morning! We are grateful for health, provision, and the warm love of our church fellowship.',
    date: 'October 2026'
  },
  {
    id: '3',
    name: 'CMS Students & Faculty',
    message: 'Thankful for godly teachers, mentors, and the joyful opportunity to serve the Lord in our youth.',
    date: 'October 2026'
  }
];

const INITIAL_RSVPS = [
  { name: 'Barrios Family', headcount: 5, phone: '09123456789', prayer: 'Thankful for God\'s grace and healing.', timestamp: '2026-10-15T10:00:00Z' },
  { name: 'Tito Family', headcount: 4, phone: '09198765432', prayer: 'Abundant blessings for the church ministry.', timestamp: '2026-10-15T11:30:00Z' },
  { name: 'De Asis Family', headcount: 3, phone: '09171112233', prayer: 'Provision and guidance.', timestamp: '2026-10-16T08:15:00Z' },
  { name: 'Estigoy Family', headcount: 2, phone: '09184445566', prayer: 'Joyful celebration.', timestamp: '2026-10-16T09:45:00Z' },
  { name: 'Perlas Family', headcount: 4, phone: '09223334455', prayer: 'Faithful in every season.', timestamp: '2026-10-16T14:20:00Z' }
];


// Crisp realistic wax breaking sound
function playWaxCrackSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // Crisp crackle/snap impulses
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.Q.setValueAtTime(4.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime);
  } catch {
    // Ignore audio permission errors
  }
}

// 24 realistic wax crumble particles & golden leaf specks
const WAX_PARTICLES = [
  { id: 1, tx: -65, ty: -75, rot: -140, size: 10, color: '#96161C', shape: 'polygon(30% 0%, 90% 20%, 100% 80%, 20% 100%)', delay: 0 },
  { id: 2, tx: 70, ty: -60, rot: 120, size: 12, color: '#B81D24', shape: 'polygon(10% 20%, 80% 0%, 100% 90%, 0% 80%)', delay: 10 },
  { id: 3, tx: -90, ty: -10, rot: -90, size: 9, color: '#730E13', shape: 'polygon(0% 0%, 100% 30%, 70% 100%, 10% 70%)', delay: 20 },
  { id: 4, tx: 95, ty: -20, rot: 160, size: 11, color: '#A8181F', shape: 'polygon(20% 0%, 100% 10%, 90% 100%, 0% 90%)', delay: 15 },
  { id: 5, tx: -75, ty: 60, rot: -180, size: 13, color: '#B81D24', shape: 'polygon(15% 10%, 100% 0%, 85% 90%, 0% 100%)', delay: 30 },
  { id: 6, tx: 60, ty: 75, rot: 210, size: 10, color: '#851015', shape: 'polygon(0% 25%, 85% 0%, 100% 75%, 25% 100%)', delay: 25 },
  { id: 7, tx: -30, ty: -95, rot: -60, size: 8, color: '#B81D24', shape: 'circle(50%)', delay: 5 },
  { id: 8, tx: 35, ty: -100, rot: 75, size: 9, color: '#96161C', shape: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', delay: 10 },
  { id: 9, tx: -110, ty: 25, rot: -130, size: 7, color: '#F59E0B', shape: 'polygon(25% 0%, 100% 50%, 50% 100%, 0% 25%)', delay: 15 },
  { id: 10, tx: 115, ty: 35, rot: 145, size: 8, color: '#FDE68A', shape: 'circle(50%)', delay: 20 },
  { id: 11, tx: -45, ty: 105, rot: -220, size: 9, color: '#730E13', shape: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 80%)', delay: 35 },
  { id: 12, tx: 40, ty: 110, rot: 240, size: 11, color: '#B81D24', shape: 'polygon(0% 0%, 90% 10%, 100% 100%, 10% 90%)', delay: 30 },
  { id: 13, tx: -15, ty: -115, rot: -45, size: 6, color: '#FCD34D', shape: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', delay: 10 },
  { id: 14, tx: 15, ty: -120, rot: 50, size: 7, color: '#B81D24', shape: 'circle(50%)', delay: 15 },
  { id: 15, tx: -120, ty: -45, rot: -160, size: 8, color: '#96161C', shape: 'polygon(10% 0%, 100% 40%, 80% 100%, 0% 60%)', delay: 20 },
  { id: 16, tx: 125, ty: -40, rot: 190, size: 8, color: '#B81D24', shape: 'polygon(30% 0%, 100% 30%, 70% 100%, 0% 70%)', delay: 25 },
  { id: 17, tx: -85, ty: -85, rot: -95, size: 6, color: '#F59E0B', shape: 'circle(50%)', delay: 10 },
  { id: 18, tx: 90, ty: -90, rot: 110, size: 7, color: '#FDE68A', shape: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', delay: 15 },
  { id: 19, tx: -95, ty: 95, rot: -230, size: 8, color: '#851015', shape: 'polygon(20% 0%, 100% 20%, 80% 100%, 0% 80%)', delay: 40 },
  { id: 20, tx: 100, ty: 90, rot: 250, size: 7, color: '#96161C', shape: 'circle(50%)', delay: 35 },
  { id: 21, tx: 0, ty: -130, rot: 30, size: 5, color: '#FCD34D', shape: 'circle(50%)', delay: 5 },
  { id: 22, tx: 0, ty: 125, rot: 210, size: 8, color: '#730E13', shape: 'polygon(0% 10%, 100% 0%, 90% 90%, 10% 100%)', delay: 40 },
  { id: 23, tx: -130, ty: 0, rot: -110, size: 6, color: '#B81D24', shape: 'circle(50%)', delay: 25 },
  { id: 24, tx: 135, ty: 5, rot: 130, size: 6, color: '#B81D24', shape: 'circle(50%)', delay: 20 }
];

// Gentle church chime chord using Web Audio API
function playChimeSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 1.9);
    });
  } catch {
    // Ignore audio permission errors
  }
}

// Ambient Hymn Soundscape Generator using Web Audio API
class AmbientHymnPlayer {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private isPlaying = false;
  private chordIndex = 0;
  private chords = [
    [261.63, 329.63, 392.00, 523.25], // C major
    [220.00, 261.63, 329.63, 392.00], // A minor
    [174.61, 220.00, 261.63, 329.63], // F major
    [196.00, 246.94, 293.66, 392.00]  // G major
  ];

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlaying = true;
      this.playNextChord();
      this.timerId = window.setInterval(() => {
        this.playNextChord();
      }, 5500);
    } catch {
      // Audio context error
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }

  private playNextChord() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    chord.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + 5.3);
    });
  }
}

const hymnPlayer = new AmbientHymnPlayer();

function ScrollRevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

function InteractiveTiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = React.useState('');
  const [glareStyle, setGlareStyle] = React.useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = -((mouseY / height) * 16 - 8);
    const rY = (mouseX / width) * 16 - 8;

    setTransformStyle(`perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    setGlareStyle({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.12
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle(prev => ({ ...prev, opacity: 0 }));
  };

  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!cardRef.current) return;
      const beta = e.beta; // front/back tilt (-180 to 180)
      const gamma = e.gamma; // left/right tilt (-90 to 90)

      if (beta !== null && gamma !== null) {
        const rX = Math.max(-8, Math.min(8, beta / 5));
        const rY = Math.max(-8, Math.min(8, gamma / 5));
        setTransformStyle(`perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) scale3d(1, 1, 1)`);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-150 ease-out will-change-transform relative overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255,255,255,0.7) 0%, transparent 75%)`,
          opacity: glareStyle.opacity
        }}
      />
    </div>
  );
}

function LiveCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false });

  React.useEffect(() => {
    const targetDate = new Date('2026-10-31T09:00:00');

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isStarted: false });
      }
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (timeLeft.isStarted) {
    return (
      <div className="my-6 p-4 bg-[#F4E8E8] border border-[#B81D24]/30 text-[#B81D24] text-center rounded-none shadow-sm animate-pulse">
        <span className="meta-mono uppercase text-xs tracking-widest block font-semibold mb-1">Live Status</span>
        <span className="font-cormorant text-2xl sm:text-3xl font-semibold">Celebration has begun!</span>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 sm:p-5 bg-stone-50 border border-[rgba(184,29,36,0.2)] rounded-none">
      <div className="flex items-center justify-between mb-3">
        <span className="meta-mono text-[0.65rem] uppercase tracking-wider text-[#B81D24] font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B81D24] animate-ping inline-block"></span>
          Countdown to Celebration
        </span>
        <span className="meta-mono text-[0.6rem] text-stone-500">October 31, 2026 • 9:00 AM</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white p-2.5 border border-stone-200">
          <div className="font-cormorant text-xl sm:text-3xl font-bold text-[#2D0A0A]">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="meta-mono text-[0.55rem] uppercase tracking-wider text-stone-500 mt-0.5">Days</div>
        </div>
        <div className="bg-white p-2.5 border border-stone-200">
          <div className="font-cormorant text-xl sm:text-3xl font-bold text-[#2D0A0A]">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="meta-mono text-[0.55rem] uppercase tracking-wider text-stone-500 mt-0.5">Hours</div>
        </div>
        <div className="bg-white p-2.5 border border-stone-200">
          <div className="font-cormorant text-xl sm:text-3xl font-bold text-[#2D0A0A]">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="meta-mono text-[0.55rem] uppercase tracking-wider text-stone-500 mt-0.5">Mins</div>
        </div>
        <div className="bg-white p-2.5 border border-stone-200">
          <div className="font-cormorant text-xl sm:text-3xl font-bold text-[#2D0A0A]">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="meta-mono text-[0.55rem] uppercase tracking-wider text-stone-500 mt-0.5">Secs</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Envelope Stage: 'closed' | 'opening' | 'unfolded' | 'unveiled'
  const [envelopeStage, setEnvelopeStage] = useState<'closed' | 'opening' | 'unfolded' | 'unveiled'>('closed');
  const [waxBreaking, setWaxBreaking] = useState(false);
  const [envelopeExiting, setEnvelopeExiting] = useState(false);

  // Mobile Navigation Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subtle Harvest / Autumn Ambience State
  const [ambienceEnabled, setAmbienceEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('harvest_ambience_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleAmbience = () => {
    setAmbienceEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('harvest_ambience_enabled', String(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  React.useEffect(() => {
    if (envelopeStage === 'unveiled' && ambienceEnabled) {
      hymnPlayer.start();
    } else {
      hymnPlayer.stop();
    }
    return () => {
      hymnPlayer.stop();
    };
  }, [ambienceEnabled, envelopeStage]);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [shared, setShared] = useState(false);

  // Admin / Usher Attendance Tally Modal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [, setRsvpsRefreshKey] = useState(0);

  React.useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin' || window.location.search.includes('admin=true');
      setIsAdminOpen(isHashAdmin);
      if (isHashAdmin) {
        setRsvpsRefreshKey(k => k + 1);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleExportCsv = () => {
    const headers = ['Family Name', 'Headcount', 'Contact Number', 'Prayer / Notes', 'Timestamp'];
    const rows = rsvps.map((r: { name?: string; headcount?: number; phone?: string; prayer?: string; timestamp?: string }) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.headcount || 1,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.prayer || '').replace(/"/g, '""')}"`,
      `"${r.timestamp || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Lahi-Thanksgiving-Attendance-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [rsvps, setRsvps] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('thanksgiving_rsvps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_RSVPS;
  });

  const [notes, setNotes] = useState<GratitudeNote[]>(() => {
    try {
      const saved = localStorage.getItem('thanksgiving_notes_2026');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIES;
    } catch {
      return INITIAL_TESTIMONIES;
    }
  });

  // Real-time Firestore Sync
  React.useEffect(() => {
    try {
      const qRsvps = query(collection(db, 'rsvps'));
      const unsubRsvps = onSnapshot(qRsvps, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(doc => doc.data());
          setRsvps(loaded);
          try {
            localStorage.setItem('thanksgiving_rsvps', JSON.stringify(loaded));
          } catch {}
        }
      }, (err) => {
        console.error('Firestore rsvps sync error:', err);
      });

      const qTestimonies = query(collection(db, 'testimonies'));
      const unsubTestimonies = onSnapshot(qTestimonies, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GratitudeNote));
          setNotes(loaded);
          try {
            localStorage.setItem('thanksgiving_notes_2026', JSON.stringify(loaded));
          } catch {}
        }
      }, (err) => {
        console.error('Firestore testimonies sync error:', err);
      });

      return () => {
        unsubRsvps();
        unsubTestimonies();
      };
    } catch {
      // Offline fallback
    }
  }, []);

  // RSVP Form State
  const [rsvpFamilyName, setRsvpFamilyName] = useState('');
  const [rsvpHeadcount, setRsvpHeadcount] = useState(1);
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpPrayer, setRsvpPrayer] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Gratitude Wall Input
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteMessage, setNewNoteMessage] = useState('');

  // Audio / Speech State
  const [isPlayingScripture, setIsPlayingScripture] = useState(false);

  // Envelope Actions: Realistic wax crumbling, ribbon unrolling, and direct navigation
  const handleOpenEnvelope = () => {
    if (envelopeStage !== 'closed' || waxBreaking) return;
    
    // 1. Play realistic wax snapping crack sound and trigger shattering particles
    playWaxCrackSound();
    setWaxBreaking(true);

    // 2. Play golden chime and unroll silk ribbon as top flap rotates open
    setTimeout(() => {
      playChimeSound();
      setEnvelopeStage('opening');

      // 3. Unfold letter upward
      setTimeout(() => {
        setEnvelopeStage('unfolded');

        // 4. Directly navigate to full invitation without requiring extra button clicks
        setTimeout(() => {
          setEnvelopeExiting(true);
          setTimeout(() => {
            setEnvelopeStage('unveiled');
            setEnvelopeExiting(false);
          }, 600);
        }, 1700);
      }, 750);
    }, 450);
  };

  const handleEnterInvitation = () => {
    setEnvelopeExiting(true);
    setTimeout(() => {
      setEnvelopeStage('unveiled');
      setEnvelopeExiting(false);
    }, 600);
  };

  const handleSkipEnvelope = () => {
    setEnvelopeStage('unveiled');
  };

  const handleReplayEnvelope = () => {
    setWaxBreaking(false);
    setEnvelopeStage('closed');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter program items
  const filteredProgram = useMemo(() => {
    return PROGRAM_ITEMS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assigned.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('Lahi Foursquare Gospel Church');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Thanksgiving Celebration 2026 | Lahi Foursquare Gospel Church',
      text: 'You are cordially invited to our Thanksgiving Day Celebration: FAITHFUL IN EVERY SEASON. October 31, 2026 at 9:00 AM. Guest Speaker: Ptr. Kimuel Tito.',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpFamilyName.trim()) return;

    const newRsvp = {
      name: rsvpFamilyName,
      headcount: rsvpHeadcount,
      phone: rsvpPhone,
      prayer: rsvpPrayer,
      timestamp: new Date().toISOString()
    };

    const updatedRsvps = [newRsvp, ...rsvps];
    setRsvps(updatedRsvps);
    try {
      localStorage.setItem('thanksgiving_rsvps', JSON.stringify(updatedRsvps));
    } catch {}

    try {
      await addDoc(collection(db, 'rsvps'), newRsvp);
    } catch (err) {
      console.error('Error saving RSVP to Firestore:', err);
    }

    setRsvpSuccess(true);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteName.trim() || !newNoteMessage.trim()) return;

    const note: GratitudeNote = {
      id: Date.now().toString(),
      name: newNoteName.trim(),
      message: newNoteMessage.trim(),
      date: 'October 2026'
    };

    const updated = [note, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem('thanksgiving_notes_2026', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    try {
      await addDoc(collection(db, 'testimonies'), {
        name: note.name,
        message: note.message,
        date: note.date,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving testimony to Firestore:', err);
    }

    setNewNoteName('');
    setNewNoteMessage('');
  };

  const handleSpeechToggle = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingScripture) {
        window.speechSynthesis.cancel();
        setIsPlayingScripture(false);
      } else {
        const text =
          'Theme: Faithful in every season. Lamentations chapter 3 verses 22 to 23. It is the Lord’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingScripture(false);
        utterance.onerror = () => setIsPlayingScripture(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingScripture(true);
      }
    }
  };

  const googleCalendarUrl = () => {
    const title = encodeURIComponent('Thanksgiving Celebration: Faithful in Every Season');
    const details = encodeURIComponent(
      'Lahi Foursquare Gospel Church Thanksgiving Day Celebration.\nTheme: FAITHFUL IN EVERY SEASON (Lamentations 3:22–23)\nResource Speaker: Ptr. Kimuel Tito\nMaster of Ceremonies: Rubelyn Estigoy\n\nFull program includes Parade of Blessings, Testimonies, Praise & Worship, and Thanksgiving Offering.'
    );
    const location = encodeURIComponent('Lahi Foursquare Gospel Church');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261031T010000Z/20261031T050000Z&details=${details}&location=${location}`;
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lahi Foursquare Gospel Church//Thanksgiving 2026//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Thanksgiving Celebration: Faithful in Every Season',
      'DESCRIPTION:Lahi Foursquare Gospel Church Thanksgiving Celebration. Theme: Faithful in Every Season (Lamentations 3:22-23). Speaker: Ptr. Kimuel Tito.',
      'LOCATION:Lahi Foursquare Gospel Church',
      'DTSTART:20261031T090000',
      'DTEND:20261031T130000',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Thanksgiving-Lahi-Foursquare-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFA] text-[#2D0A0A] font-sans antialiased selection:bg-[#B81D24] selection:text-white relative overflow-x-hidden">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          header, #envelope-modal, #rsvp, #gratitude-wall, #interactive-tools, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* SUBTLE HARVEST / AUTUMN AMBIENCE DRIFT */}
      <HarvestAmbience active={ambienceEnabled} />

      {/* ENVELOPE OPENING OVERLAY SCREEN (Fully Responsive & Scrollable) */}
      {envelopeStage !== 'unveiled' && (
        <div
          id="envelope-modal"
          className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#2D0A0A]/95 backdrop-blur-md transition-opacity duration-600 flex flex-col items-center justify-center py-12 px-4 sm:px-6 ${
            envelopeExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* 3D Envelope Container */}
          <div className="w-full max-w-[540px] flex flex-col items-center my-auto">
            <div className="text-center mb-6">
              <h2 className="font-cormorant text-3xl sm:text-4xl text-white font-normal px-2 tracking-wide">
                {envelopeStage === 'closed'
                  ? 'You are invited'
                  : 'Opening...'}
              </h2>
            </div>

            {/* THE ENVELOPE STRUCTURE */}
            <div className="w-full relative perspective-envelope select-none">
              <div
                className={`w-full h-[270px] sm:h-[350px] relative bg-[#F7F3EE] border-2 border-[rgba(184,29,36,0.35)] shadow-2xl transition-transform duration-700 ${
                  envelopeStage === 'unfolded' ? 'translate-y-8 sm:translate-y-14' : ''
                }`}
              >
                {/* Vintage Envelope Lining Pattern */}
                <div className="absolute inset-0 bg-[#8B1419] overflow-hidden opacity-95">
                  <div className="w-full h-full opacity-15 bg-[radial-gradient(#F5EFEB_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="font-cormorant text-7xl sm:text-8xl text-amber-100 font-bold">LFGC</span>
                  </div>
                </div>

                {/* THE INNER INVITATION CARD (Slides Out When Unsealed) */}
                <div
                  className={`absolute inset-x-3 sm:inset-x-6 top-3 sm:top-4 bottom-3 sm:bottom-4 bg-[#FDFBFA] border-2 border-[#B81D24]/40 shadow-xl p-4 sm:p-7 flex flex-col justify-between text-center transition-all duration-800 ${
                    envelopeStage === 'unfolded'
                      ? '-translate-y-[150px] sm:-translate-y-[225px] scale-[1.01] sm:scale-105 z-30 shadow-2xl ring-4 ring-amber-300/30'
                      : 'translate-y-0 z-10'
                  }`}
                >
                  <div className="border-b border-[rgba(184,29,36,0.2)] pb-2 sm:pb-3">
                    <span className="meta-mono text-[#B81D24] text-[0.55rem] sm:text-[0.6rem] block mb-0.5">
                      Lahi Foursquare Gospel Church
                    </span>
                    <h3 className="font-cormorant text-xl sm:text-3xl font-bold text-[#2D0A0A] tracking-tight leading-tight">
                      Faithful in Every Season
                    </h3>
                  </div>

                  <div className="py-1 sm:py-2">
                    <p className="font-cormorant italic text-xs sm:text-base text-[#2D0A0A]/90 leading-snug sm:leading-relaxed">
                      “It is the Lord’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.”
                    </p>
                    <span className="meta-mono text-[#B81D24] text-[0.55rem] sm:text-[0.6rem] mt-1 block">
                      Lamentations 3:22–23
                    </span>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-[rgba(184,29,36,0.2)] flex flex-col items-center gap-1 text-xs">
                    <div className="meta-mono text-[#2D0A0A]/70 text-[0.6rem] sm:text-[0.65rem]">
                      Saturday, October 31, 2026 • 9:00 AM
                    </div>
                    <div className="text-[0.65rem] sm:text-[0.7rem] text-[#2D0A0A]/80 font-medium">
                      Speaker: <strong>Ptr. Kimuel Tito</strong> · Emcee: <strong>Rubelyn Estigoy</strong>
                    </div>

                  </div>
                </div>

                {/* Envelope Left & Right Inner Fold Flaps */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                    background: '#F0EAE1',
                    borderRight: '1px solid rgba(184,29,36,0.2)'
                  }}
                ></div>
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                    background: '#EAE3D8',
                    borderLeft: '1px solid rgba(184,29,36,0.2)'
                  }}
                ></div>

                {/* Envelope Bottom Triangle Pocket Flap */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
                    background: '#F7F3EE',
                    boxShadow: '0 -4px 15px rgba(0,0,0,0.06)'
                  }}
                ></div>

                {/* Postmark and Address (Visible on Closed Envelope Face) */}


                {/* TOP ROTATING FLAP (3D rotateX) */}
                <div
                  className={`absolute top-0 inset-x-0 h-1/2 origin-top transition-transform duration-800 preserve-3d ${
                    envelopeStage === 'closed'
                      ? 'z-30'
                      : 'z-10'
                  }`}
                  style={{
                    transform:
                      envelopeStage === 'closed'
                        ? 'rotateX(0deg)'
                        : 'rotateX(180deg)',
                    transformOrigin: 'top center',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div
                    className="w-full h-full relative"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      background: 'linear-gradient(180deg, #F9F6F0 0%, #EFE9DF 100%)',
                      borderBottom: '1px solid rgba(184,29,36,0.25)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="absolute top-2 inset-x-0 text-center">
                      <span className="meta-mono text-[#B81D24]/60 text-[0.5rem] sm:text-[0.55rem]">
                        Lahi Foursquare Gospel Church
                      </span>
                    </div>
                  </div>
                </div>

                {/* REALISTIC WAX SEAL CRUMBLING PARTICLES */}
                {waxBreaking && (
                  <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                    {WAX_PARTICLES.map((p) => (
                      <span
                        key={p.id}
                        className="wax-particle absolute pointer-events-none"
                        style={{
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          backgroundColor: p.color,
                          clipPath: p.shape,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                          ['--tx' as string]: `${p.tx}px`,
                          ['--ty' as string]: `${p.ty}px`,
                          ['--rot' as string]: `${p.rot}deg`,
                          animationDelay: `${p.delay}ms`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* THE WAX SEAL BUTTON (Dead-centered using inset-0 m-auto) */}
                {(envelopeStage === 'closed' || waxBreaking) && (
                  <button
                    type="button"
                    onClick={handleOpenEnvelope}
                    disabled={waxBreaking}
                    className={`absolute inset-0 m-auto z-40 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#B81D24] border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center p-0 cursor-pointer focus:outline-none select-none appearance-none group overflow-hidden ${
                      waxBreaking ? 'seal-shattering' : 'wax-seal-pulse'
                    }`}
                    style={{
                      backgroundColor: '#B81D24',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      margin: 'auto'
                    }}
                    title="Click to unseal and open invitation"
                    aria-label="Open invitation wax seal"
                  >
                    {/* Inner decorative embossed gold ring */}
                    <div className="absolute inset-1.5 rounded-full border border-amber-300/40 pointer-events-none"></div>

                    {/* Realistic crack lines appearing upon shattering */}
                    {waxBreaking && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100">
                        <path d="M50 0 L48 25 L55 45 L46 65 L52 85 L50 100" stroke="#FDE68A" strokeWidth="2.5" fill="none" opacity="0.95" />
                        <path d="M48 25 L25 35 L10 30" stroke="#FDE68A" strokeWidth="2" fill="none" opacity="0.85" />
                        <path d="M55 45 L78 40 L95 48" stroke="#FDE68A" strokeWidth="2" fill="none" opacity="0.85" />
                        <path d="M46 65 L28 75 L12 85" stroke="#FDE68A" strokeWidth="2" fill="none" opacity="0.85" />
                        <path d="M52 85 L75 88 L90 95" stroke="#FDE68A" strokeWidth="2" fill="none" opacity="0.85" />
                      </svg>
                    )}

                    {/* Perfectly centered text */}
                    <span className="font-cormorant font-bold text-sm sm:text-base text-amber-200 tracking-wider block text-center leading-none">
                      OPEN
                    </span>
                    <span className="meta-mono text-[0.48rem] sm:text-[0.55rem] text-white/90 tracking-widest block text-center leading-none mt-1">
                      SEAL
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar Beneath Envelope */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 text-center w-full sm:w-auto px-4">
              {envelopeStage === 'closed' ? (
                <button
                  onClick={handleOpenEnvelope}
                  className="btn-crimson py-3 px-6 sm:px-8 text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto min-h-[48px]"
                >
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Break Wax Seal & Open Invitation</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* HEADER: Variation 4 with Responsive Desktop Nav & Mobile Drawer */}
      <header className="border-b border-[rgba(184,29,36,0.15)] py-4 sm:py-6 px-4 sm:px-8 sticky top-0 bg-[#FDFBFA]/95 backdrop-blur-sm z-40">
        <div className="max-w-[1100px] mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="brand-font text-lg sm:text-2xl font-bold tracking-tight text-[#2D0A0A] uppercase hover:text-[#B81D24] transition-colors whitespace-nowrap shrink-0"
            >
              Lahi Foursquare
            </a>
            {/* Replay Envelope Trigger (Desktop) */}
            <button
              onClick={handleReplayEnvelope}
              className="hidden lg:flex items-center gap-1.5 meta-mono text-[0.6rem] text-[#B81D24] hover:bg-[#F4E8E8] px-2.5 py-1.5 border border-[#B81D24]/30 transition-colors"
              title="Re-open the animated invitation envelope"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Envelope</span>
            </button>

            {/* Subtle Harvest Ambience Toggle (Desktop) */}
            <button
              onClick={toggleAmbience}
              className={`hidden sm:flex items-center gap-1.5 meta-mono text-[0.6rem] px-2.5 py-1.5 border transition-all ${
                ambienceEnabled
                  ? 'border-amber-600/40 text-amber-900 bg-amber-50/90 hover:bg-amber-100/90'
                  : 'border-stone-200 text-stone-500 bg-white hover:bg-stone-50'
              }`}
              title={ambienceEnabled ? 'Pause harvest ambience drift' : 'Play harvest ambience drift'}
              aria-label={ambienceEnabled ? 'Pause harvest ambience' : 'Play harvest ambience'}
            >
              <span className="text-amber-600 text-xs">🍂</span>
              <span className="text-[#2D0A0A]/80 font-medium">Ambience:</span>
              {ambienceEnabled ? (
                <span className="flex items-center gap-1 font-semibold text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Play <Pause className="w-2.5 h-2.5 ml-0.5 inline" />
                </span>
              ) : (
                <span className="flex items-center gap-1 text-stone-500">
                  Paused <Play className="w-2.5 h-2.5 ml-0.5 inline" />
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#invitation"
              className="text-xs uppercase tracking-wider font-medium text-[#2D0A0A]/70 hover:text-[#B81D24] hover:opacity-100 transition-colors whitespace-nowrap shrink-0"
            >
              Invitation
            </a>
            <a
              href="#scripture"
              className="text-xs uppercase tracking-wider font-medium text-[#2D0A0A]/70 hover:text-[#B81D24] hover:opacity-100 transition-colors whitespace-nowrap shrink-0"
            >
              Scripture
            </a>
            <a
              href="#program"
              className="text-xs uppercase tracking-wider font-medium text-[#2D0A0A]/70 hover:text-[#B81D24] hover:opacity-100 transition-colors whitespace-nowrap shrink-0"
            >
              Program
            </a>
            <a
              href="#speaker"
              className="text-xs uppercase tracking-wider font-medium text-[#2D0A0A]/70 hover:text-[#B81D24] hover:opacity-100 transition-colors whitespace-nowrap shrink-0"
            >
              Speaker
            </a>
            <a
              href="#venue"
              className="text-xs uppercase tracking-wider font-medium text-[#2D0A0A]/70 hover:text-[#B81D24] hover:opacity-100 transition-colors whitespace-nowrap shrink-0"
            >
              Venue
            </a>
            <a
              href="#rsvp"
              className="text-xs uppercase tracking-wider font-semibold text-[#B81D24] hover:text-[#96161C] transition-colors whitespace-nowrap shrink-0"
            >
              Confirm
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#rsvp" className="btn-crimson py-2 px-3 sm:py-2.5 sm:px-5 text-[0.65rem] sm:text-xs">
              RSVP
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2.5 border border-[#B81D24]/30 text-[#2D0A0A] hover:bg-[#F4E8E8] transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B81D24]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 mt-3 border-t border-[rgba(184,29,36,0.15)] space-y-3 bg-[#FDFBFA]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#invitation"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-stone-50 border border-stone-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Invitation</span>
              </a>
              <a
                href="#scripture"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-stone-50 border border-stone-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Scripture</span>
              </a>
              <a
                href="#program"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-stone-50 border border-stone-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Program Flow</span>
              </a>
              <a
                href="#speaker"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-stone-50 border border-stone-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Speaker</span>
              </a>
              <a
                href="#venue"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-stone-50 border border-stone-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Venue & Info</span>
              </a>
              <a
                href="#rsvp"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#F4E8E8] border border-[#B81D24]/30 text-[#B81D24] font-semibold tracking-wide uppercase text-[0.65rem] flex items-center gap-2"
              >
                <span>Confirm RSVP</span>
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={toggleAmbience}
                className="w-full p-2.5 bg-amber-50/70 border border-amber-200 text-[#2D0A0A] font-medium tracking-wide uppercase text-[0.65rem] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 text-sm">🍂</span>
                  <span>Harvest Ambience</span>
                </div>
                <span className="meta-mono text-[0.6rem] text-[#B81D24] flex items-center gap-1">
                  {ambienceEnabled ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Playing (Tap to Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-stone-500" />
                      <span className="text-stone-600">Paused (Tap to Play)</span>
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={handleReplayEnvelope}
                className="w-full btn-crimson-outline py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Envelope Animation</span>
              </button>
              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 text-[0.65rem] meta-mono text-[#B81D24] hover:underline"
              >
                + Add Event to Google Calendar
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8">
        {/* HERO SECTION: Fully Responsive Grid */}
        <ScrollRevealCard>
          <section
            id="invitation"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-8 sm:py-14 lg:py-20 border-b border-[rgba(184,29,36,0.15)]"
          >
            {/* Left Column (7 cols on desktop, full width on mobile) */}
            <div className="lg:col-span-7">
              <h1
                className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-tight sm:leading-[0.92] tracking-tight text-[#2D0A0A] mb-4 sm:mb-6"
                style={{ textWrap: 'balance' }}
              >
                Faithful in Every Season
              </h1>

              <p className="text-sm sm:text-lg text-[#2D0A0A]/80 leading-relaxed font-light mb-6 max-w-xl">
                You are cordially invited to our Annual Thanksgiving Day Celebration.
                Let us lift our praise, witness His unshakeable mercies, and honor His
                holy name together as one church family.
              </p>

              {/* Quick Scripture Excerpt */}
              <blockquote className="font-cormorant italic text-base sm:text-xl text-[#2D0A0A]/90 border-l-2 border-[#B81D24] pl-3.5 sm:pl-4 py-1 mb-6 sm:mb-8 max-w-lg">
                “They are new every morning: great is thy faithfulness.”
                <span className="block not-italic meta-mono text-[#B81D24] text-[0.6rem] sm:text-[0.68rem] mt-1.5">
                  Lamentations 3:22–23
                </span>
              </blockquote>

              {/* Live Event Countdown Timer */}
              <LiveCountdown />

              {/* Responsive Action Buttons (Full width on mobile, inline on desktop) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a href="#rsvp" className="btn-crimson w-full sm:w-auto text-center">
                  Confirm Attendance
                </a>
                <a href="#program" className="btn-crimson-outline w-full sm:w-auto text-center">
                  View Order of Service
                </a>
                <button
                  onClick={handleReplayEnvelope}
                  className="btn-crimson-outline text-stone-600 border-stone-300 hover:border-[#B81D24] w-full sm:w-auto"
                  title="View animated invitation envelope again"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B81D24]" />
                  <span>Envelope Intro</span>
                </button>
              </div>

              {/* Key Speaker, Date & Time, and Where Details */}
              <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[rgba(184,29,36,0.15)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#2D0A0A]/70">
                <div>
                  <span className="meta-mono block text-[#2D0A0A]/50 mb-0.5 text-[0.55rem]">Speaker</span>
                  <span className="font-semibold text-[#2D0A0A]">Ptr. Kimuel Tito</span>
                </div>
                <div className="sm:border-l border-stone-300 sm:pl-4">
                  <span className="meta-mono block text-[#2D0A0A]/50 mb-0.5 text-[0.55rem]">Date and Time</span>
                  <span className="font-semibold text-[#2D0A0A]">October 31, 2026 • 9:00 AM</span>
                </div>
                <div className="sm:border-l border-stone-300 sm:pl-4">
                  <span className="meta-mono block text-[#2D0A0A]/50 mb-0.5 text-[0.55rem]">Where</span>
                  <span className="font-semibold text-[#2D0A0A]">Lahi Foursquare Gospel Church</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4/5 Aspect Ratio Framed Graphic (Responsive Sizing) */}
            <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
              <InteractiveTiltCard className="w-full max-w-[320px] sm:max-w-[380px] relative aspect-[4/5] bg-[#F4E8E8] border-2 border-[#B81D24] overflow-hidden shadow-lg">
                <div
                  className="w-full h-full relative"
                  style={{ borderRadius: 0 }}
                >
                  <img
                    src="/src/assets/images/church_thanksgiving_hero_1792160970138.jpg"
                    alt="Sanctuary prepared for Thanksgiving"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter contrast-[1.05]"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#2D0A0A]/85 backdrop-blur-xs text-white p-3.5 sm:p-4 border-t border-[#B81D24]/40 z-20">
                    <div className="meta-mono text-amber-200 text-[0.55rem] sm:text-[0.6rem] mb-0.5">
                      Lahi Foursquare Gospel Church
                    </div>
                    <div className="font-cormorant text-base sm:text-lg font-semibold leading-tight">
                      Thanksgiving Sanctuary
                    </div>
                  </div>
                </div>
              </InteractiveTiltCard>
            </div>
          </section>
        </ScrollRevealCard>

        {/* INTERACTIVE ACTION STRIP: Calendar & Sharing (Touch-Friendly Responsive Grid) */}
        <ScrollRevealCard>
          <section
            id="interactive-tools"
            className="py-6 sm:py-8 border-b border-[rgba(184,29,36,0.15)] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-[rgba(184,29,36,0.2)] bg-white hover:bg-[#F4E8E8]/40 transition-colors flex items-center justify-between group min-h-[48px]"
            >
              <div>
                <div className="meta-mono text-[#B81D24] text-[0.55rem] sm:text-[0.6rem] mb-0.5">Google Calendar</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#2D0A0A]">
                  Add to Calendar
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#B81D24] opacity-70 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </a>

            <button
              onClick={handleDownloadICS}
              className="p-4 border border-[rgba(184,29,36,0.2)] bg-white hover:bg-[#F4E8E8]/40 transition-colors flex items-center justify-between text-left group min-h-[48px]"
            >
              <div>
                <div className="meta-mono text-[#B81D24] text-[0.55rem] sm:text-[0.6rem] mb-0.5">Apple & Outlook</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#2D0A0A]">
                  Download .ICS
                </div>
              </div>
              <BookmarkCheck className="w-4 h-4 text-[#B81D24] opacity-70 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </button>

            <button
              onClick={handleShare}
              className="p-4 border border-[rgba(184,29,36,0.2)] bg-white hover:bg-[#F4E8E8]/40 transition-colors flex items-center justify-between text-left group min-h-[48px]"
            >
              <div>
                <div className="meta-mono text-[#B81D24] text-[0.55rem] sm:text-[0.6rem] mb-0.5">Community Link</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#2D0A0A]">
                  {shared ? 'Link Copied to Clipboard!' : 'Share Invitation'}
                </div>
              </div>
              <Share2 className="w-4 h-4 text-[#B81D24] opacity-70 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </button>
          </section>
        </ScrollRevealCard>

        {/* SCRIPTURE & THEME FOCUS */}
        <ScrollRevealCard>
          <section id="scripture" className="py-12 sm:py-16 border-b border-[rgba(184,29,36,0.15)]">
            <div className="max-w-3xl mx-auto text-center px-2">
              <div className="meta-mono text-[#B81D24] mb-2 sm:mb-3">Scripture Theme</div>
              <h2 className="section-accent-title-center font-cormorant text-3xl sm:text-5xl font-normal text-[#2D0A0A] mb-6 sm:mb-8 pb-3">
                Lamentations 3:22–23
              </h2>

              <p className="font-cormorant italic text-xl sm:text-3xl text-[#2D0A0A] leading-relaxed mb-4 sm:mb-6">
                “It is the Lord’s mercies that we are not consumed, because his
                compassions fail not. They are new every morning: great is thy
                faithfulness.”
              </p>

              <p className="text-xs sm:text-base text-[#2D0A0A]/70 leading-relaxed font-light max-w-xl mx-auto mb-6 sm:mb-8">
                In joy and hardship alike, God’s goodness has upheld every family at
                Lahi Foursquare Gospel Church. As we gather on October 31, we declare
                His enduring faithfulness across every chapter of our lives.
              </p>

              <button
                onClick={handleSpeechToggle}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#B81D24] text-xs font-mono uppercase tracking-wider text-[#B81D24] hover:bg-[#F4E8E8] transition-colors min-h-[44px]"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>{isPlayingScripture ? 'Stop Audio' : 'Listen to Scripture Recitation'}</span>
              </button>
            </div>
          </section>
        </ScrollRevealCard>

        {/* RESOURCE SPEAKER SPOTLIGHT */}
        <ScrollRevealCard>
          <section id="speaker" className="py-12 sm:py-16 border-b border-[rgba(184,29,36,0.15)]">
            <InteractiveTiltCard className="p-6 sm:p-12 border border-[rgba(184,29,36,0.2)] bg-white">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[rgba(184,29,36,0.2)] pb-6 md:pb-0 md:pr-8">
                  <div className="meta-mono text-[#B81D24] mb-1">Resource Speaker</div>
                  <h3 className="font-cormorant text-3xl sm:text-4xl font-normal text-[#2D0A0A] mb-1 sm:mb-2">
                    Ptr. Kimuel Tito
                  </h3>
                  <p className="text-xs uppercase tracking-wider font-mono text-[#2D0A0A]/60">
                    Guest Minister of the Word
                  </p>
                </div>

                <div className="md:col-span-8 md:pl-4">
                  <h4 className="meta-mono text-[#2D0A0A]/60 mb-2">Sermon Exhortation</h4>
                  <p className="text-xs sm:text-base text-[#2D0A0A]/85 leading-relaxed font-light mb-4">
                    We look forward to receiving the Word through Pastor Kimuel Tito,
                    unpacking God's providential grace and guidance under our theme
                    <em> “Faithful in Every Season”</em>. The message will be preceded by
                    a special choral number by the CMS Students.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 meta-mono text-[#B81D24] text-[0.6rem] sm:text-xs">
                    <span>Item 10 in Order of Service</span>
                    <span>·</span>
                    <span>Plaque & Token of Honor</span>
                  </div>
                </div>
              </div>
            </InteractiveTiltCard>
          </section>
        </ScrollRevealCard>

        {/* ORDER OF SERVICE (PROGRAM FLOW): Responsive 2-Column Grid */}
        <ScrollRevealCard>
          <section id="program" className="py-12 sm:py-16 border-b border-[rgba(184,29,36,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <div className="meta-mono text-[#B81D24] mb-1 sm:mb-2">Complete Schedule</div>
                <h2 className="section-accent-title font-cormorant text-3xl sm:text-5xl font-normal text-[#2D0A0A] pb-3">
                  Order of Service
                </h2>
                <p className="text-xs sm:text-sm text-[#2D0A0A]/70 mt-2 sm:mt-3 font-light">
                  Presided by Master of Ceremonies: <strong>Rubelyn Estigoy</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn-crimson-outline text-[0.65rem] py-2 px-3 min-h-[44px]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Schedule</span>
                </button>
              </div>
            </div>

            {/* Search Toolbar */}
            <div className="mb-6 sm:mb-8 flex justify-end">
              <div className="relative w-full sm:w-[280px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search program or participant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-base sm:text-xs border border-stone-300 focus:border-[#B81D24] outline-none bg-white font-mono min-h-[44px]"
                />
              </div>
            </div>

            {/* TWO-COLUMN PROGRAM GRID AS SPECIFIED IN VARIATION 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 sm:gap-y-8">
              {filteredProgram.map((item, index) => (
                <ScrollRevealCard key={item.id} delay={(index % 2) * 100}>
                  <div
                    className="border-t border-[rgba(184,29,36,0.25)] pt-3.5 sm:pt-4 flex flex-col justify-between group hover:border-[#B81D24] transition-colors h-full"
                  >
                    <div>
                      <div className="meta-mono text-[#B81D24] mb-1 text-[0.6rem] sm:text-[0.65rem]">
                        {String(item.id).padStart(2, '0')}
                      </div>
                      <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#2D0A0A] group-hover:text-[#B81D24] transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#2D0A0A]/60 font-light mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="meta-mono text-[#2D0A0A]/50 text-[0.55rem] sm:text-[0.6rem]">Assigned:</span>
                      <span className="font-medium text-[#2D0A0A] text-right">{item.assigned}</span>
                    </div>
                  </div>
                </ScrollRevealCard>
              ))}
            </div>

            {filteredProgram.length === 0 && (
              <div className="p-8 sm:p-12 text-center text-stone-500 text-sm font-mono">
                No service parts found matching "{searchQuery}".
              </div>
            )}
          </section>
        </ScrollRevealCard>

        {/* RSVP SECTION: Responsive Form Layout */}
        <ScrollRevealCard>
          <section id="rsvp" className="py-12 sm:py-16 bg-white border border-[rgba(184,29,36,0.2)] p-6 sm:p-12 my-10 sm:my-16 shadow-xs">
            <div className="max-w-2xl">
              <div className="meta-mono text-[#B81D24] mb-2">Attendance Confirmation</div>
              <h2 className="section-accent-title font-cormorant text-3xl sm:text-4xl font-normal text-[#2D0A0A] mb-3 sm:mb-4 pb-3">
                RSVP
              </h2>
              <p className="text-xs sm:text-sm text-[#2D0A0A]/70 font-light mb-6 sm:mb-8">
                Please register your family's headcount in advance to help our hospitality
                and fellowship committee prepare adequate seating and lunch servings.
              </p>

              {rsvpSuccess ? (
                <div className="p-6 sm:p-8 border-2 border-[#B81D24] bg-[#F4E8E8]/40 space-y-4">
                  <div className="flex items-center gap-3 text-[#B81D24]">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <h3 className="font-cormorant text-2xl font-bold">
                      Attendance Registered
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2D0A0A]/85 leading-relaxed font-light">
                    Thank you, <strong>{rsvpFamilyName}</strong>. Your confirmation for{' '}
                    <strong>{rsvpHeadcount} attendee(s)</strong> has been recorded for
                    October 31, 2026 at Lahi Foursquare Gospel Church.
                  </p>
                  <button
                    onClick={() => setRsvpSuccess(false)}
                    className="meta-mono text-xs text-[#B81D24] underline hover:text-[#96161C] pt-2 block min-h-[44px]"
                  >
                    Submit an additional response or modify
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 gap-5 sm:gap-6 max-w-xl">
                  <div>
                    <label className="meta-mono block mb-1 sm:mb-2 text-[#2D0A0A]/75">
                      Family Name / Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brother & Sister Tumando"
                      value={rsvpFamilyName}
                      onChange={(e) => setRsvpFamilyName(e.target.value)}
                      className="w-full border-b border-stone-300 py-2.5 focus:border-[#B81D24] outline-none bg-transparent font-sans text-base sm:text-sm min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="meta-mono block mb-1 sm:mb-2 text-[#2D0A0A]/75">
                        Number of Attendees *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        value={rsvpHeadcount}
                        onChange={(e) => setRsvpHeadcount(parseInt(e.target.value) || 1)}
                        className="w-full border-b border-stone-300 py-2.5 focus:border-[#B81D24] outline-none bg-transparent font-mono text-base sm:text-sm min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="meta-mono block mb-1 sm:mb-2 text-[#2D0A0A]/75">
                        Contact Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="09XX XXX XXXX"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        className="w-full border-b border-stone-300 py-2.5 focus:border-[#B81D24] outline-none bg-transparent font-mono text-base sm:text-sm min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="meta-mono block mb-1 sm:mb-2 text-[#2D0A0A]/75">
                      Thanksgiving Prayer Request / Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share a short word of gratitude or prayer request..."
                      value={rsvpPrayer}
                      onChange={(e) => setRsvpPrayer(e.target.value)}
                      className="w-full border-b border-stone-300 py-2.5 focus:border-[#B81D24] outline-none bg-transparent font-sans text-base sm:text-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <button type="submit" className="btn-crimson w-full sm:w-auto">
                      Confirm Attendance
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </ScrollRevealCard>

        {/* GRATITUDE WALL / CONGREGATIONAL TESTIMONIES */}
        <ScrollRevealCard>
          <section id="gratitude-wall" className="py-12 sm:py-16 border-b border-[rgba(184,29,36,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <div className="meta-mono text-[#B81D24] mb-2">Church Fellowship</div>
                <h2 className="section-accent-title font-cormorant text-3xl sm:text-4xl font-normal text-[#2D0A0A] pb-3">
                  Gratitude Wall
                </h2>
                <p className="text-xs sm:text-sm text-[#2D0A0A]/70 mt-2 font-light">
                  Leave a brief note or testimony of God's faithfulness in your family.
                </p>
              </div>
            </div>

            {/* Submission Input */}
            <form
              onSubmit={handleAddNote}
              className="p-5 sm:p-6 border border-[rgba(184,29,36,0.2)] bg-white mb-8 sm:mb-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="meta-mono block mb-1 text-[#2D0A0A]/70">
                    Your Name / Family
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Barrios Family"
                    value={newNoteName}
                    onChange={(e) => setNewNoteName(e.target.value)}
                    className="w-full border-b border-stone-300 py-2 focus:border-[#B81D24] outline-none bg-transparent text-base sm:text-xs min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="meta-mono block mb-1 text-[#2D0A0A]/70">
                    Focus of Thanksgiving
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue="God's Faithfulness"
                    className="w-full border-b border-stone-200 py-2 text-stone-400 bg-transparent text-xs font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="meta-mono block mb-1 text-[#2D0A0A]/70">
                  Praise or Testimony
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Declare how God showed up for you this year..."
                  value={newNoteMessage}
                  onChange={(e) => setNewNoteMessage(e.target.value)}
                  className="w-full border-b border-stone-300 py-2 focus:border-[#B81D24] outline-none bg-transparent text-base sm:text-xs resize-none"
                ></textarea>
              </div>

              <button type="submit" className="btn-crimson text-[0.65rem] py-2 px-4 w-full sm:w-auto">
                <Send className="w-3.5 h-3.5" />
                <span>Post Thanksgiving Testimony</span>
              </button>
            </form>

            {/* Testimonies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 sm:p-6 border border-[rgba(184,29,36,0.2)] bg-white flex flex-col justify-between"
                >
                  <p className="font-cormorant italic text-base sm:text-xl text-[#2D0A0A] leading-relaxed mb-4">
                    “{note.message}”
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2D0A0A] truncate pr-2">{note.name}</span>
                    <span className="meta-mono text-[#B81D24] text-[0.6rem] shrink-0">{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollRevealCard>

        {/* VENUE & LOCATION DETAILS (Responsive Grid) */}
        <ScrollRevealCard>
          <section id="venue" className="py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <div className="meta-mono text-[#B81D24] mb-2">Location & Gathering</div>
                <h2 className="section-accent-title font-cormorant text-3xl sm:text-4xl font-normal text-[#2D0A0A] mb-4 sm:mb-6 pb-3">
                  Lahi Sanctuary
                </h2>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#2D0A0A]/80 font-light">
                  <p>
                    <strong>Lahi Foursquare Gospel Church</strong> warmly welcomes you and
                    your loved ones. Registration and seating lineup commence at 8:30 AM
                    prior to the 9:00 AM processional.
                  </p>
                  <p>
                    A community fellowship lunch will be served immediately following the
                    benediction.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button onClick={handleCopyAddress} className="btn-crimson-outline w-full sm:w-auto text-center">
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Address Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                        <span>Copy Church Name</span>
                      </>
                    )}
                  </button>
                  <a
                    href="https://maps.google.com/?q=Lahi+Foursquare+Gospel+Church"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-crimson-outline w-full sm:w-auto text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 p-5 sm:p-6 border border-[rgba(184,29,36,0.2)] bg-white space-y-3">
                <div className="meta-mono text-[#B81D24]">Key Day Information</div>
                <div className="divide-y divide-stone-100 text-xs">
                  <div className="py-2.5 flex justify-between gap-2">
                    <span className="text-[#2D0A0A]/60">Date:</span>
                    <span className="font-semibold text-[#2D0A0A] text-right">Saturday, October 31, 2026</span>
                  </div>
                  <div className="py-2.5 flex justify-between gap-2">
                    <span className="text-[#2D0A0A]/60">Call Time:</span>
                    <span className="font-semibold text-[#2D0A0A] text-right">8:30 AM (Assembly)</span>
                  </div>
                  <div className="py-2.5 flex justify-between gap-2">
                    <span className="text-[#2D0A0A]/60">Service Start:</span>
                    <span className="font-semibold text-[#2D0A0A] text-right">9:00 AM Prompt</span>
                  </div>
                  <div className="py-2.5 flex justify-between gap-2">
                    <span className="text-[#2D0A0A]/60">Attire:</span>
                    <span className="font-semibold text-[#2D0A0A] text-right">Sunday Best / Church Attire</span>
                  </div>
                  <div className="py-2.5 flex justify-between gap-2">
                    <span className="text-[#2D0A0A]/60">Fellowship:</span>
                    <span className="font-semibold text-[#2D0A0A] text-right">Community Lunch Provided</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollRevealCard>
      </main>

      {/* FOOTER: Responsive Minimalist Space Mono Footer */}
      <footer className="py-8 sm:py-12 border-t border-stone-200 mt-12 sm:mt-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="meta-mono text-[#2D0A0A]/70 text-[0.6rem] sm:text-[0.65rem]">
            © 2026 Lahi Foursquare Gospel Church • Faithful in Every Season
          </p>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#2D0A0A]/50 max-w-md mx-auto">
            “It is the Lord’s mercies that we are not consumed, because his compassions fail not.”
          </p>
        </div>
      </footer>

      {/* FLOATING SUBTLE HARVEST AMBIENCE & HYMN SOUNDSCAPE TOGGLE (Bottom Right, only on full invitation) */}
      {envelopeStage === 'unveiled' && (
        <button
          onClick={toggleAmbience}
          className="fixed bottom-4 right-4 z-40 bg-[#FDFBFA]/95 hover:bg-[#FDFBFA] backdrop-blur-md border border-[rgba(184,29,36,0.25)] shadow-md hover:shadow-lg px-3.5 py-2 rounded-full flex items-center gap-2 text-[0.62rem] meta-mono text-[#2D0A0A] hover:border-[#B81D24] transition-all no-print group cursor-pointer"
          title={ambienceEnabled ? 'Pause harvest ambience & hymn soundscape' : 'Play harvest ambience & hymn soundscape'}
          aria-label="Toggle harvest ambience and hymn soundscape"
        >
          <span className="text-amber-600 text-xs transition-transform group-hover:scale-110">🍂</span>
          <span className="text-[0.6rem] text-[#2D0A0A]/80 font-medium hidden sm:inline">Harvest Ambience & Hymns</span>
          {ambienceEnabled ? (
            <span className="flex items-center gap-1 text-[#B81D24] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[0.58rem]">Playing</span>
              <Volume2 className="w-3.5 h-3.5 ml-0.5 text-[#B81D24]" />
            </span>
          ) : (
            <span className="flex items-center gap-1 text-stone-500">
              <VolumeX className="w-3.5 h-3.5" />
              <span className="text-[0.58rem]">Paused</span>
            </span>
          )}
        </button>
      )}

      {/* ADMIN / USHER ATTENDANCE TALLY MODAL (Accessible via URL #admin) */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D0A0A]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FDFBFA] border-2 border-[#B81D24]/40 w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                window.location.hash = '';
                setIsAdminOpen(false);
                setAdminAuthenticated(false);
                setAdminPinInput('');
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-[#B81D24] p-1.5 cursor-pointer"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!adminAuthenticated ? (
              <div className="max-w-md mx-auto py-8 text-center space-y-6">
                <div className="w-12 h-12 bg-[#B81D24]/10 text-[#B81D24] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  🔐
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl font-bold text-[#2D0A0A]">Usher & Admin Attendance Access</h3>
                  <p className="meta-mono text-xs text-stone-500 mt-1">Enter secure PIN to view confirmed families and headcounts.</p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (adminPinInput === '2026' || adminPinInput === '1234' || adminPinInput === 'admin') {
                      setAdminAuthenticated(true);
                      setAdminPinError(false);
                    } else {
                      setAdminPinError(true);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="password"
                    maxLength={6}
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="Enter PIN (hint: 2026)"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-center text-lg tracking-widest font-mono rounded-none focus:outline-none focus:border-[#B81D24]"
                    autoFocus
                  />
                  {adminPinError && (
                    <p className="text-xs text-[#B81D24] font-medium">Incorrect PIN. Hint: try 2026</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#B81D24] hover:bg-[#8B1419] text-white font-medium text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer"
                  >
                    Authorize Access
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="meta-mono text-[0.6rem] text-[#B81D24] uppercase tracking-wider font-semibold block">Registration Desk Portal</span>
                    <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#2D0A0A]">Attendance & Tally Summary</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="btn-crimson-outline text-xs py-2 px-3 cursor-pointer"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="btn-crimson-outline text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Sheet</span>
                    </button>
                    <button
                      onClick={() => {
                        setRsvpsRefreshKey(k => k + 1);
                      }}
                      className="btn-crimson-outline text-xs py-2 px-3 cursor-pointer"
                      title="Refresh data"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Tally Cards */}
                {(() => {
                  const currentRsvps = rsvps;
                  const totalFamilies = currentRsvps.length;
                  const totalHeadcount = currentRsvps.reduce((acc: number, r: { headcount?: number }) => acc + (Number(r.headcount) || 1), 0);
                  const averageFamilySize = totalFamilies > 0 ? (totalHeadcount / totalFamilies).toFixed(1) : 0;
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-stone-50 border border-stone-200 p-4 rounded-none">
                        <span className="meta-mono text-[0.6rem] text-stone-500 uppercase tracking-wider block">Total Families Confirmed</span>
                        <div className="font-cormorant text-3xl font-bold text-[#2D0A0A] mt-1">{totalFamilies}</div>
                        <span className="text-[0.65rem] text-emerald-700 font-medium mt-1 block">✓ Ready for registration desk</span>
                      </div>
                      <div className="bg-stone-50 border border-stone-200 p-4 rounded-none">
                        <span className="meta-mono text-[0.6rem] text-stone-500 uppercase tracking-wider block">Total Headcount Breakdown</span>
                        <div className="font-cormorant text-3xl font-bold text-[#B81D24] mt-1">{totalHeadcount} <span className="text-sm font-sans font-normal text-stone-600">Attendees</span></div>
                        <span className="text-[0.65rem] text-stone-500 mt-1 block">Seating & lunch allocation</span>
                      </div>
                      <div className="bg-stone-50 border border-stone-200 p-4 rounded-none">
                        <span className="meta-mono text-[0.6rem] text-stone-500 uppercase tracking-wider block">Average Family Size</span>
                        <div className="font-cormorant text-3xl font-bold text-[#2D0A0A] mt-1">{averageFamilySize} <span className="text-sm font-sans font-normal text-stone-600">per family</span></div>
                        <span className="text-[0.65rem] text-stone-500 mt-1 block">Based on RSVP submissions</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Searchable Family List */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-cormorant text-xl font-bold text-[#2D0A0A]">Confirmed Families & Guests</h3>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        placeholder="Search family name or contact..."
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 text-xs text-[#2D0A0A] rounded-none focus:outline-none focus:border-[#B81D24]"
                      />
                    </div>
                  </div>

                  <div className="border border-stone-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-100 border-b border-stone-200 text-[0.65rem] meta-mono text-[#2D0A0A]/70 uppercase tracking-wider">
                          <th className="p-3">Family / Name</th>
                          <th className="p-3 text-center">Headcount</th>
                          <th className="p-3">Contact Number</th>
                          <th className="p-3">Prayer Request / Notes</th>
                          <th className="p-3">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 text-xs font-light">
                        {(() => {
                          const filtered = rsvps.filter((r: { name?: string; phone?: string; prayer?: string }) =>
                            (r.name || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                            (r.phone || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
                            (r.prayer || '').toLowerCase().includes(adminSearch.toLowerCase())
                          );

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-stone-500 font-sans italic">
                                  No family RSVPs found matching your search.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((r: { name?: string; headcount?: number; phone?: string; prayer?: string; timestamp?: string }, idx: number) => (
                            <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                              <td className="p-3 font-semibold text-[#2D0A0A]">{r.name}</td>
                              <td className="p-3 text-center">
                                <span className="inline-block px-2 py-0.5 bg-[#B81D24]/10 text-[#B81D24] font-semibold text-xs rounded">
                                  {r.headcount || 1}
                                </span>
                              </td>
                              <td className="p-3 text-stone-600 font-mono text-[0.65rem]">{r.phone || '—'}</td>
                              <td className="p-3 text-stone-700 italic max-w-xs truncate">{r.prayer || '—'}</td>
                              <td className="p-3 text-[0.65rem] text-stone-500 font-mono">
                                {r.timestamp ? new Date(r.timestamp).toLocaleDateString() + ' ' + new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={() => {
                      window.location.hash = '';
                      setIsAdminOpen(false);
                      setAdminAuthenticated(false);
                      setAdminPinInput('');
                    }}
                    className="px-5 py-2.5 bg-[#2D0A0A] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#B81D24] transition-colors rounded-none cursor-pointer"
                  >
                    Close Admin View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

