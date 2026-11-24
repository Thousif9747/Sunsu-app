"use client";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { products, cleanCart, orderMessage, validateDetails, whatsappReady, whatsappUrl, type Cart, type Product, lineKey, cartLines, cartTotal, money } from './sunsu';
import { SunsuMotion, FlavourShowcase, FlavourMarquee } from './components/SunsuMotion';
import { MixSipScene } from './components/MixSipScene';
import { UniverseTeaser } from './components/FlavourUniverse';
const Arrow = () => <span aria-hidden="true">↗</span>;
function Pack({ id, className = '', eager = false }: {
    id: string;
    className?: string;
    eager?: boolean;
}) { return <img className={className} src={`/images/sunsu/${id}.jpg`} alt={`${products.find(p => p.id === id)?.name} Sunsu box`} width="1094" height="1438" loading={eager ? 'eager' : 'lazy'}/>; }
export default function Page() {
    const [cart, setCart] = useState<Cart>({});
    const [loaded, setLoaded] = useState(false);
    const [bag, setBag] = useState(false);
    const [detail, setDetail] = useState<Product | null>(null);
    const [menu, setMenu] = useState(false);
    const [notice, setNotice] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const dialog = useRef<HTMLDialogElement>(null);
    const returnFocus = useRef<HTMLElement | null>(null);
    const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', note: '' });
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    useEffect(() => { try {
        setCart(cleanCart(JSON.parse(localStorage.getItem('sunsu-bag') || '{}')));
    }
    catch { } setLoaded(true); }, []);
    useEffect(() => { if (loaded)
        try {
            localStorage.setItem('sunsu-bag', JSON.stringify({version:2,items:cart}));
        }
        catch { } }, [cart, loaded]);
    useEffect(() => { const d = dialog.current; if (bag || detail) {
        if (!d?.open)
            returnFocus.current = document.activeElement as HTMLElement;
        d?.showModal();
        document.body.style.overflow = 'hidden';
    }
    else {
        d?.close();
        document.body.style.overflow = '';
        returnFocus.current?.focus();
    } return () => { document.body.style.overflow = ''; }; }, [bag, detail]);
    function close() { setBag(false); setDetail(null); }
    function add(id: string) { const p=products.find(p=>p.id===id)!; const key=lineKey(p); setCart(c=>({...c,[key]:Math.min(99,(c[key]||0)+1)}));setNotice(`${p.name} added to your bag`); }
    function change(id: string, n: number) { setCart(c => { const next = { ...c }; if (n <= 0)
        delete next[id];
    else
        next[id] = Math.min(n, 99); return next; }); }
    function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const errors = validateDetails(form); if (errors.length) {
        setFormErrors(errors);
        const field = !form.name.trim() ? 'name' : errors.some(error => error.includes('phone')) ? 'phone' : 'city';
        (e.currentTarget.elements.namedItem(field) as HTMLInputElement | null)?.focus();
        return;
    } if (!whatsappReady || !count)
        return; window.open(whatsappUrl(orderMessage(cart, form)), '_blank', 'noopener,noreferrer'); }
    function contact() { if (whatsappReady)
        window.open(whatsappUrl('Hello Sunsu! I would like to know more about your drink mixes.'), '_blank', 'noopener,noreferrer');
    else {
        setBag(true);
        setDetail(null);
    } }
    return <div className="sunsu"><SunsuMotion />
  <a className="skip" href="#main">Skip to content</a>
  <div className="announcement">A little fruit. A little ritual. A whole lot of flavour.</div>
  <header className="nav"><a className="wordmark" href="#" aria-label="Sunsu home">Sunsu<span>✳</span></a><nav aria-label="Main navigation" className={menu ? 'open' : ''}>{[['Blends', 'blends'], ['How to mix', 'mix'], ['Our story', 'story'], ['FAQs', 'faq'], ['Universe', '/universe']].map(([label, id]) => <a key={id} href={id.startsWith('/') ? id : `#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</nav><div className="nav-actions"><button className="bag-button" onClick={() => setBag(true)}>Your bag <span>{count}</span></button><button className="menu-button" aria-expanded={menu} aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button></div></header>
  <main id="main">
   <section className="campaign-hero" aria-labelledby="campaign-heading">
    <h1 id="campaign-heading" className="sr-only">Pure Nutrition. Real Energy.</h1>
    <picture>
     <source media="(max-width: 640px)" srcSet="/images/sunsu/range-portrait.webp" />
     <img src="/images/sunsu/range-wide.webp" alt="Six Sunsu drink mixes with fruit, botanicals and prepared drinks" fetchPriority="high" />
    </picture>
    <a className="button" href="#blends">Shop now <Arrow /></a>
   </section>
   <section className="campaign-benefits" aria-label="Why Sunsu">
    {[
      ['🍓', 'Real fruits'],
      ['🌿', 'No preservatives'],
      ['◇', 'No refined sugar'],
      ['🍃', 'Natural ingredients'],
      ['🥤', 'Easy to mix'],
    ].map(([icon, label]) => <div key={label}><span aria-hidden="true">{icon}</span><strong>{label}</strong></div>)}
   </section>
   <section className="section blends" id="blends"><div className="section-heading"><div><p className="kicker">FIND YOUR FAVOURITE</p><h2>SIX BLENDS.<br />SO MANY <em>MOODS.</em></h2></div><p>Bright and fruity. Rich and cocoa-y. Rooted in tradition. There’s a Sunsu for your kind of day.</p></div><div className="products">{products.map((p, i) => <article className="product" id={`blend-${p.id}`} key={p.id} style={{ '--flavour': p.colour, '--tint': p.tint } as CSSProperties}><button className="product-visual" onClick={() => setDetail(p)} aria-label={`View ${p.name}`}><span className="product-index">0{i + 1} / {p.short}</span><img className="product-campaign" src={`/images/sunsu/${p.id}-portrait.webp`} alt="" width="800" height="1200" loading="lazy"/><span className="visual-link">Meet the blend <Arrow /></span></button><div className="product-info"><h3><button onClick={() => setDetail(p)}>{p.name}</button></h3><p className="ingredients">{p.ingredients}</p><div className="product-bottom"><span>{p.pack}</span><button onClick={() => add(p.id)} aria-label={`Add ${p.name} to bag`}>Add to bag <span>+</span></button></div></div></article>)}</div><p className="range-note">Explore the blends here; confirm the complete ingredients and product details with us before ordering. </p></section>
   <FlavourShowcase add={add} />
   <FlavourMarquee />
   <MixSipScene />
   <UniverseTeaser />
   <section className="story section" id="story"><div className="story-art"><Pack id="nannari"/><span className="story-seal">FAMILIAR ROOTS.<br />FRESH RITUALS.</span></div><div className="story-copy"><p className="kicker">THE SUNSU WAY</p><h2>A LITTLE NATURE.<br />A LOT TO <em>LOVE.</em></h2><p>Some flavours take you somewhere sunny. Others bring you closer to home. Sunsu brings fruit, cocoa and familiar botanicals into a range of easy-to-use drink mixes.</p><p>From mango and pineapple to nannari and khus, each blend has its own personality. Find yours, or make room for a new favourite.</p><a href="#blends" className="text-link">Meet your next blend <Arrow /></a></div></section>
   <section className="quality"><span className="quality-symbol" aria-hidden="true">✳</span><div><p className="kicker">KNOW WHAT YOU’RE CHOOSING</p><h2>GOOD QUESTIONS.<br />CLEAR INFORMATION.</h2></div><div><p>Want to know more about a blend’s ingredients, nutrition or preparation? We’re happy to help you choose.</p><p className="small">Nutrition analysis describes tested samples. It is not a promise of health benefits. Detailed product information is available on request.</p><button className="text-link" onClick={contact}>Ask Sunsu <Arrow /></button></div></section>
   <section className="faq section" id="faq"><div><p className="kicker">BEFORE YOUR FIRST SIP</p><h2>A FEW THINGS<br />TO <em>KNOW.</em></h2></div><div className="faq-list">{[
            ['Is Sunsu a ready-to-drink juice?', 'Sunsu products are fruit and botanical drink mixes in powder form. Prepare them according to the directions on your pack.'],
            ['How do I place an order?', 'Add blends to your bag, enter your contact details and open your enquiry in WhatsApp. You choose when to send it. We will confirm price, availability and delivery before the order is final.'],
            ['Can I pay on this website?', 'There is no online payment here. Payment and delivery arrangements are confirmed directly with Sunsu on WhatsApp.'],
            ['How do I prepare and store my mix?', 'Follow the preparation and storage instructions on your product pack. Ask us if you need the directions or shelf-life information before ordering.'],
            ['Where can I see the full product information?', 'Contact us for the complete ingredients, nutrition information and any product-specific questions before you order.'],
            ['What happens to my contact details?', 'Your bag is saved on this device. Your form details are not saved by this website; they are included in a WhatsApp draft only when you choose to open it. You then decide whether to send the message.']
        ].map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
   <section className="closing"><p className="kicker">MAKE ROOM FOR YOUR NEW FAVOURITE</p><h2>WHAT’S YOUR<br /><em>SUNSU?</em></h2><a className="button light" href="#blends">Find your blend <Arrow /></a></section>
  </main>
  <footer><a className="wordmark" href="#">Sunsu<span>✳</span></a><p>PURE NUTRITION. REAL ENERGY.</p><div><a href="#blends">Explore blends</a><a href="/universe">Flavour universe</a><a href="/play">Mix &amp; play</a><button onClick={contact}>Contact Sunsu ↗</button><a href="#faq">Ordering & privacy</a></div><p className="copyright">© {new Date().getFullYear()} Sunsu · Fruit & botanical drink mixes</p></footer>
  <button className="floating-contact" onClick={contact} aria-label="Enquire with Sunsu on WhatsApp"><span aria-hidden="true">◉</span> Let’s talk</button>
  <div className="toast" role="status" key={notice} onAnimationEnd={() => setNotice('')}>{notice}</div>
  <dialog ref={dialog} className={bag ? 'sunsu-dialog bag-dialog' : 'sunsu-dialog detail-dialog'} aria-labelledby="dialog-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget)
        close(); }}><div className="dialog-inner"><button className="close-dialog" onClick={close} aria-label="Close dialog">×</button>{detail ? <div className="detail-content" style={{ '--tint': detail.tint } as CSSProperties}><div className="detail-image"><img src={`/images/sunsu/${detail.id}-wide.webp`} alt={`${detail.name} with a prepared drink and featured ingredients`}/></div><div><p className="kicker">SUNSU / {detail.short}</p><h2 id="dialog-title">{detail.name}</h2><p>{detail.note}</p><h3>Featured ingredients</h3><p className="detail-ingredients">{detail.ingredients}</p><p className="fixed-pack"><strong>{detail.pack}</strong> · Price on enquiry</p><details><summary>Preparation and storage</summary><p>Follow the directions on your pack.</p></details><details><summary>Product information</summary><p>Contact Sunsu for the complete ingredient list, nutrition information and pricing.</p></details><button className="button" onClick={() => { add(detail.id); setDetail(null); setBag(true); }}>Add to bag <span>+</span></button></div></div> : <><p className="kicker">YOUR FLAVOUR LINE-UP</p><h2 id="dialog-title">YOUR BAG <span>({count})</span></h2>{!count ? <div className="empty-bag"><span>✳</span><h3>A little empty. A lot of possibility.</h3><p>Choose a blend to start your Sunsu enquiry.</p><button className="button" onClick={() => { close(); document.getElementById('blends')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore the blends <Arrow /></button></div> : <><div className="cart-items">{cartLines(cart).map(({p,v,key,qty}) => <article className="cart-item" key={key}><Pack id={p.id}/><div><h3>{p.name}</h3><p>{v.label} · {v.price ? `${money(v.price)} each / ${money(v.price*qty)}` : 'Price on enquiry'}</p><div className="quantity"><button onClick={()=>change(key,qty-1)} aria-label={`Decrease ${p.name} ${v.label} quantity`}>−</button><span>{qty}</span><button disabled={qty>=99} onClick={()=>change(key,qty+1)} aria-label={`Increase ${p.name} ${v.label} quantity`}>+</button><button className="remove" onClick={()=>change(key,0)}>Remove</button></div></div></article>)}</div><div className="order-note"><strong>Estimated product subtotal: {money(cartTotal(cart))}{cartLines(cart).some(l=>!l.v.price) ? " plus enquiry-only items" : ""}</strong><br />Prices, availability and delivery are confirmed on WhatsApp. No payment is taken here.</div><form onSubmit={submit} onInput={() => setFormErrors([])}><h3>Let’s get in touch.</h3><div className="form-grid"><label>Your name<input name="name" aria-describedby={formErrors.length ? "enquiry-errors" : undefined} aria-invalid={formErrors.some(error => error.includes("name"))} required maxLength={100} autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label><label>Phone number<input name="phone" aria-describedby={formErrors.length ? "enquiry-errors" : undefined} aria-invalid={formErrors.some(error => error.includes("phone"))} required type="tel" title="Enter a valid phone number with 7–15 digits." maxLength={20} autoComplete="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></label><label className="full">City<input name="city" aria-describedby={formErrors.length ? "enquiry-errors" : undefined} aria-invalid={formErrors.some(error => error.includes("city"))} required maxLength={100} autoComplete="address-level2" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}/></label><label className="full">Delivery address <span>(optional)</span><textarea maxLength={500} autoComplete="street-address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/></label><label className="full">Anything else? <span>(optional)</span><textarea maxLength={500} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}/></label></div><p className="small">These details will be included in your WhatsApp draft. Review the message and press send in WhatsApp to contact us.</p>{formErrors.length > 0 && <p id="enquiry-errors" role="alert">{formErrors.join(" ")}</p>}<button disabled={!whatsappReady} type="submit" className="button checkout">Open enquiry in WhatsApp <Arrow /></button></form></>}{!whatsappReady && <p className="contact-pending" role="status">WhatsApp enquiries will be available soon. Please check back to contact Sunsu.</p>}</>}</div></dialog>
 </div>;
}
