import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  email: string;
  businessType?: string;
  message?: string;
  ip?: string | null;
  receivedAt: string;
};

export function NotificationEmail({
  name,
  email,
  businessType,
  message,
  ip,
  receivedAt,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New lead: {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>New lead — {name}</Heading>
          <Text style={meta}>{receivedAt}</Text>

          <Section style={card}>
            <Row label="Name" value={name} />
            <Row label="Email" value={email} href={`mailto:${email}`} />
            {businessType && <Row label="Business" value={businessType} />}
            {message && (
              <>
                <Hr style={hr} />
                <Text style={msgLabel}>Message</Text>
                <Text style={msgBody}>{message}</Text>
              </>
            )}
          </Section>

          {ip && <Text style={footer}>IP: {ip}</Text>}
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Text style={row}>
      <span style={rowLabel}>{label}</span>{" "}
      {href ? (
        <Link href={href} style={rowValueLink}>
          {value}
        </Link>
      ) : (
        <span style={rowValue}>{value}</span>
      )}
    </Text>
  );
}

const body = { backgroundColor: "#f8fafc", margin: 0, padding: "32px 0", fontFamily: "system-ui, -apple-system, sans-serif" };
const container = { backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "32px", maxWidth: "560px", margin: "0 auto" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" };
const meta = { color: "#64748b", fontSize: "13px", margin: "0 0 24px" };
const card = { borderTop: "1px solid #f1f5f9", paddingTop: "16px" };
const row = { fontSize: "15px", lineHeight: "1.6", margin: "0 0 8px" };
const rowLabel = { color: "#64748b", display: "inline-block", width: "80px" };
const rowValue = { color: "#0f172a" };
const rowValueLink = { color: "#f59e0b", textDecoration: "none" };
const hr = { border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" };
const msgLabel = { color: "#64748b", fontSize: "13px", margin: "0 0 4px" };
const msgBody = { color: "#0f172a", fontSize: "15px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" as const };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const, margin: "24px 0 0" };

export default NotificationEmail;
