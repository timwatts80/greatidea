import { Client } from "@notionhq/client";
import { env } from "./env";

let _notion: Client | null = null;
function notion() {
  if (!_notion) _notion = new Client({ auth: env.NOTION_TOKEN });
  return _notion;
}

export type LeadInput = {
  name: string;
  email: string;
  businessType?: string;
  message?: string;
  source?: string;
  ip?: string | null;
};

/**
 * Create a row in the Notion Leads database.
 *
 * Expected DB schema (create these properties in Notion):
 *   - "Name"           (title)
 *   - "Email"          (email)
 *   - "Business Type"  (select)
 *   - "Message"        (rich text)
 *   - "Source"         (rich text)
 *   - "IP"             (rich text)
 *   - "Status"         (status, default "New")
 */
export async function createLead(input: LeadInput) {
  const text = (s?: string) =>
    s ? [{ type: "text" as const, text: { content: s.slice(0, 2000) } }] : [];

  return notion().pages.create({
    parent: { database_id: env.NOTION_LEADS_DB_ID },
    properties: {
      Name: { title: [{ type: "text", text: { content: input.name } }] },
      Email: { email: input.email },
      ...(input.businessType
        ? { "Business Type": { select: { name: input.businessType } } }
        : {}),
      Message: { rich_text: text(input.message) },
      Source: { rich_text: text(input.source ?? "greatidea-cs.com") },
      IP: { rich_text: text(input.ip ?? "") },
    },
  });
}
