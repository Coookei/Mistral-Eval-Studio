import { Card } from '@/components/ui/card';

export default function PrivacyComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Card className="p-8 space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you create an account,
              use our services, or communicate with us. This may include your email address,
              comparison data, and evaluation notes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to
              communicate with you, and to monitor and analyse trends and usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not share your personal information with third parties except as described in
              this policy or with your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to help protect your personal information from loss,
              theft, misuse, and unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may access, update, or delete your account information at any time. You can also
              request a copy of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
