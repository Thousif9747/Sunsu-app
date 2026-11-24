import type { Metadata } from 'next';
import { FlavourUniverse } from '@/site/components/FlavourUniverse';
export const metadata: Metadata = { title: 'The Flavour Universe | Sunsu', description: 'Explore six Sunsu fruit and botanical flavour worlds. Meet the ingredients and find your next blend.' };
export default function UniversePage() { return <FlavourUniverse />; }
