'use client';

import { Card } from '@/components/ui/card';
import type { MouseEvent } from 'react';

export default function DocsComponent() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        <DocsNav />

        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to the Mistral Eval Studio documentation!
            </p>
            <p className="pt-4 text-md text-muted-foreground">
              Please note that the documentation is currently incomplete.
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <h2 id="introduction" className="text-2xl font-semibold scroll-mt-24">
              What is Mistral Eval Studio?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Mistral Eval Studio is a developer dashboard for running the same prompt through two
              different LLM configurations (A/B), comparing outputs side-by-side, and saving human
              evaluations with winner selection and notes.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 id="how-comparisons-work" className="text-2xl font-semibold scroll-mt-24">
              How comparisons work
            </h2>
            <p className="text-muted-foreground leading-relaxed">Each comparison consists of:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>A shared prompt (system + user or simple)</li>
              <li>Two configurations (A and B) with model, temperature, and max tokens</li>
              <li>Output results with latency and token metrics</li>
              <li>Human evaluation with winner selection and optional notes</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 id="running-locally" className="text-2xl font-semibold scroll-mt-24">
              Running locally
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Clone the repository and install dependencies:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
              pnpm install
              <br />
              pnpm run dev
            </pre>
            <p className="text-muted-foreground leading-relaxed">
              The application will be available at http://localhost:3000
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

const docsSections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-comparisons-work', label: 'How comparisons work' },
  { id: 'running-locally', label: 'Running locally' },
];

function DocsNav() {
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <aside className="space-y-2">
      <h3 className="font-semibold mb-4">Documentation</h3>
      <nav className="space-y-1">
        {docsSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(event) => handleNavClick(event, section.id)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
