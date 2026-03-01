'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { comparisonRunSchema, type ComparisonRunValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigurationCard } from './ConfigurationCard';
import { PromptAndInstructionsCard } from './PromptAndInstructionsCard';
import { ResultsCard } from './ResultsCard';

export type RunMetrics = { latency: number; inputTokens: number; outputTokens: number };

const DEFAULT_SAMPLING = { temperature: 0.7, topP: 1.0, maxTokens: 2048 };

export default function NewComparisonPageComponent() {
  const router = useRouter();

  const form = useForm<ComparisonRunValues>({
    resolver: zodResolver(comparisonRunSchema),
    defaultValues: {
      prompt: '',
      useSharedInstructions: true,
      sharedInstructions: '',
      instructionsA: '',
      instructionsB: '',
      linkSampling: true,
      modelA: 'mistral-large',
      modelB: 'mistral-medium',
      sharedConfig: { ...DEFAULT_SAMPLING },
      configA: { ...DEFAULT_SAMPLING },
      configB: { ...DEFAULT_SAMPLING },
    },
    mode: 'onChange',
  });

  const [hasResults, setHasResults] = useState(false);
  const [outputA, setOutputA] = useState('');
  const [outputB, setOutputB] = useState('');
  const [metricsA, setMetricsA] = useState<RunMetrics>({
    latency: 0,
    inputTokens: 0,
    outputTokens: 0,
  });
  const [metricsB, setMetricsB] = useState<RunMetrics>({
    latency: 0,
    inputTokens: 0,
    outputTokens: 0,
  });

  const isRunning = form.formState.isSubmitting;

  const handleRunComparison = async (values: ComparisonRunValues) => {
    console.log('Run comparison with:', values);

    // TODO call backend with values to run the comparison
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // TODO replace with real outputs and metrics from the backend below
    setOutputA('llm output a');
    setOutputB('llm outpput b');
    // todo replace with real metrics from the backend below
    setMetricsA({ latency: 342, inputTokens: 45, outputTokens: 128 });
    setMetricsB({ latency: 298, inputTokens: 45, outputTokens: 95 });

    setHasResults(true);
  };

  const handleReset = () => {
    form.reset();
    setHasResults(false);
    setOutputA('');
    setOutputB('');
  };

  const handlePostSaveEvaluation = () => {
    // this runs after the ResultsCard have completed saving the evaluation

    router.push('/dashboard/comparison/1'); // TODO replace with real id from backend after saving evaluation
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <section className="space-y-6">
          <form onSubmit={form.handleSubmit(handleRunComparison)} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">New comparison</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Run the same prompt with two different configurations.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="bg-transparent"
                >
                  Reset
                </Button>
              </div>
            </div>

            <PromptAndInstructionsCard control={form.control} />

            <ConfigurationCard control={form.control} />

            <div className="flex justify-end">
              <Button type="submit" disabled={!form.formState.isValid || isRunning}>
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : hasResults ? (
                  'Rerun comparison'
                ) : (
                  'Run comparison'
                )}
              </Button>
            </div>
          </form>

          {/* <ResultsCard> is outside the <form> to avoid html error of nested forms */}
          <ResultsCard
            isRunning={isRunning}
            hasResults={hasResults}
            outputA={outputA}
            outputB={outputB}
            metricsA={metricsA}
            metricsB={metricsB}
            onSaveComplete={handlePostSaveEvaluation}
          />
        </section>
      </Form>
    </TooltipProvider>
  );
}
