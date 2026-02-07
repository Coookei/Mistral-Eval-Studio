import { Card } from '@/components/ui/card';

export default async function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Card className="p-8 space-y-6">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Mistral Eval Studio, you accept and agree to be bound by the
              terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to use Mistral Eval Studio for personal and commercial purposes.
              This license shall automatically terminate if you violate any of these restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and for all
              activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain the availability of our service but do not guarantee
              uninterrupted access. We reserve the right to modify or discontinue the service at any
              time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Mistral Eval Studio be liable for any damages arising out of the use
              or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
