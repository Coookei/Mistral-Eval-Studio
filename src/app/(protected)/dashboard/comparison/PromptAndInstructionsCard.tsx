'use client';

import { InfoTooltip } from '@/components/dashboard/InfoTooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { type ComparisonRunValues } from '@/lib/validators';
import { type Control, useWatch } from 'react-hook-form';

const EXAMPLE_PROMPTS = [
  'Explain quantum computing in simple terms for a 10-year-old',
  'Write a professional email requesting a meeting with a client',
  'Generate a creative story about a time-travelling scientist',
];

type Props = {
  control: Control<ComparisonRunValues>;
};

export function PromptAndInstructionsCard({ control }: Props) {
  const useShared = useWatch({ control, name: 'useSharedInstructions' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt &amp; instructions</CardTitle>
        <CardDescription>Sent to both configurations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FormLabel>Prompt</FormLabel>
                    <InfoTooltip text="The user message sent to both model configurations." />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {field.value.length} characters
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Enter your prompt here..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Insert example:</span>
                  <Select value="" onValueChange={(val) => field.onChange(val)}>
                    <SelectTrigger className="h-8 text-sm w-48">
                      <SelectValue placeholder="Choose example..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAMPLE_PROMPTS.map((ex, idx) => (
                        <SelectItem key={idx} value={ex}>
                          {ex.substring(0, 40)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Label>Instructions</Label>
              <InfoTooltip text="System-level guidance prepended before the prompt. Use this to set tone, persona, or constraints." />
            </div>
            <FormField
              control={control}
              name="useSharedInstructions"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <Label
                    htmlFor="use-shared"
                    className="text-sm font-normal cursor-pointer text-muted-foreground"
                  >
                    Shared
                  </Label>
                  <FormControl>
                    <Switch
                      id="use-shared"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {
              'It is recommended to include your token limit in the instructions to ensure the model does not get cut off mid response.'
            }
          </p>

          {useShared ? (
            <FormField
              control={control}
              name="sharedInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter system instructions for both configurations... (optional)"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="instructionsA"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      Config A
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Custom instructions for Config A..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="instructionsB"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      Config B
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Custom instructions for Config B..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {
              '{maxTokens} will be replaced with the max tokens value set in the configuration section below.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
