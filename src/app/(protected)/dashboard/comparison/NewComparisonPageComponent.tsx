'use client';

import type { CompletionRequestBody } from '@/app/api/llm/complete/schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import type { CompletionResult } from '@/lib/llm/types';
import { comparisonRunSchema, type ComparisonRunValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigurationCard } from './ConfigurationCard';
import { PromptAndInstructionsCard } from './PromptAndInstructionsCard';
import { ResultsCard } from './ResultsCard';

export type RunMetrics = {
  latency: number;
  inputTokens: number;
  outputTokens: number;
  finishReason: string;
};

const DEFAULT_SAMPLING = { temperature: 0.7, topP: 1.0, maxTokens: 2048 };
const DEFAULT_INSTRUCTIONS = `Keep your response under {maxTokens} tokens. Do not exceed this limit.`;

function buildRequest(values: ComparisonRunValues, side: 'A' | 'B'): CompletionRequestBody {
  // take form values and build into a request body for the API
  const model = side === 'A' ? values.modelA : values.modelB;
  const systemPrompt = values.useSharedInstructions
    ? values.sharedInstructions
    : side === 'A'
      ? values.instructionsA
      : values.instructionsB;
  const config = values.linkSampling
    ? values.sharedConfig
    : side === 'A'
      ? values.configA
      : values.configB;

  return {
    model,
    prompt: values.prompt,
    ...(systemPrompt && { systemPrompt }), // only include if not empty
    ...config, // spread temp, topP, maxTokens at root of request
  };
}

export default function NewComparisonPageComponent() {
  const router = useRouter();

  const form = useForm<ComparisonRunValues>({
    resolver: zodResolver(comparisonRunSchema),
    defaultValues: {
      prompt: '',
      useSharedInstructions: true,
      sharedInstructions: DEFAULT_INSTRUCTIONS,
      instructionsA: DEFAULT_INSTRUCTIONS,
      instructionsB: DEFAULT_INSTRUCTIONS,
      linkSampling: true,
      modelA: 'mistral-large-latest',
      modelB: 'mistral-medium-latest',
      sharedConfig: { ...DEFAULT_SAMPLING },
      configA: { ...DEFAULT_SAMPLING },
      configB: { ...DEFAULT_SAMPLING },
    },
    mode: 'onChange',
  });

  const [hasRun, setHasRun] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  const [outputA, setOutputA] = useState('');
  const [outputB, setOutputB] = useState('');
  const [metricsA, setMetricsA] = useState<RunMetrics>({
    latency: 0,
    inputTokens: 0,
    outputTokens: 0,
    finishReason: '',
  });
  const [metricsB, setMetricsB] = useState<RunMetrics>({
    latency: 0,
    inputTokens: 0,
    outputTokens: 0,
    finishReason: '',
  });

  // isRunning is true for the duration of handleRunComparison
  const isRunning = form.formState.isSubmitting;

  const handleRunComparison = async (values: ComparisonRunValues) => {
    setErrorA(null);
    setErrorB(null);

    const [settledA, settledB] = await Promise.allSettled([
      api.post<CompletionResult>('/api/llm/complete', buildRequest(values, 'A')),
      api.post<CompletionResult>('/api/llm/complete', buildRequest(values, 'B')),
    ]);

    if (settledA.status === 'fulfilled') {
      setOutputA(settledA.value.text);
      setMetricsA({
        latency: settledA.value.latencyMs,
        inputTokens: settledA.value.usage.promptTokens,
        outputTokens: settledA.value.usage.completionTokens,
        finishReason: settledA.value.finishReason,
      });
    } else {
      setErrorA(
        settledA.reason instanceof Error ? settledA.reason.message : 'An unexpected error occurred.'
      );
    }

    if (settledB.status === 'fulfilled') {
      setOutputB(settledB.value.text);
      setMetricsB({
        latency: settledB.value.latencyMs,
        inputTokens: settledB.value.usage.promptTokens,
        outputTokens: settledB.value.usage.completionTokens,
        finishReason: settledB.value.finishReason,
      });
    } else {
      setErrorB(
        settledB.reason instanceof Error ? settledB.reason.message : 'An unexpected error occurred.'
      );
    }

    setHasRun(true);
  };

  const handleReset = () => {
    form.reset();
    setHasRun(false);
    setErrorA(null);
    setErrorB(null);
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
                ) : hasRun ? (
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
            hasRun={hasRun}
            outputA={outputA}
            outputB={outputB}
            errorA={errorA}
            errorB={errorB}
            metricsA={metricsA}
            metricsB={metricsB}
            onSaveComplete={handlePostSaveEvaluation}
          />
        </section>
      </Form>
    </TooltipProvider>
  );
}
