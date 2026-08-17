import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowLeft, Flame } from "lucide-react";

// TODO(legal): before publishing, replace the placeholders below with the real
// controller entity and contact details, and have this notice reviewed by a
// qualified solicitor or data protection adviser. It is a starting draft, not
// legal advice. If you appoint a DPO or an EU/UK representative, add them here.
const CONTROLLER = "[Operator legal name, e.g. Hot Or Not Pubs Ltd]";
const CONTROLLER_ADDRESS = "[Registered address]";
const CONTACT_EMAIL = "[contact@yourdomain.example]";
const LAST_UPDATED = "17 August 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Hot Or Not Pubs" },
      {
        name: "description",
        content:
          "How Hot Or Not Pubs collects and uses your personal data, the legal bases we rely on, and your rights under UK GDPR.",
      },
      { property: "og:title", content: "Privacy Notice — Hot Or Not Pubs" },
      {
        property: "og:description",
        content: "How we handle your personal data and your rights under UK GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="bg-card rounded-3xl border border-border/60 shadow-[var(--shadow-soft)] p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--burgundy)] text-cream flex items-center justify-center shrink-0">
              <Flame className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--burgundy)] leading-tight">
                Privacy Notice
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Last updated {LAST_UPDATED}</p>
            </div>
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">
            This notice explains how Hot Or Not Pubs (the <Strong>Service</Strong>) collects and
            uses personal data, and the rights you have over it. It is written to meet the UK
            General Data Protection Regulation and the Data Protection Act 2018 (together,{" "}
            <Strong>UK GDPR</Strong>), and the EU GDPR where it applies. It should be read together
            with our{" "}
            <Link
              to="/terms"
              className="text-[var(--burgundy)] underline underline-offset-4 hover:opacity-80"
            >
              Terms &amp; Conditions
            </Link>
            .
          </p>

          <Section n="1" title="Who is responsible for your data">
            <P>
              The controller of your personal data is {CONTROLLER}, {CONTROLLER_ADDRESS}. For
              anything in this notice — questions, requests, complaints — contact us at{" "}
              {CONTACT_EMAIL}. We will respond to requests about your data within one month, as UK
              GDPR requires.
            </P>
          </Section>

          <Section n="2" title="What data we collect">
            <P>We deliberately collect very little. In full:</P>
            <List>
              <li>
                <Strong>Account data.</Strong> Your email address and a hashed password if you sign
                up directly, or your email address and a provider account identifier if you sign in
                with Google or Apple. We never see your Google or Apple password.
              </li>
              <li>
                <Strong>Content you post.</Strong> Scores, comments, the date you say you visited a
                venue, and an optional display name. Each rating is linked to your account
                internally. Other users see only the score, comment, visit day and the display name
                you chose (or "Anonymous") — never your email address or account identifier.
              </li>
              <li>
                <Strong>Technical data.</Strong> When your browser talks to our servers or our
                hosting providers, standard connection information such as your IP address, browser
                type and requested pages appears in server logs, which we use for security and
                debugging. If the app crashes, an error report (the error, the page you were on and
                technical context — not your ratings or email) is sent to our platform provider's
                error monitoring.
              </li>
              <li>
                <Strong>Data stored only on your device.</Strong> Your sign-in session token, the
                list of venue pages you have previewed (to apply the free browsing limit) and your
                last map position are stored in your browser's local storage. This data stays on
                your device: we do not receive the viewed-venues list or your map position, and
                clearing your browser data removes them.
              </li>
            </List>
            <P>
              We do not collect your precise location. The map searches for venues around the area
              of the map you are looking at, not around you; we never ask your browser for your GPS
              position. We also do not collect data about you from third parties, other than the
              email address and identifier your chosen sign-in provider passes to us.
            </P>
          </Section>

          <Section n="3" title="Sensitive ('special category') data">
            <P>
              We do not ask for, and do not want, any special category data — such as data about
              your health, religion, sex life or sexual orientation. We do not analyse your ratings
              to infer anything about you, and we do not build profiles of users. Please do not put
              sensitive information about yourself (or anyone else) in comments or display names:
              anything you post is visible to other signed-in users.
            </P>
          </Section>

          <Section n="4" title="Why we use your data, and our legal bases">
            <P>UK GDPR requires a legal basis for each use of personal data. Ours are:</P>
            <List>
              <li>
                <Strong>To provide the Service</Strong> — creating and operating your account,
                publishing your ratings, applying the browse-and-unlock mechanic, and letting you
                delete your ratings. Legal basis: <Strong>performance of a contract</Strong>{" "}
                (Article 6(1)(b)) — the Terms &amp; Conditions you accept when you use the Service.
              </li>
              <li>
                <Strong>To keep the Service safe and working</Strong> — security logging, abuse and
                spam prevention, enforcing our content rules, debugging crashes. Legal basis:{" "}
                <Strong>legitimate interests</Strong> (Article 6(1)(f)) — our interest in running a
                secure, honest service. We have weighed this against your rights; the data involved
                is minimal and the processing is what users of any website would expect.
              </li>
              <li>
                <Strong>To meet legal obligations</Strong> — responding to valid requests from
                authorities, keeping records we are required to keep, and handling your data-rights
                requests. Legal basis: <Strong>legal obligation</Strong> (Article 6(1)(c)).
              </li>
            </List>
            <P>
              We do not use your data for advertising, we do not sell it, and we do not send
              marketing emails. The only emails you receive from us are operational — for example,
              confirming your address when you sign up or resetting your password. If that ever
              changes, we will ask for your consent first (Article 6(1)(a)), and you will be able to
              withdraw it at any time.
            </P>
            <P>
              We do not make automated decisions about you that have legal or similarly significant
              effects (Article 22).
            </P>
          </Section>

          <Section n="5" title="Who we share data with">
            <P>
              We do not sell or rent personal data. It is shared only with the providers that run
              the Service for us, under contracts that meet UK GDPR Article 28:
            </P>
            <List>
              <li>
                <Strong>Supabase</Strong> — hosts our database and authentication. Your account data
                and ratings live there.
              </li>
              <li>
                <Strong>Lovable</Strong> — the platform the Service is built and hosted on,
                including its error monitoring and the gateway through which venue searches reach
                Google.
              </li>
              <li>
                <Strong>Google Maps Platform</Strong> — provides the map and venue data. When the
                map loads in your browser, your browser connects directly to Google, which receives
                your IP address and acts as an independent controller under the{" "}
                <A href="https://policies.google.com/privacy">Google Privacy Policy</A>.
              </li>
              <li>
                <Strong>Google or Apple as sign-in providers</Strong>, if you choose them — they
                learn that you signed in to the Service, under their own privacy policies.
              </li>
            </List>
            <P>
              Beyond these providers, we disclose personal data only if the law requires it, to
              enforce our terms, or as part of a sale or reorganisation of the business (in which
              case this notice would continue to protect it).
            </P>
          </Section>

          <Section n="6" title="International transfers">
            <P>
              Our providers may store or process data outside the UK and the European Economic Area,
              including in the United States. Where they do, the transfer is protected by a
              safeguard recognised under UK GDPR: a UK adequacy decision (including the UK–US Data
              Bridge), the UK International Data Transfer Agreement or Addendum, or EU Standard
              Contractual Clauses with the UK addendum. You can ask us at {CONTACT_EMAIL} for
              details of the safeguard that applies to a particular provider.
            </P>
          </Section>

          <Section n="7" title="How long we keep data">
            <List>
              <li>
                <Strong>Account data</Strong> — for as long as you have an account. If you ask us to
                close it, we delete your account data within 30 days.
              </li>
              <li>
                <Strong>Ratings and comments</Strong> — until you delete them or your account is
                deleted. Deleting your account deletes your ratings with it. Aggregated venue
                statistics that no longer identify anyone may be retained.
              </li>
              <li>
                <Strong>Server logs and error reports</Strong> — kept for a short, rolling period
                for security and debugging, then deleted automatically.
              </li>
              <li>
                <Strong>Backups</Strong> — deleted data may persist in encrypted backups for a
                limited period before those backups are rotated away.
              </li>
            </List>
          </Section>

          <Section n="8" title="Your rights">
            <P>Under UK GDPR you have the right to:</P>
            <List>
              <li>
                <Strong>Access</Strong> — ask for a copy of the personal data we hold about you
                (Article 15).
              </li>
              <li>
                <Strong>Rectification</Strong> — have inaccurate data corrected (Article 16).
              </li>
              <li>
                <Strong>Erasure</Strong> — have your data deleted (Article 17). You can delete
                individual ratings yourself from the venue page, and ask us to delete your whole
                account at {CONTACT_EMAIL}.
              </li>
              <li>
                <Strong>Restriction</Strong> — ask us to pause processing while a dispute about the
                data is resolved (Article 18).
              </li>
              <li>
                <Strong>Portability</Strong> — receive the data you gave us in a structured,
                machine-readable format (Article 20).
              </li>
              <li>
                <Strong>Objection</Strong> — object to processing based on legitimate interests
                (Article 21). We will stop unless we have compelling grounds to continue.
              </li>
              <li>
                <Strong>Withdraw consent</Strong> — where processing is based on consent, withdraw
                it at any time without affecting earlier processing.
              </li>
            </List>
            <P>
              To exercise any of these, email {CONTACT_EMAIL}. Exercising them is free, and we will
              never penalise you for it. We may need to verify that you control the account before
              acting on a request.
            </P>
            <P>
              You also have the right to complain to the UK's supervisory authority, the Information
              Commissioner's Office —{" "}
              <A href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</A> or 0303
              123 1113. If you are in the EU, you may complain to your local supervisory authority
              instead. We would appreciate the chance to resolve your concern first.
            </P>
          </Section>

          <Section n="9" title="Cookies and local storage">
            <P>
              We do not use advertising or analytics cookies, and we do not use tracking
              technologies that follow you to other sites. The Service stores the following in your
              browser, all strictly necessary to make it work:
            </P>
            <List>
              <li>
                <Strong>Authentication token</Strong> — keeps you signed in between visits.
              </li>
              <li>
                <Strong>Viewed-venues list</Strong> — applies the free preview limit for guests.
              </li>
              <li>
                <Strong>Map position</Strong> — reopens the map where you left it.
              </li>
            </List>
            <P>
              Because these are strictly necessary, UK law (PECR) does not require a consent banner
              for them. Google Maps may set its own cookies when the map loads, under Google's
              policies. You can clear all of this at any time through your browser's settings; the
              Service will still work, though you will be signed out and the map will reset.
            </P>
          </Section>

          <Section n="10" title="Children">
            <P>
              The Service is for adults aged 18 and over, and we do not knowingly process data about
              anyone younger. If you believe a child has created an account, tell us at{" "}
              {CONTACT_EMAIL} and we will delete it.
            </P>
          </Section>

          <Section n="11" title="Security and breaches">
            <P>
              Data is encrypted in transit, passwords are stored only as cryptographic hashes, and
              access to the database is restricted and controlled. No system is perfectly secure,
              but if a personal data breach occurs that risks your rights, we will notify the ICO
              within 72 hours as required by Article 33 and, where the risk to you is high, tell you
              directly without undue delay.
            </P>
          </Section>

          <Section n="12" title="Changes to this notice">
            <P>
              If we change how we use personal data, we will update this notice and the date at the
              top, and for significant changes we will take reasonable steps to bring the change to
              your attention before it takes effect.
            </P>
          </Section>

          <Section n="13" title="Contact">
            <P>
              {CONTROLLER}, {CONTROLLER_ADDRESS} — {CONTACT_EMAIL}.
            </P>
          </Section>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground underline underline-offset-4">
            Terms &amp; Conditions
          </Link>
          <span className="mx-2">·</span>
          <Link to="/map" className="hover:text-foreground underline underline-offset-4">
            Back to the map
          </Link>
        </p>
      </main>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--burgundy)]">
        {n}. {title}
      </h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-foreground/80 leading-relaxed">{children}</p>;
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-5 space-y-2 text-foreground/80 leading-relaxed marker:text-[var(--coral)]">
      {children}
    </ul>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-[var(--burgundy)] underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  );
}
