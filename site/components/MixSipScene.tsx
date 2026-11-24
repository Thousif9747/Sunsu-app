"use client";
import { useEffect, useRef, useState, useId } from 'react';
import { gsap } from '@/lib/gsap';

const stages = [
  { name: 'Pour', title: 'A little powder. A bright beginning.', copy: 'Choose your Sunsu blend and prepare it as directed on your pack.' },
  { name: 'Stir', title: 'Bring your flavour to life.', copy: 'Mix it your way, following the liquid and mixing directions on your pack.' },
  { name: 'Sip', title: 'Make a moment of it.', copy: 'Your favourite flavour, ready for a little everyday pause.' },
];

export function MixSipScene({ shopHref = '#blends' }: { shopHref?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motion, setMotion] = useState(false);
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const manual = useRef(false);
  const playback = useRef({ motion: false, playing: true, visible: false });
  const syncPlayback = useRef<() => void>(() => {});
  const uid = useId().replace(/:/g, '');
  useEffect(() => {
    setLocked(new URLSearchParams(window.location.search).has('static'));
    const read = () => setMotion(document.documentElement.dataset.sunsuMotion === 'on');
    read(); window.addEventListener('sunsu:motion', read);
    return () => window.removeEventListener('sunsu:motion', read);
  }, []);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const context = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.8 });
      tl.set(q('.sip-sachet'), { opacity: 1, x: 0, y: 0, rotation: 0 })
        .set(q('.sip-particle'), { opacity: 0, y: -20 })
        .set(q('.sip-liquid'), { fill: '#c6e1dc' })
        .set(q('.sip-spoon'), { opacity: 0, rotation: -12 })
        .set(q('.sip-swirl'), { opacity: 0, scaleX: .65 })
        .set(q('.sip-glass-hand'), { x: 0, y: 0, rotation: 0 })
        .set(q('.sip-forearm path'), { attr: { d: 'M455 370 339 353' } })
        .set(q('.sip-enjoy'), { opacity: 0, scale: .85 })
        .call(() => setStage(0))
        .to(q('.sip-sachet'), { rotation: 32, y: 12, duration: .7, transformOrigin: '75% 80%' }, .2)
        .to(q('.sip-particle'), { opacity: 1, y: 90, stagger: .07, duration: .8, ease: 'power1.in', repeat: 1 }, .65)
        .to(q('.sip-liquid'), { fill: '#eeae4b', duration: 1.5 }, 1)
        .addLabel('pour', 1.7)
        .to(q('.sip-sachet'), { opacity: 0, y: -18, duration: .5 }, 2.7)
        .call(() => setStage(1), [], 3)
        .to(q('.sip-spoon'), { opacity: 1, duration: .3 }, 3)
        .to(q('.sip-spoon'), { rotation: 13, duration: .45, repeat: 5, yoyo: true, transformOrigin: '50% 80%', ease: 'sine.inOut' }, 3.2)
        .to(q('.sip-swirl'), { opacity: .8, scaleX: 1, duration: .45, repeat: 5, yoyo: true }, 3.2)
        .addLabel('stir', 4)
        .to(q('.sip-spoon,.sip-swirl'), { opacity: 0, duration: .4 }, 6)
        .call(() => setStage(2), [], 6.5)
        .to(q('.sip-glass-hand'), { x: 95, y: -25, rotation: 24, transformOrigin: '295px 330px', duration: 1.3, ease: 'power2.inOut' }, 6.5)
        .to(q('.sip-forearm path'), { attr: { d: 'M455 370 420 340' }, duration: 1.3, ease: 'power2.inOut' }, 6.5)
        .to(q('.sip-enjoy'), { opacity: 1, scale: 1, duration: .7, stagger: .12, transformOrigin: 'center' }, 7.6)
        .addLabel('sip', 8.1)
        .to({}, { duration: 2.3 })
        .to(q('.sip-glass-hand'), { x: 0, y: 0, rotation: 0, duration: 1 }, 10.5)
        .to(q('.sip-forearm path'), { attr: { d: 'M455 370 339 353' }, duration: 1 }, 10.5);
      timeline.current = tl;
      tl.seek('pour', true);
    }, el);
    const sync = () => {
      const current = playback.current;
      if (current.motion && current.playing && !manual.current && current.visible) timeline.current?.play();
      else timeline.current?.pause();
    };
    syncPlayback.current = sync;
    const observer = new IntersectionObserver(([entry]) => { playback.current.visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(el); sync();
    return () => { observer.disconnect(); syncPlayback.current = () => {}; context.revert(); timeline.current = null; };
  }, []);

  // Playback changes pause/resume the existing timeline at its exact frame.
  useEffect(() => {
    playback.current.motion = motion;
    playback.current.playing = playing;
    syncPlayback.current();
  }, [motion, playing]);

  const choose = (index: number) => {
    manual.current = true; timeline.current?.pause().seek(stages[index].name.toLowerCase(), true);
    setStage(index); setPlaying(false); setAnnouncement(`${stages[index].name}. ${stages[index].title}`);
  };
  const toggle = () => {
    if (locked) return;
    if (playing && motion && !manual.current) { manual.current = true; timeline.current?.pause(); setPlaying(false); return; }
    if (!motion) window.dispatchEvent(new Event('sunsu:toggle'));
    manual.current = false; setPlaying(true); timeline.current?.restart().pause(); syncPlayback.current();
  };

  return <section className="mix-sip" id="mix" ref={root} aria-labelledby="mix-heading">
    <div className="mix-sip-heading"><p className="kicker">THE EVERYDAY SUNSU RITUAL</p><h2 id="mix-heading">A LITTLE MIX.<br />A <em>LOVELY</em><br />MOMENT.</h2><p>From powder to your favourite pause.<br />Pour, stir, and make it yours.</p><a className="text-link" href={shopHref}>Find your flavour <span aria-hidden="true">↗</span></a></div>
    <div className="mix-sip-demo">
      <div className="sip-scene-top"><span>YOUR GLASS. YOUR MOMENT.</span><span aria-hidden="true">✳</span><span>01 — 03</span></div>
      <svg className="sip-scene" viewBox="0 0 640 470" role="img" aria-label="Illustrated Sunsu powder pours into a glass of water, a spoon mixes the drink, and a person lifts the glass to sip.">
        <defs><clipPath id={`${uid}-glass`}><path d="M245 260h97l-12 120q-36 13-73 0Z" /></clipPath></defs>
        <circle cx="325" cy="225" r="188" fill="#f3d7aa"/><path d="M72 403H583" stroke="#204f36" strokeWidth="2"/><ellipse cx="299" cy="404" rx="160" ry="12" fill="#214b3010"/>
        <g fill="none" stroke="#81966c" strokeWidth="1.5"><path d="M102 335q0-72 41-110M113 285q-39-31-28-56 35 14 36 44M125 262q-3-44 24-53 9 31-15 45"/><path d="M548 330q-3-60-34-81m24 47q29-25 33-8-3 25-31 24m-16-41q-25-13-18-32 24 5 25 25"/></g>
        {/* Seated adult, with a separate articulated drinking arm. */}
        <path d="M394 392v-58q2-57 53-57h19q61 0 64 66l5 49" fill="#24583c"/>
        <path d="M441 267v28q15 16 31-1l-6-39" fill="#c48158"/>
        <path d="M412 220q-11-65 35-78 58-17 67 42l-7 61-35 13Z" fill="#273c2c"/>
        <path d="M423 199q2-36 34-34 32 2 35 36l-3 37q-4 35-31 36-26-2-32-30l-10-10 6-9Z" fill="#dfaa7d"/>
        <path d="M420 200q25-3 36-29 15 22 40 25l-3-32-39-16-32 22Z" fill="#273c2c"/>
        <path d="M429 219h6" stroke="#283c2a" strokeWidth="3" strokeLinecap="round"/><path d="M417 241q10 5 16 0" fill="none" stroke="#9c543a" strokeWidth="2" strokeLinecap="round"/>
        <path d="M496 318q17 44-1 69" fill="none" stroke="#dfaa7d" strokeWidth="23" strokeLinecap="round"/>
        <path d="M452 326l4 44" stroke="#dfaa7d" strokeWidth="24" strokeLinecap="round"/>
        <g className="sip-forearm"><path d="M455 370 339 353" fill="none" stroke="#dfaa7d" strokeWidth="23" strokeLinecap="round"/></g>
        <g className="sip-glass-hand">
          <g clipPath={`url(#${uid}-glass)`}><path className="sip-liquid" d="M243 292q25-8 49 0t54 0v100H243Z" fill="#c6e1dc"/><ellipse className="sip-swirl" cx="294" cy="301" rx="36" ry="7" fill="none" stroke="#fff6d7" strokeWidth="3"/><path d="M264 300v63" stroke="#ffffff70" strokeWidth="4" strokeLinecap="round"/><circle cx="316" cy="322" r="3" fill="#fff9dc"/><circle cx="304" cy="346" r="2" fill="#fff9dc"/></g>
          <path d="M245 260h97l-12 120q-36 13-73 0Z" fill="#fff9e81c" stroke="#25543a" strokeWidth="2.5"/><ellipse cx="293.5" cy="260" rx="48.5" ry="7" fill="#fff9e855" stroke="#25543a" strokeWidth="2"/>
          <path d="M337 340q-15-11-15 0l7 6-7 3q-3 14 15 16l9-5" fill="#dfaa7d" stroke="#bc8057" strokeWidth="1.5"/>
        </g>
        <g className="sip-spoon"><path d="m286 307 24-102" stroke="#647468" strokeWidth="5" strokeLinecap="round"/><ellipse cx="285" cy="311" rx="7" ry="12" fill="#8b9a89"/></g>
        <g className="sip-sachet"><path d="m209 116 64-17 27 108-64 17Z" fill="#fffae6" stroke="#24583c" strokeWidth="2"/><path d="m232 207 65-17 3 17-64 17Z" fill="#24583c"/><text x="228" y="159" fill="#24583c" fontSize="21" fontFamily="Georgia,serif" fontStyle="italic" transform="rotate(-15 228 159)">Sunsu</text><text x="239" y="179" fill="#b97730" fontSize="8" transform="rotate(-15 239 179)">FRUIT MIX</text><path d="m212 123 60-16" stroke="#dbb363" strokeWidth="3"/></g>
        {Array.from({ length: 10 }, (_, i) => <circle key={i} className="sip-particle" cx={278 + (i % 3) * 6} cy={205 + (i % 4) * 8} r={2 + i % 2} fill="#d68b35"/>)}
        <g className="sip-enjoy" fill="#c77c30"><path d="m528 160 6-16 6 16 16 6-16 6-6 16-6-16-16-6Z"/><path d="m550 212 3-9 3 9 9 3-9 3-3 9-3-9-9-3Z"/></g>
        <text x="89" y="375" fill="#55714f" fontSize="12" fontFamily="Georgia,serif" fontStyle="italic" transform="rotate(-9 89 375)">a little daily ritual</text>
      </svg>
      <div className="sip-controls"><div role="group" aria-label="Preparation stages">{stages.map((item, i) => <button key={item.name} aria-pressed={stage === i} onClick={() => choose(i)}><span>0{i + 1}</span> {item.name}</button>)}</div><button className="sip-play" onClick={toggle} disabled={locked} aria-label={playing && motion ? 'Pause preparation animation' : 'Replay preparation animation'}>{playing && motion ? 'Ⅱ Pause' : '↻ Replay'}</button></div>
      <div className="sip-caption"><span>0{stage + 1}</span><div><h3>{stages[stage].title}</h3><p>{stages[stage].copy}</p></div></div>
      <p className="sip-instructions">Illustrative preparation. Follow the directions on your pack for liquid, quantity and mixing method.</p><span className="sip-sr" aria-live="polite">{announcement}</span>
    </div>
    <div className="sip-benefits" aria-label="Why choose Sunsu"><div><span aria-hidden="true">↗</span><h3>Convenient portions</h3><p>Choose a pack size that fits your routine.</p></div><div><span aria-hidden="true">✳</span><h3>Six flavour choices</h3><p>Fruit, cocoa and botanical blends. Find your favourite.</p></div><div><span aria-hidden="true">◌</span><h3>Easy everyday preparation</h3><p>A simple mixing ritual for your everyday moments.</p></div></div>
  </section>;
}

