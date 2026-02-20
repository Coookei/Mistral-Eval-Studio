export function HowItWorks() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-center">How it works</h2>
        <div className="space-y-4 md:space-y-6">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-4">
              <div
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-sm sm:text-base"
                aria-label={`Step ${item.step}`}
              >
                {item.step}
              </div>
              <div className="pt-0.5 sm:pt-1">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { step: '1', title: 'Sign in', description: 'Create your account to get started' },
  { step: '2', title: 'Create a comparison', description: 'Set up a new evaluation experiment' },
  {
    step: '3',
    title: 'Configure A and B',
    description: 'Choose models, temperature, and parameters',
  },
  {
    step: '4',
    title: 'Run and compare results',
    description: 'Execute and review side-by-side outputs',
  },
  {
    step: '5',
    title: 'Save evaluation',
    description: 'Record winner and notes for future reference',
  },
];
