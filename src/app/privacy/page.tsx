import LegalPage, { Section } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — Mend" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <div style={{ color: "#9a958c", fontSize: 12 }}>Last updated: 11 July 2026 · DRAFT — have this reviewed by a lawyer before launch.</div>

      <Section heading="1. What we collect">
        <b>Account:</b> your email address.<br />
        <b>Health data you choose to log:</b> daily pain level, tension areas, stiffness, and completed
        exercise sessions. This is sensitive personal data — we collect it only with your explicit
        consent, given when you create an account.<br />
        <b>Imported prescriptions:</b> photos/text of exercise handouts you upload, and the structured
        exercise list extracted from them.
      </Section>

      <Section heading="2. How we use it">
        Solely to provide the service: building your routine, adapting daily intensity, and showing your
        progress. We do <b>not</b> sell your data, use it for advertising, or share it with third parties
        except the processors below.
      </Section>

      <Section heading="3. Where it lives">
        Data is stored in Supabase (our database provider) with row-level security so only your
        authenticated account can read your records. Data is encrypted in transit (TLS) and at rest.
      </Section>

      <Section heading="4. Processors">
        Supabase (database &amp; authentication), Vercel (hosting). If prescription import uses an AI
        service to read your handout, the image is processed transiently and not used to train models.
      </Section>

      <Section heading="5. Retention & deletion">
        Your data is kept while your account is active. Deleting your account permanently removes your
        profile, check-ins, sessions, and routines within 30 days.
      </Section>

      <Section heading="6. Your rights">
        You may access, correct, export, or delete your data at any time. Contact us or use the in-app
        controls. Depending on your region (e.g. GDPR, PDPO in Hong Kong), you may have additional
        rights, which we honour.
      </Section>

      <Section heading="7. Contact">
        Data questions: privacy@mend.app (placeholder — replace with your real contact).
      </Section>
    </LegalPage>
  );
}
