import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Impact } from '@/components/sections/Impact';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Impact />
      <Contact />
    </main>
  );
}
