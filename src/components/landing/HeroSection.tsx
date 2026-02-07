import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, Gauge, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function HeroSection() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">
            Developer tool
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Compare LLM configs side-by-side.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-lg">
            Run the same prompt with two settings, measure latency and tokens, and save human
            evaluations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/dashboard">
                Get started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="/docs">View docs</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Built with Next.js + Mistral API.</p>
        </div>

        <div className="lg:pl-8">
          <ComparisonPreviewCard />
        </div>
      </div>
    </section>
  );
}

function ComparisonPreviewCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Comparison Results</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">A</Badge>
            <Badge variant="outline">B</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <MetricDisplay icon={Gauge} label="Latency" value="342ms" />
          <MetricDisplay icon={Gauge} label="Latency" value="298ms" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MetricDisplay icon={Zap} label="Tokens" value="1,245" />
          <MetricDisplay icon={Zap} label="Tokens" value="1,189" />
        </div>
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-foreground" />
            <span className="text-sm font-medium">Winner: B</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricDisplay({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-semibold">{value}</p>
    </div>
  );
}
