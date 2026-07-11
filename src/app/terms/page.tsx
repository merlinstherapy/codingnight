import LegalPage, { Section } from "@/components/LegalPage";

export const metadata = { title: "Terms of Service — Mend" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <div style={{ color: "#9a958c", fontSize: 12 }}>Last updated: 11 July 2026 · DRAFT — have this reviewed by a lawyer before launch.</div>

      <Section heading="1. What Mend is (and isn't)">
        Mend turns an exercise programme prescribed to you by a qualified health professional into a
        guided follow-along experience. <b>Mend is not a medical device, does not diagnose or treat any
        condition, and is not a substitute for professional medical advice.</b> Always follow the guidance
        of your physiotherapist or doctor. If an exercise causes pain beyond mild discomfort, stop and
        consult your practitioner.
      </Section>

      <Section heading="2. Health &amp; safety disclaimer">
        You use Mend at your own risk. Exercise carries inherent risks. Do not use Mend if your
        practitioner has told you to stop exercising, or if you experience new or worsening symptoms
        such as numbness, severe pain, dizziness, or loss of bladder/bowel control — seek medical
        attention immediately. The &quot;plan adaptation&quot; feature adjusts intensity based on the
        symptoms you report; it never adds new exercises beyond what was prescribed, and it is not a
        clinical judgement.
      </Section>

      <Section heading="3. Your account">
        You are responsible for keeping your sign-in email secure. You must be 18 or older, or use Mend
        under the supervision of a parent or guardian and your prescribing practitioner.
      </Section>

      <Section heading="4. Your content">
        Prescriptions you import remain yours. You grant us a licence to process them solely to provide
        the service (e.g. extracting exercise names and dosages). We do not sell your data.
      </Section>

      <Section heading="5. Acceptable use">
        Don&apos;t reverse-engineer, resell, or misuse the service; don&apos;t upload content you have no
        right to share; don&apos;t use Mend to provide clinical services to others unless you are a
        licensed practitioner on a plan that permits it.
      </Section>

      <Section heading="6. Liability">
        To the maximum extent permitted by law, Mend and its operators are not liable for injury, loss,
        or damage arising from your use of the app. Nothing in these terms limits liability that cannot
        be limited by law.
      </Section>

      <Section heading="7. Changes & termination">
        We may update these terms; material changes will be notified in-app. You can delete your account
        at any time from Profile → Delete account, which removes your personal data as described in the
        Privacy Policy.
      </Section>

      <Section heading="8. Contact">
        Questions: support@mend.app (placeholder — replace with your real contact).
      </Section>
    </LegalPage>
  );
}
