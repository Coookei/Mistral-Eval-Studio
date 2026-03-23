'use client';

import { InfoTooltip } from '@/components/dashboard/InfoTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { type ComparisonRunValues, MODELS } from '@/lib/validators';
import { type Control, type FieldPath, useWatch } from 'react-hook-form';

type Props = {
  control: Control<ComparisonRunValues>;
};

export function ConfigurationCard({ control }: Props) {
  const linkSampling = useWatch({ control, name: 'linkSampling' });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Configuration</CardTitle>
          <FormField
            control={control}
            name="linkSampling"
            render={({ field }) => (
              // FORM ITEM MUST HAVE relative or causes annoying whitespace bugs
              <FormItem className="relative flex items-center gap-2 space-y-0">
                <Label htmlFor="link-settings" className="text-sm cursor-pointer">
                  Link sampling settings
                </Label>
                <FormControl>
                  <Switch
                    id="link-settings"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="modelA"
            render={({ field }) => (
              <FormItem className="relative space-y-2">
                <div className="flex items-center">
                  <FormLabel>Config A - Model</FormLabel>
                  <InfoTooltip text="The Mistral model variant to use for Config A." />
                </div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="modelB"
            render={({ field }) => (
              <FormItem className="relative space-y-2">
                <div className="flex items-center">
                  <FormLabel>Config B - Model</FormLabel>
                  <InfoTooltip text="The Mistral model variant to use for Config B." />
                </div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-border pt-6">
          {linkSampling ? (
            <SamplingSettings control={control} prefix="sharedConfig" />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h4 className="font-medium text-sm">Config A settings</h4>
                <SamplingSettings control={control} prefix="configA" />
              </div>
              <div className="space-y-6">
                <h4 className="font-medium text-sm">Config B settings</h4>
                <SamplingSettings control={control} prefix="configB" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type SamplingPrefix = 'sharedConfig' | 'configA' | 'configB';

function SamplingSettings({
  control,
  prefix,
}: {
  control: Control<ComparisonRunValues>;
  prefix: SamplingPrefix;
}) {
  const temperatureName = `${prefix}.temperature` as FieldPath<ComparisonRunValues>;
  const topPName = `${prefix}.topP` as FieldPath<ComparisonRunValues>;
  const maxTokensName = `${prefix}.maxTokens` as FieldPath<ComparisonRunValues>;

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name={temperatureName}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FormLabel>Temperature</FormLabel>
                <InfoTooltip text="Controls randomness: lower tends to make results more focused and deterministic, higher tends to make results more creative and random." />
              </div>
              <span className="text-sm font-medium">
                {typeof field.value === 'number' ? field.value.toFixed(2) : '0.70'}
              </span>
            </div>
            <FormControl>
              <Slider
                value={[typeof field.value === 'number' ? field.value : 0]}
                onValueChange={(val) => field.onChange(val[0])}
                min={0}
                max={1}
                step={0.01}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={topPName}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FormLabel>Top P</FormLabel>
                <InfoTooltip text="Controls diversity via nucleus sampling: lower tends to make results more focused, higher tends to make results more creative." />
              </div>
              <span className="text-sm font-medium">
                {typeof field.value === 'number' ? field.value.toFixed(2) : '1.00'}
              </span>
            </div>
            <FormControl>
              <Slider
                value={[typeof field.value === 'number' ? field.value : 1]}
                onValueChange={(val) => field.onChange(val[0])}
                min={0}
                max={1}
                step={0.01}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={maxTokensName}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex items-center">
              <FormLabel>Max tokens</FormLabel>
              <InfoTooltip text="Maximum number of tokens to generate. A token is approximately 4 characters. 100 tokens correspond to roughly 75 words." />
            </div>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={4096}
                value={typeof field.value === 'number' ? field.value : 2048}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
