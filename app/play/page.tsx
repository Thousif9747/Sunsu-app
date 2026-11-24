import type { Metadata } from 'next';
import { PlayDirectory } from '@/site/components/FlavourPlay';
export const metadata: Metadata = { title: 'Mix, Play & Discover | Sunsu', description: 'Choose your Sunsu blend for preparation, serving inspiration and a small ingredient discovery game.' };
export default function PlayPage() { return <PlayDirectory />; }
