export type Variant = { id:string; label:string; price?:number; mrp?:number };
export type Product = { id:string; name:string; short:string; ingredients:string; pack:string; colour:string; tint:string; note:string; variants:Variant[] };
const defs = [
['mango','Mango Energy Mix','A little sunshine','Mango · Banana · Cocoa · Dates','#b2490b','#fbe5bc'],
['berry','Berry Wellness Blend','Bright berry days','Strawberry · Lemon · Hibiscus','#a40843','#f8dce4'],
['digest','Digest Mix','Fresh meets zing','Papaya · Ginger · Lemon · Mint','#46652a','#e5edcf'],
['pineapple','Tropical Pineapple Bliss','Your tropical moment','Pineapple · Coconut','#8a5900','#f8edbd'],
['choco','Natural Choco','The cocoa kind','Banana · Dates · Cocoa · Coconut','#69351e','#ecdece'],
['nannari','Nannari Khus Heritage Cooler','Rooted in tradition','Nannari root · Khus · Lemon · Coconut water · Jaggery · Cardamom · Rose','#185c36','#dce9d5']];
// Verified 19 October 2026: https://sunsunature-3.onrender.com/api/products?limit=50
const catalogue:Record<string,number[][]>={mango:[[299,353],[599,707],[999,1179]],pineapple:[[279,329],[549,648],[949,1120]],choco:[[329,388],[649,766],[1099,1297]],berry:[[349,412],[699,825],[1199,1415]]};
const packSize: Variant = { id: '150g', label: '150 g' };
export const products: Product[] = defs.map(([id, name, short, ingredients, colour, tint]) => ({
  id, name, short, ingredients, colour, tint, pack: packSize.label,
  note: 'A powdered fruit or botanical drink mix. Follow the preparation and storage directions on the pack.',
  variants: [packSize],
}));

// Keep previously saved bags readable with their original sizes and prices.
function savedVariants(p: Product): Variant[] {
  const old = catalogue[p.id]?.map(([price, mrp], i) => ({
    id: ['100g', '250g', '500g'][i],
    label: ['100 g', '250 g', '500 g'][i],
    price, mrp,
  })) ?? [{ id: 'box', label: p.id === 'nannari' ? '50 g' : '150 g' }];
  return [...old, ...p.variants];
}
export const variants=(p:Product)=>p.variants;
export const money=(n:number)=>`₹${n.toLocaleString('en-IN')}`;
export const lineKey=(p:Product,v?:string)=>`${p.id}:${v||p.variants[0].id}`;
export type Cart=Record<string,number>;
export function cartLines(cart:Cart){return products.flatMap(p=>savedVariants(p).filter(v=>cart[lineKey(p,v.id)]).map(v=>({p,v,key:lineKey(p,v.id),qty:cart[lineKey(p,v.id)]})));}
export function cartTotal(cart:Cart){return cartLines(cart).reduce((s,l)=>s+(l.v.price||0)*l.qty,0);}
export function cleanCart(value:unknown):Cart{if(!value||typeof value!=='object'||Array.isArray(value))return {};const raw=value as Record<string,unknown>;const source=raw.version===2&&raw.items&&typeof raw.items==='object'?raw.items as Record<string,unknown>:raw;const cart:Cart={};for(const p of products)for(const v of savedVariants(p)){const key=lineKey(p,v.id);const q=source[key]??(v.id===savedVariants(p)[0].id?source[p.id]:undefined);if(typeof q==='number'&&Number.isInteger(q)&&q>0)cart[key]=Math.min(99,Math.floor(q));}return cart;}
export const whatsappNumber=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'').replace(/[+\s()-]/g,'');
export const whatsappReady=/^[1-9]\d{7,14}$/.test(whatsappNumber);
export function orderMessage(cart:Cart,details:{name:string;phone:string;city:string;address:string;note:string}){return ['Hello Sunsu! I would like to enquire about:',...cartLines(cart).map(l=>`• ${l.p.name} — ${l.v.label} — quantity ${l.qty} — ${l.v.price?`${money(l.v.price)} each / ${money(l.v.price*l.qty)} line total`:'price on enquiry'}`),`Estimated product subtotal: ${money(cartTotal(cart))}${cartLines(cart).some(l=>!l.v.price)?' plus enquiry-only items':''}`,'',`Name: ${details.name.trim()}`,`Phone: ${details.phone.trim()}`,`City: ${details.city.trim()}`,details.address.trim()&&`Address: ${details.address.trim()}`,details.note.trim()&&`Note: ${details.note.trim()}`,'Please confirm prices, availability and delivery details.'].filter(Boolean).join('\n');}
export function whatsappUrl(message:string){return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;}
export function validateDetails(d:{name:string;phone:string;city:string}):string[]{const e:string[]=[];if(!d.name.trim())e.push('Please enter your name.');const digits=d.phone.replace(/\D/g,'');if(!/^[+0-9\s()-]+$/.test(d.phone)||digits.length<7||digits.length>15)e.push('Please enter a valid phone number with 7–15 digits.');if(!d.city.trim())e.push('Please enter your city.');return e;}
