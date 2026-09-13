import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";

export const Route = createFileRoute("/terms")({ component: TermsPage });

const LAST_UPDATED = "13 September 2026";

function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Legal</p>
          <h1 className="mt-3 text-3xl text-foreground md:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-neutral mt-10 max-w-none space-y-8 text-foreground prose-headings:font-sans prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Acceptance of terms</h2>
              <p>
                These Terms of Service ("Terms") govern your use of SkillBridge (the "Service"). By
                creating an account or otherwise using the Service, you agree to these Terms. If you
                do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Who can use SkillBridge</h2>
              <p>
                SkillBridge is intended for students, colleges, and industry partners who want to
                assess skills, share learning resources, and connect around internships and jobs. You
                must provide accurate information when creating your profile and keep it up to date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Accounts and sign-in</h2>
              <p>
                You sign in to SkillBridge using your Google account. You are responsible for
                maintaining the security of that account and for all activity that occurs under your
                SkillBridge account. Notify us promptly if you suspect unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Acceptable use</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Do not post false, misleading, or fraudulent profile, job, or applicant information.</li>
                <li>Do not use the Service to harass, discriminate against, or harm other users.</li>
                <li>Do not attempt to access accounts, data, or systems you are not authorized to access.</li>
                <li>Do not use automated means to scrape or extract data from the Service without permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Job and internship postings</h2>
              <p>
                Industry accounts are solely responsible for the accuracy and legality of the roles
                they post, and for how they handle applicant data received through the Service.
                SkillBridge does not guarantee that any posting will result in an interview, offer, or
                placement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Learning content and assessments</h2>
              <p>
                Skill assessments and match scores are provided to help guide your learning and job
                search; they are estimates and do not guarantee eligibility, employability, or
                academic outcomes. Course links may point to third-party platforms we do not control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Intellectual property</h2>
              <p>
                The Service, including its design, branding, and underlying software, is owned by
                SkillBridge or its licensors. You retain ownership of the profile content you submit,
                and you grant us a limited license to use it to operate and display it within the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Termination</h2>
              <p>
                You may stop using the Service and request account deletion at any time. We may
                suspend or terminate access to accounts that violate these Terms or that we
                reasonably believe pose a risk to the Service or its users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Disclaimers and limitation of liability</h2>
              <p>
                The Service is provided "as is" without warranties of any kind. To the maximum extent
                permitted by law, SkillBridge is not liable for indirect, incidental, or consequential
                damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Changes to these terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of the Service after
                changes take effect constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Contact us</h2>
              <p>
                Questions about these Terms can be sent to{" "}
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
