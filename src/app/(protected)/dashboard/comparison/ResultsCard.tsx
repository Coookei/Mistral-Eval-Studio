'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { evaluationSchema, type EvaluationValues } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Gauge, Loader2, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { RunMetrics } from './NewComparisonPageComponent';

type Props = {
  isRunning: boolean;
  hasRun: boolean;
  outputA: string;
  outputB: string;
  errorA: string | null;
  errorB: string | null;
  metricsA: RunMetrics;
  metricsB: RunMetrics;
  onSaveComplete: () => void;
};

export function ResultsCard({
  isRunning,
  hasRun,
  outputA,
  outputB,
  errorA,
  errorB,
  metricsA,
  metricsB,
  onSaveComplete,
}: Props) {
  const form = useForm<EvaluationValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { winner: '', notes: '' },
    mode: 'onChange',
  });

  const handleSaveEvaluation = async (values: EvaluationValues) => {
    // TODO call backend here to save the evaluation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Run save evaluation with:', values);

    onSaveComplete();
  };

  const isSaving = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <OutputPanel
            label="A"
            output={outputA}
            error={errorA}
            metrics={metricsA}
            isRunning={isRunning}
            hasRun={hasRun}
          />
          <OutputPanel
            label="B"
            output={outputB}
            error={errorB}
            metrics={metricsB}
            isRunning={isRunning}
            hasRun={hasRun}
          />
        </div>

        {hasRun && !errorA && !errorB && (
          <>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveEvaluation)} className="space-y-6">
                <div>
                  <h3 className="font-semibold">Evaluation</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Save your assessment of these outputs.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="winner"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Winner</FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        {(['A', 'B', 'Tie'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => field.onChange(field.value === option ? '' : option)}
                            className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
                              field.value === option
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-background text-foreground hover:border-foreground/50'
                            }`}
                          >
                            {option === 'Tie' ? 'Tie' : `Config ${option}`}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional observations or notes about this comparison..."
                          className="min-h-24"
                          {...field}
                          // maxLength={evaluationSchema.shape.notes.maxLength || undefined} // i prefer just the popup error message than cutting user off
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving evaluation...
                      </>
                    ) : (
                      'Save evaluation'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function OutputPanel({
  label,
  output,
  error,
  metrics,
  isRunning,
  hasRun,
}: {
  label: 'A' | 'B';
  output: string;
  error: string | null;
  metrics: RunMetrics;
  isRunning: boolean;
  hasRun: boolean;
}) {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Output {label}</h3>
        <Badge variant="outline">{label}</Badge>
      </div>
      <div className="flex-1 p-4 rounded-md bg-muted text-sm leading-relaxed overflow-y-auto min-h-32">
        {isRunning ? (
          <p className="text-muted-foreground">Generating...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : hasRun ? (
          output
        ) : (
          <p className="text-muted-foreground">Run a comparison to see this output.</p>
        )}
      </div>
      {hasRun && !error && !isRunning && metrics.finishReason === 'length' && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Response may be incomplete - the token limit was reached.</span>
        </div>
      )}
      {hasRun && !error && !isRunning && (
        <div className="space-y-2 border-t border-border pt-3">
          <Badge variant="secondary" className="inline-block">
            Success
          </Badge>
          <div className="flex flex-wrap gap-4 text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-default">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span>{metrics.latency}ms</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Latency: time taken to generate the response</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-default">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>{metrics.inputTokens} in</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Input tokens: tokens in the prompt sent to the model</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-default">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>{metrics.outputTokens} out</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Output tokens: tokens in the generated response</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
