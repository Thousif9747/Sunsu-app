"use client";
import { useState, type CSSProperties } from 'react';
import { products, money } from '../sunsu';
import { flavourInfo } from '../explore';
import { SunsuMotion } from './SunsuMotion';

export function UniverseTeaser() {
  return <section className="universe-teaser" id="explore" aria-labelledby="universe-invite">
    <div><p className="kicker">TAKE A LITTLE DETOUR</p><h2 id="universe-invite">A WHOLE WORLD<br />OF <em>FLAVOUR.</em></h2><p>Six blends. Six little worlds. Find the ingredients, follow your curiosity, and discover your kind of Sunsu.</p><a className="button light" href="/universe">Enter the flavour universe <span aria-hidden="true">↗</span></a></div>
    <div className="teaser-orbits" aria-hidden="true"><span /><span /><img src="/images/pulp-fresh/fruit-strawberry.webp" alt="" width="180" height="180" /><img src="/images/pulp-fresh/fruit-pineapple.webp" alt="" width="180" height="180" /><img src="/images/pulp-fresh/fruit-ginger.webp" alt="" width="180" height="180" /><b>✳</b></div>
    <a className="teaser-play-link" href="/play">Already have a pack? Mix, explore & play →</a>
  </section>;
}

export function ExploreHeader({ current }: { current: 'universe' | 'play' }) {
  return <header className="explore-header"><a href="/" className="wordmark" aria-label="Sunsu home">Sunsu<span>✳</span></a><nav aria-label="Explore navigation"><a href="/#blends">Shop blends ↗</a><a href={current === 'universe' ? '/play' : '/universe'}>{current === 'universe' ? 'Mix & play' : 'Flavour universe'}</a></nav></header>;
}

export function FlavourUniverse() {
  const [selected, setSelected] = useState('mango');
  const [size, setSize] = useState<Record<string, string>>({});
  const product = products.find(item => item.id === selected)!;
  const info = flavourInfo(selected);
  const variant = product.variants.find(item => item.id === size[selected]) ?? product.variants[0];
  return <div className="sunsu explore-page universe-page"><SunsuMotion /><a className="skip" href="#universe-main">Skip to flavour worlds</a><ExploreHeader current="universe" />
    <main id="universe-main" style={{ '--world-accent': info.accent, '--world-tint': product.tint } as CSSProperties}>
      <div className="universe-intro"><p className="kicker">FOLLOW YOUR FLAVOUR</p><h1>A LITTLE<br /><em>UNIVERSE.</em></h1><p>Tap a world. Meet its ingredients.<br />Make your next sip a discovery.</p><span className="universe-coordinate" aria-hidden="true">SUNSU / EXPLORATION 01—06</span></div>
      <div className="universe-layout"><div className="world-selector" role="group" aria-label="Choose a flavour world">
        {products.map((item, index) => <button key={item.id} aria-pressed={selected === item.id} aria-controls="selected-world" onClick={() => setSelected(item.id)} style={{ '--planet': flavourInfo(item.id).accent, '--delay': `${index * -.8}s` } as CSSProperties}><span className="planet"><img src={`/images/sunsu/${item.id}.jpg`} alt="" width="70" height="90" /></span><span><small>WORLD 0{index + 1}</small>{item.name}</span><b aria-hidden="true">↗</b></button>)}
      </div><section className="selected-world" id="selected-world" aria-label={`${product.name} world`}><div className="world-art" key={product.id}><span className="world-orbit orbit-one" /><span className="world-orbit orbit-two" /><span className="world-ghost" aria-hidden="true">{info.word}</span><img className="world-package" src={`/images/sunsu/${product.id}.jpg`} alt={`${product.name} Sunsu packaging`} width="1094" height="1438" /><span className="world-star" aria-hidden="true">✳</span><div className="ingredient-satellites" aria-hidden="true">{product.ingredients.split(' · ').slice(0, 4).map((ingredient, index) => <span key={ingredient} className={`satellite satellite-${index}`}>{ingredient}</span>)}</div><p>{info.mood}</p></div>
        <div className="world-details"><p className="kicker">YOU’VE LANDED ON</p><h2>{product.name}</h2><p className="world-taste">{info.note}</p><h3>Meet the ingredients</h3><div className="world-ingredients">{product.ingredients.split(' · ').map(ingredient => <span key={ingredient}>{ingredient}</span>)}</div><p className="explore-small">Featured ingredients shown. Ask us for the complete ingredient list.</p><details className="world-preparation"><summary>How do I prepare it? <span>+</span></summary><p>Choose your blend and follow the liquid, quantity and mixing method on your pack. Stir and enjoy your own little Sunsu moment.</p></details><div className="world-pack"><label>Explore pack sizes<select value={variant.id} onChange={event => setSize({ ...size, [selected]: event.target.value })}>{product.variants.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><strong>{variant.price ? money(variant.price) : 'Enquire for price'}</strong>{variant.mrp && <del>MRP {money(variant.mrp)}</del>}</div><div className="world-actions"><a className="button" href={`/#blend-${product.id}`}>Shop this blend <span>↗</span></a><a className="text-link" href={`/play/${product.id}`}>Mix & play →</a></div><p className="explore-small">Packaging artwork shown; choose your size when shopping.</p></div>
      </section></div>
      <div className="universe-bottom"><span>CURIOUS? THERE’S MORE TO EXPLORE.</span><a href="/play">Preparation, serving ideas & a little game →</a></div>
    </main><footer className="explore-footer"><a href="/">← Back to Sunsu</a><span>YOUR NEXT FAVOURITE IS OUT THERE.</span><a href="/#blends">Just here to shop? →</a></footer>
  </div>;
}
