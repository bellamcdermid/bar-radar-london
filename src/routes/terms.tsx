import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowLeft, Flame } from "lucide-react";

// TODO(legal): before publishing, replace the placeholders below with the real
// operating entity and contact address, and have these terms reviewed by a
// qualified solicitor. They are a starting draft, not legal advice.
const OPERATOR = "[Operator legal name, e.g. Hot Or Not Pubs Ltd]";
const OPERATOR_ADDRESS = "[Registered address]";
const CONTACT_EMAIL = "[contact@yourdomain.example]";
const LAST_UPDATED = "17 August 2026";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Hot Or Not Pubs" },
      {
        name: "description",
        content:
          "The terms and conditions that apply when you use Hot Or Not Pubs, including the rules for posting ratings and comments.",
      },
      { property: "og:title", content: "Terms & Conditions — Hot Or Not Pubs" },
      {
        property: "og:description",
        content: "The rules for using Hot Or Not Pubs and for posting ratings and comments.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
                Terms &amp; Conditions
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Last updated {LAST_UPDATED}</p>
            </div>
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">
            Hot Or Not Pubs (the <Strong>Service</Strong>) is a crowdsourced map of London pubs and
            bars, rated by the people who drink in them. It is operated by {OPERATOR} (
            <Strong>we</Strong>, <Strong>us</Strong>, <Strong>our</Strong>). These terms are a
            contract between you and us. Please read them — they set out what you can expect from
            the Service, and what we expect from you.
          </p>

          <Section n="1" title="Accepting these terms">
            <P>
              By using the Service — browsing the map, opening a venue page, creating an account or
              posting a rating — you agree to these terms. If you do not agree with them, please do
              not use the Service.
            </P>
            <P>
              We may update these terms from time to time, for example to reflect changes to the
              Service or to the law. The version published on this page is always the current one,
              and the date above tells you when it last changed. If a change is significant, we will
              try to give you reasonable notice. Continuing to use the Service after a change means
              you accept the updated terms.
            </P>
          </Section>

          <Section n="2" title="Who can use the Service">
            <P>
              The Service is about pubs and bars, and you must be <Strong>18 or over</Strong> to use
              it. By using the Service you confirm that you are. If we believe an account belongs to
              someone under 18, we will close it.
            </P>
            <P>
              The Service is aimed at people in the United Kingdom and covers venues in London. We
              make no promise that it is appropriate or available anywhere else, and you are
              responsible for complying with your local law if you use it from elsewhere.
            </P>
          </Section>

          <Section n="3" title="Your account">
            <P>
              You can create an account with an email address and password, or by signing in with
              Google or Apple. You must give accurate details, keep your password confidential, and
              not let anyone else use your account. Tell us at {CONTACT_EMAIL} if you think someone
              else has accessed it.
            </P>
            <P>
              You are responsible for everything done through your account. One person, one account
              — please do not create additional accounts to get around a suspension, the browsing
              limit, or the rules below.
            </P>
          </Section>

          <Section n="4" title="How the Service works">
            <P>
              Venue information — names, addresses and locations — comes from Google Maps Platform
              and is cached by us. Scores and comments come entirely from other users, and are shown
              broken down by the day of the week people visited.
            </P>
            <P>
              Guests can preview a limited number of venue pages. Beyond that, you need an account,
              and posting a rating unlocks unlimited browsing. We may change these limits, the
              scoring scale, or any other part of how the Service works at any time. The Service is
              provided free of charge, and we may introduce paid features in future — if we do, we
              will tell you the price before you pay anything.
            </P>
          </Section>

          <Section n="5" title="Rules for ratings and comments">
            <P>
              The Service only works if ratings are honest and if nobody gets hurt by them. When you
              post a score, a comment or a display name, you agree to all of the following.
            </P>
            <List>
              <li>
                <Strong>Rate the crowd, never a person.</Strong> Ratings are about the general
                atmosphere and crowd at a venue on a particular day. Do not post anything that
                identifies, describes or targets an individual — no names, nicknames, social media
                handles, photos, phone numbers, job titles, or descriptions detailed enough to
                single someone out. That includes staff working at the venue.
              </li>
              <li>
                <Strong>Only rate places you have actually been to.</Strong> Post one rating per
                genuine visit, and give the real date you visited.
              </li>
              <li>
                <Strong>Nothing about children.</Strong> Never post content about, or sexualising,
                anyone under 18.
              </li>
              <li>
                <Strong>No harassment or hate.</Strong> No threats, bullying, stalking, or content
                that is abusive or discriminatory on the basis of race, ethnicity, nationality,
                religion, disability, age, sex, sexual orientation or gender identity.
              </li>
              <li>
                <Strong>No sexually explicit content</Strong>, and nothing obscene, graphically
                violent or otherwise likely to distress other users.
              </li>
              <li>
                <Strong>Nothing false or defamatory</Strong> about a venue, its owners or its staff
                — including allegations about hygiene, safety, criminality or conduct that you
                cannot stand behind.
              </li>
              <li>
                <Strong>No manipulation.</Strong> Do not post ratings to promote a venue you are
                connected with, to damage a competitor, or in exchange for payment or free drinks.
                Do not use multiple accounts, bots or scripts to inflate or deflate a score.
              </li>
              <li>
                <Strong>No spam or illegal content</Strong>, no advertising, and nothing that
                infringes someone else's rights or breaks the law.
              </li>
              <li>
                <Strong>Nothing confidential or private about someone else</Strong>, and no personal
                data about another person without a lawful basis for sharing it.
              </li>
            </List>
            <P>
              Content that breaks these rules can be removed without notice, and repeated or serious
              breaches can cost you your account.
            </P>
          </Section>

          <Section n="6" title="Content you post">
            <P>
              You keep ownership of the ratings, comments and display names you post. By posting
              them you give us a worldwide, non-exclusive, royalty-free, transferable and
              sub-licensable licence to host, store, reproduce, adapt, publish and display that
              content in connection with operating and promoting the Service — including in
              aggregate form, such as a venue's average score. This licence lasts for as long as
              your content is on the Service, plus a reasonable period afterwards for backups and
              logs.
            </P>
            <P>
              You confirm that the content is yours to post, that it is accurate as far as you know,
              and that posting it does not breach these terms or anyone else's rights.
            </P>
            <P>
              Aggregated statistics that are derived from ratings but do not identify you — such as
              average scores by day of the week — may remain on the Service after your individual
              rating is deleted.
            </P>
          </Section>

          <Section n="7" title="Moderation, reporting and removal">
            <P>
              We do not review content before it is published, and we are not obliged to monitor it.
              We may, however, remove or edit any content, hide a venue page, or suspend or close an
              account, where we reasonably believe these terms have been broken, where we are
              required to act by law, or where content risks harm to someone.
            </P>
            <P>
              If you are an individual, a venue owner or a member of staff and something on the
              Service concerns you — content about an identifiable person, a defamatory claim, a
              privacy or intellectual property complaint — email {CONTACT_EMAIL} with a link and a
              short explanation. We will review it promptly and remove anything that breaches these
              terms. Venues may also ask us to remove their listing from the map.
            </P>
            <P>
              You can delete your own ratings at any time from the venue page, and you can ask us to
              close your account and delete your content by emailing {CONTACT_EMAIL}.
            </P>
          </Section>

          <Section n="8" title="Ratings are opinions, not facts">
            <P>
              Every score and comment on the Service is one user's personal, subjective opinion
              about the crowd at a venue on one occasion. Ratings are not statements of fact, they
              are not verified by us, and they are not a judgement by us about any venue, its
              customers or its staff.
            </P>
            <P>
              Scores can be based on very few visits, can be out of date, and can be wrong. Do not
              rely on them for any decision that matters. We do not endorse any opinion expressed by
              a user.
            </P>
          </Section>

          <Section n="9" title="Venues and third-party content">
            <P>
              Venue names, addresses, map data and place identifiers are provided by Google Maps
              Platform. Your use of those parts of the Service is also subject to{" "}
              <A href="https://www.google.com/intl/en_uk/help/terms_maps/">
                Google's Maps/Google Earth Additional Terms of Service
              </A>{" "}
              and the <A href="https://policies.google.com/privacy">Google Privacy Policy</A>.
            </P>
            <P>
              Venues appear on the map because they are public places, not because they have any
              relationship with us. Listing a venue does not mean it is affiliated with, sponsors,
              endorses or approves the Service, and venue names and logos remain the property of
              their owners.
            </P>
            <P>
              The Service also links to and relies on other third-party services. We are not
              responsible for third-party sites or services, and their terms apply to your use of
              them.
            </P>
          </Section>

          <Section n="10" title="Your safety">
            <P>
              The Service tells you what other people thought of a crowd. It does not vet anyone.
              Meeting people you do not know carries risk, and you are responsible for your own
              safety and behaviour when you go out. Drink responsibly, respect the venues you visit
              and the people in them, and follow venue and licensing rules.
            </P>
            <P>
              Nothing on the Service is an invitation to approach, follow, photograph or pursue
              anyone. If you feel unsafe, contact the venue's staff or the emergency services.
            </P>
          </Section>

          <Section n="11" title="Acceptable use of the Service itself">
            <P>You agree not to:</P>
            <List>
              <li>
                scrape, crawl, harvest or bulk-download content, or use bots or automated tools with
                the Service, except for search engines obeying our robots file;
              </li>
              <li>
                copy, resell or redistribute the Service or its content, or use it to build a
                competing product or dataset;
              </li>
              <li>
                interfere with the Service, its security or its infrastructure, attempt to gain
                unauthorised access to any account or system, or introduce malicious code;
              </li>
              <li>
                reverse engineer or decompile any part of the Service, except where the law says you
                may; or
              </li>
              <li>use the Service for anything unlawful.</li>
            </List>
          </Section>

          <Section n="12" title="Our intellectual property">
            <P>
              We own or licence everything in the Service other than user content and third-party
              content — including the name, branding, design, text and software. You may use the
              Service for your own personal, non-commercial use, and nothing in these terms
              transfers any of our rights to you.
            </P>
          </Section>

          <Section n="13" title="Your personal data">
            <P>
              How we collect and use personal data — what we hold, the legal bases we rely on, who
              we share it with, how long we keep it, and your rights under UK GDPR — is set out in
              our{" "}
              <Link
                to="/privacy"
                className="text-[var(--burgundy)] underline underline-offset-4 hover:opacity-80"
              >
                Privacy Notice
              </Link>
              , which forms part of these terms.
            </P>
            <P>
              Bear in mind that ratings, comments and display names are visible to other signed-in
              users. Do not put anything in them that you would not want seen — including your own
              contact details.
            </P>
          </Section>

          <Section n="14" title="Availability of the Service">
            <P>
              We aim to keep the Service running, but we do not promise it will be uninterrupted,
              error-free or secure. We may suspend, withdraw or restrict all or part of it for
              maintenance, for business reasons, or permanently. The Service is provided free of
              charge and is offered on an "as is" and "as available" basis.
            </P>
          </Section>

          <Section n="15" title="Suspension and ending these terms">
            <P>
              You may stop using the Service and close your account at any time. We may suspend or
              close your account, or stop providing the Service to you, if you break these terms, if
              we are required to by law, or if we stop operating the Service. Sections that by their
              nature should survive — including the content licence, disclaimers, liability limits
              and governing law — continue to apply after these terms end.
            </P>
          </Section>

          <Section n="16" title="Our liability to you">
            <P>
              Nothing in these terms limits or excludes our liability for death or personal injury
              caused by our negligence, for fraud or fraudulent misrepresentation, or for anything
              else that cannot lawfully be limited or excluded. If you are a consumer, you have
              legal rights that these terms do not affect.
            </P>
            <P>
              Subject to that, we are not liable for any loss or damage that was not foreseeable, or
              for loss of profit, business, goodwill, opportunity or data. In particular we are not
              liable for: the accuracy of any user-generated rating or comment; anything that
              happens to you at a venue or with anyone you meet; the acts or omissions of other
              users, venues or third-party services; or your use of the Service for any business
              purpose.
            </P>
            <P>
              Where our liability cannot lawfully be excluded, our total liability to you in
              connection with the Service is limited to £100, reflecting the fact that the Service
              is provided free of charge.
            </P>
          </Section>

          <Section n="17" title="If you use the Service for business">
            <P>
              If you are not using the Service as a consumer, you agree to indemnify us against any
              claims, losses and reasonable costs arising from your use of the Service or your
              breach of these terms.
            </P>
          </Section>

          <Section n="18" title="Other important terms">
            <P>
              We may transfer our rights and obligations under these terms to another organisation,
              for example if our business is sold; your rights under these terms will not be
              affected. You may not transfer yours without our written consent.
            </P>
            <P>
              These terms are the entire agreement between us about the Service. If any part of them
              is found to be unlawful or unenforceable, the rest of them continue to apply. If we
              delay in enforcing a term, that does not stop us enforcing it later. Nobody other than
              you and us has any right to enforce these terms.
            </P>
          </Section>

          <Section n="19" title="Governing law">
            <P>
              These terms are governed by the law of England and Wales, and disputes about them can
              be brought in the courts of England and Wales. If you are a consumer living elsewhere
              in the UK, you may also bring proceedings in your local courts.
            </P>
          </Section>

          <Section n="20" title="Contact us">
            <P>
              Questions, complaints and removal requests: {CONTACT_EMAIL}. Our registered address is{" "}
              {OPERATOR_ADDRESS}.
            </P>
          </Section>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
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
