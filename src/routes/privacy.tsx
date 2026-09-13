import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

const LAST_UPDATED = "13 September 2026";

function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Legal</p>
          <h1 className="mt-3 text-3xl text-foreground md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-neutral mt-10 max-w-none space-y-8 text-foreground prose-headings:font-sans prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Who we are</h2>
              <p>
                SkillBridge ("SkillBridge", "we", "us") is a platform that helps students map their
                skills, close gaps with free learning content, and match with internships and jobs,
                while giving colleges and industry partners visibility into cohort readiness and
                candidates. This policy explains what information we collect, how we use it, and the
                choices you have.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Information we collect</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Account information:</strong> when you sign in with Google, we receive your
                  name, email address, and profile image from Google.
                </li>
                <li>
                  <strong>Profile and skill data:</strong> information you provide, such as your role
                  (student, college, or industry), career goals, headline, skill self-ratings, and
                  assessment results.
                </li>
                <li>
                  <strong>Activity data:</strong> courses viewed, roadmaps followed, applications
                  submitted, jobs or internships posted, and applicant status changes.
                </li>
                <li>
                  <strong>Technical data:</strong> basic session information such as IP address and
                  browser user agent, used to keep your sign-in secure.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. How we use your information</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>To create and secure your account, and keep you signed in.</li>
                <li>To calculate skill gaps, recommend learning content, and score matches between candidates and opportunities.</li>
                <li>To let colleges see aggregated, cohort-level skill and placement analytics.</li>
                <li>To let industry partners review applicants who apply to roles they post.</li>
                <li>To maintain and improve the reliability and security of SkillBridge.</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. How we share information</h2>
              <p>
                Your profile and skill match information is visible to industry accounts only when
                you apply to one of their postings. Colleges see cohort-level analytics that are
                aggregated and do not expose individual assessment answers. We may share information
                with service providers who host our infrastructure (for example, our database and
                hosting provider), solely to operate the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Data retention</h2>
              <p>
                We retain your account and activity data for as long as your account is active. You
                can request deletion of your account and associated data at any time by contacting us
                using the email below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Your choices</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>You can update your profile and skill information at any time from your account.</li>
                <li>You can request a copy or deletion of your data by contacting us.</li>
                <li>You can revoke SkillBridge's access to your Google account at any time from your Google Account settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Security</h2>
              <p>
                We use industry-standard measures, including encrypted connections and authenticated
                sessions, to protect your information. No method of transmission or storage is
                completely secure, so we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. If we make material changes, we will
                update the "Last updated" date above.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Contact us</h2>
              <p>
                If you have questions about this policy or your data, contact us at{" "}
                <a className="text-primary underline" href="mailto:velloredas@gmail.com">
                  velloredas@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
