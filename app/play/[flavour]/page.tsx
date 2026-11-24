import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/site/sunsu';
import { canonicalPlayUrl } from '@/site/explore';
import { FlavourPlay } from '@/site/components/FlavourPlay';

type Props = { params: Promise<{ flavour: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return products.map(product => ({ flavour: product.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flavour } = await params;
  const product = products.find(item => item.id === flavour);
  if (!product) return { title: 'Flavour not found | Sunsu' };
  const canonical = canonicalPlayUrl(flavour);
  return { title: `${product.name}: Mix & Play | Sunsu`, description: `Explore ${product.name} preparation, serving inspiration and a small ingredient game.`, ...(canonical ? { alternates: { canonical } } : {}) };
}
export default async function PlayFlavourPage({ params }: Props) {
  const { flavour } = await params;
  const product = products.find(item => item.id === flavour);
  if (!product) notFound();
  return <FlavourPlay product={product} />;
}
