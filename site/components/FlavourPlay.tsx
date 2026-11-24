"use client";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { products, type Product } from '../sunsu';
import { cleanProgress, completeFlavour, emptyProgress, flavourInfo, ingredientRounds, type ExplorerProgress } from '../explore';
import { ExploreHeader } from './FlavourUniverse';
import { MixSipScene } from './MixSipScene';
import { SunsuMotion } from './SunsuMotion';

const PROGRESS_KEY = 'sunsu-explorer-v1';

export function IngredientGame({ product }: { product: Product }) {
  const [seed, setSeed] = useState(1);
  const rounds = useMemo(() => ingredientRounds(product.id, seed), [product.id, seed]);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<ExplorerProgress>(emptyProgress);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState('');
  const question = useRef<HTMLHeadingElement>(null);
  const answered = useRef(false);
  const ended = useRef(false);
  useEffect(() => {
    try { setProgress(cleanProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null'))); }
    catch { setStorageAvailable(false); }
  }, []);
  const persist = (next: ExplorerProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  };
  const choose = (choice: string) => {
    if (answered.current || ended.current) return;
    answered.current = true;
    setAnswer(choice);
    if (choice === rounds[round].answer) setScore(current => current + 1);
  };
  const advance = () => {
    if (!answered.current || ended.current || answer === null) return;
    answered.current = false;
    if (round === rounds.length - 1) {
      ended.current = true;
      setFinished(true);
      let newest = progress;
      try { newest = cleanProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null')); }
      catch { /* Memory progress remains usable when browser storage is blocked. */ }
      persist(completeFlavour(newest, product.id, score));
    } else { setRound(current => current + 1); setAnswer(null); }
    requestAnimationFrame(() => question.current?.focus());
  };
  const replay = () => {
    answered.current = false; ended.current = false;
    setSeed(current => current + 7); setRound(0); setAnswer(null); setScore(0); setFinished(false);
    requestAnimationFrame(() => question.current?.focus());
  };
  return <section className="ingredient-game" id="game" aria-labelledby="game-title">
    <div className="game-heading"><p className="kicker">A LITTLE PLAY. A LITTLE DISCOVERY.</p><h2 id="game-title">KNOW YOUR<br /><em>BLEND?</em></h2><p>Three rounds. Pick the featured ingredient in {product.name}. No timer—just a little curiosity.</p></div>
    <div className="game-board"><div className="game-progress"><span>{finished ? 'DISCOVERY COMPLETE' : `ROUND 0${round + 1} / 03`}</span><span>{score} / 3 correct</span></div><div className="game-dots" aria-hidden="true">{rounds.map((_, index) => <span key={index} className={finished || index <= round ? 'active' : ''} />)}</div>
      {finished ? <div className="game-result"><span className="game-medal" aria-hidden="true">✳</span><h3 ref={question} tabIndex={-1}>A new flavour, discovered.</h3><p>You found {score} of 3 ingredients. Your {product.name} explorer stamp is now in your passport.</p><button className="button" onClick={replay}>Play again <span>↻</span></button><a className="text-link" href={`/#blend-${product.id}`}>Meet this blend in the shop ↗</a></div> : <><h3 ref={question} tabIndex={-1}>Which ingredient belongs in {product.name}?</h3><div className="ingredient-choices">{rounds[round].choices.map((choice, index) => <button key={choice} onClick={() => choose(choice)} disabled={answer !== null} aria-pressed={answer === choice} className={answer && choice === rounds[round].answer ? 'is-correct' : answer === choice ? 'is-incorrect' : ''}><span aria-hidden="true">0{index + 1}</span>{choice}<b aria-hidden="true">{answer && choice === rounds[round].answer ? '✓' : '↗'}</b></button>)}</div><div className="game-feedback" aria-live="polite">{answer && <p>{answer === rounds[round].answer ? 'That’s the one!' : 'A little discovery:'} {rounds[round].answer} is a featured ingredient in this blend.</p>}</div><button className="button" disabled={answer === null} onClick={advance}>{round === 2 ? 'See my discovery' : 'Next ingredient'} <span>→</span></button></>}
    </div>
    <div className="flavour-passport"><div><p className="kicker">YOUR LITTLE FLAVOUR PASSPORT</p><h3>{progress.explored.length} / 6 worlds discovered</h3><p>{storageAvailable ? 'Saved on this device only. These stamps are just for fun—not rewards or discounts.' : 'Device storage is unavailable. Your stamps will last for this page visit only.'}</p></div><div className="passport-stamps">{products.map(item => <a key={item.id} href={`/play/${item.id}#game`} className={progress.explored.includes(item.id) ? 'collected' : ''} aria-label={`${item.name}: ${progress.explored.includes(item.id) ? `discovered, best ${progress.best[item.id] ?? 0} of 3` : 'not yet discovered'}`}><span aria-hidden="true">✳</span><b>{flavourInfo(item.id).word}</b>{progress.explored.includes(item.id) && <small>{progress.best[item.id] ?? 0}/3</small>}</a>)}</div><div className="passport-reset">{confirmClear ? <><span>Clear your stamps and scores on this device?</span><button onClick={() => { persist(emptyProgress()); setConfirmClear(false); setNotice('Your device progress has been cleared.'); }}>Yes, clear</button><button onClick={() => setConfirmClear(false)}>Keep my stamps</button></> : <button onClick={() => setConfirmClear(true)}>Clear device progress</button>}<span role="status">{notice}</span></div></div>
  </section>;
}

function ShareFlavour({ product }: { product: Product }) {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { setUrl(`${window.location.origin}/play/${product.id}`); }, [product.id]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setMessage('Link copied. Share your little Sunsu world.'); }
    catch { setMessage('Copy wasn’t available. Select the link below to copy it.'); }
  };
  return <section className="play-share"><div><p className="kicker">A LITTLE DISCOVERY TO PASS ON</p><h2>GOOD FLAVOUR.<br /><em>SHARE IT.</em></h2></div><div><label htmlFor="flavour-share-link">This flavour’s page</label><input id="flavour-share-link" readOnly value={url} onFocus={event => event.target.select()} /><button className="button" disabled={!url} onClick={copy}>Copy flavour link <span>↗</span></button><p role="status">{message}</p></div></section>;
}

export function FlavourPlay({ product }: { product: Product }) {
  const info = flavourInfo(product.id);
  return <div className="sunsu explore-page play-page" style={{ '--play-tint': product.tint, '--play-accent': info.accent } as CSSProperties}><SunsuMotion /><a className="skip" href="#play-main">Skip to flavour experience</a><ExploreHeader current="play" /><main id="play-main"><section className="play-hero"><div><p className="kicker">YOU FOUND YOUR FLAVOUR WORLD</p><h1>{product.name}</h1><p>{info.note} Explore your pack, make a little moment, and play with what you know.</p><nav aria-label="Flavour page sections"><a href="#mix">Prepare ↓</a><a href="#serving">Serving ideas ↓</a><a href="#game">Play ↓</a></nav><a className="button" href={`/#blend-${product.id}`}>Shop this blend <span>↗</span></a></div><div className="play-pack-art"><span /><img src={`/images/sunsu/${product.id}.jpg`} alt={`${product.name} Sunsu packaging`} width="1094" height="1438" /><b aria-hidden="true">MIX.<br />PLAY.<br />DISCOVER.</b></div></section>
      <div className="play-ingredient-strip"><span>FEATURED INGREDIENTS</span><p>{product.ingredients}</p><small>Check your pack for the complete ingredient list.</small></div><MixSipScene shopHref={`/#blend-${product.id}`} />
      <section className="serving-ideas" id="serving"><div><p className="kicker">YOUR GLASS. YOUR MOMENT.</p><h2>A LITTLE<br /><em>INSPIRATION.</em></h2><p>Serving inspiration, not measured recipes. Follow your pack directions for liquid, quantity and preparation.</p></div><article><span>01 / EVERYDAY GLASS</span><h3>The simple ritual.</h3><p>Choose your blend. Use the liquid and quantity directed on your pack, mix as instructed, and make a moment of it.</p></article><article><span>02 / CHILLED MOMENT</span><h3>A cooler little pause.</h3><p>Prepare your drink according to your pack directions, then serve it in a chilled glass.</p></article></section>
      <IngredientGame product={product} /><ShareFlavour product={product} />
    </main><footer className="explore-footer"><a href="/universe">← Explore more worlds</a><span>NO ACCOUNT. JUST A LITTLE CURIOSITY.</span><a href={`/#blend-${product.id}`}>Back to shopping →</a></footer></div>;
}

export function PlayDirectory() {
  return <div className="sunsu explore-page play-directory"><SunsuMotion /><ExploreHeader current="play" /><main><p className="kicker">OPEN A PACK. OPEN A LITTLE WORLD.</p><h1>MIX. PLAY.<br /><em>DISCOVER.</em></h1><p>Choose the blend on your pack for preparation, serving ideas and a little ingredient game.</p><div className="play-directory-grid">{products.map((product, index) => <a key={product.id} href={`/play/${product.id}`} style={{ '--play-tint': product.tint } as CSSProperties}><span>WORLD 0{index + 1}</span><img src={`/images/sunsu/${product.id}.jpg`} alt="" width="1094" height="1438" /><h2>{product.name}</h2><b>Mix & play ↗</b></a>)}</div></main><footer className="explore-footer"><a href="/">← Back to Sunsu</a><a href="/#blends">Shop blends ↗</a></footer></div>;
}
