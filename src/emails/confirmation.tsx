import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

type Props = { name: string; siteUrl: string };

export function ConfirmationEmail({ name, siteUrl }: Props) {
  const first = name.split(" ")[0];
  return (
    <Html>
      <Head />
      <Preview>Thanks {first} — we&rsquo;ll be in touch soon.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Thanks, {first}.</Heading>
          <Text style={p}>
            We got your note. Someone real will read it and reply within one
            business day — usually much sooner.
          </Text>
          <Text style={p}>
            In the meantime, if anything else comes to mind, just reply to this
            email. It lands directly in our inbox.
          </Text>
          <Text style={signoff}>
            — The Great Idea CS team
            <br />
            <Link href={siteUrl} style={link}>
              greatidea-cs.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f8fafc", margin: 0, padding: "32px 0", fontFamily: "system-ui, -apple-system, sans-serif" };
const container = { backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "40px", maxWidth: "560px", margin: "0 auto" };
const h1 = { fontSize: "28px", fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 16px" };
const p = { color: "#334155", fontSize: "16px", lineHeight: "1.65", margin: "0 0 16px" };
const signoff = { color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: "32px 0 0", borderTop: "1px solid #f1f5f9", paddingTop: "16px" };
const link = { color: "#f59e0b", textDecoration: "none" };

export default ConfirmationEmail;
