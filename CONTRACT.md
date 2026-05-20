# API Contract — Great Idea CS

> **Audience:** anyone (or any tool — including Figma Make) wiring the
> `greatidea-cs.com` front-end to this Next.js API. Endpoints and payloads
> defined here are the source of truth.

- **API base URL:** `https://api.greatidea-cs.com`
- **Front-end origins allowed (CORS):**
  `https://greatidea-cs.com`, `https://www.greatidea-cs.com`
- **Versioning:** all endpoints live under `/v1/`. Breaking changes get `/v2/`.
- **Content type:** all requests + responses use `application/json` unless noted.

---

## 1. `POST /v1/contact` — submit the contact form

Creates a lead. Sends a notification email to the team and a confirmation email
to the sender. Also writes a row to the Notion CRM.

### Request

```http
POST https://api.greatidea-cs.com/v1/contact
Content-Type: application/json

{
  "name": "string (1–100)",
  "email": "string (valid email)",
  "business_type": "Real estate | Coach | Fitness | Creator | Other",  // optional
  "message": "string (≤ 2000 chars)",                                  // optional
  "turnstile_token": "string (from Cloudflare Turnstile widget)"
}
```

### Responses

| Status | Body | Meaning |
|---|---|---|
| `200` | `{ "ok": true, "id": "msg_xxx" \| null }` | Lead accepted. `id` is the Resend message id. |
| `400` | `{ "ok": false, "errors": { "<field>": "<msg>" } }` | Validation failed. Render errors next to fields. |
| `400` | `{ "ok": false, "error": "spam_check_failed" }` | Turnstile rejected the token. Reset the widget. |
| `400` | `{ "ok": false, "error": "invalid_json" }` | Request body wasn't valid JSON. |
| `429` | `{ "ok": false, "error": "rate_limited" }` | Too many submissions from this IP. Wait 10 min. |
| `502` | `{ "ok": false, "error": "email_failed" }` | Server couldn't deliver the notification. Ask user to email directly. |

---

## 2. `GET /v1/content/hero` — fetch editable hero content

Returns the editable hero subheader. No edge cache — admin edits reflect on the very next request.

### Request

```http
GET https://api.greatidea-cs.com/v1/content/hero
```

### Response — `200`

```json
{
  "subheader": "Custom AI solutions powered by Claude for creative projects, business workflows, and digital innovation. From intelligent automation to cutting-edge interactive experiences."
}
```

Currently only the subheader is API-driven. The hero headline + cycling rotation are owned by Make (hardcoded in the component). If KV has no stored value, the API returns a fallback.

---

## 3. `PATCH /v1/content/hero` — update hero subheader (admin)

Updates the subheader in KV. Partial updates allowed.

### Request

```http
PATCH https://api.greatidea-cs.com/v1/content/hero
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "subheader": "New subheader text here."
}
```

### Responses

| Status | Body |
|---|---|
| `200` | `{ "ok": true, "hero": { "subheader": "..." } }` |
| `400` | `{ "ok": false, "errors": { "<field>": "<msg>" } }` |
| `401` | `{ "ok": false, "error": "unauthorized" }` |

### cURL example

```bash
curl -X PATCH https://api.greatidea-cs.com/v1/content/hero \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subheader":"New subheader text here."}'
```

---

# Prompts to paste into Figma Make

These are written to be pasted **verbatim** into Figma Make as feature prompts.
Update the placeholders (`TURNSTILE_SITE_KEY`) before pasting.

## Prompt A — wire the contact form

> Add a contact form to the closing CTA section. Fields:
> - **Name** (text input, required)
> - **Email** (email input, required)
> - **Type of business** (select with options: Real estate, Coach, Fitness, Creator, Other) — optional
> - **Message** (textarea) — optional
>
> Include a Cloudflare Turnstile widget below the form (sitekey: `TURNSTILE_SITE_KEY_HERE`). Use the official `@marsidev/react-turnstile` library or load `https://challenges.cloudflare.com/turnstile/v0/api.js` and render the widget. Store the token in state.
>
> On submit, POST as `application/json` to `https://api.greatidea-cs.com/v1/contact` with this body:
>
> ```json
> {
>   "name": "<name>",
>   "email": "<email>",
>   "business_type": "<businessType or omit>",
>   "message": "<message or omit>",
>   "turnstile_token": "<token>"
> }
> ```
>
> Handle responses:
> - `200` with `{ ok: true }` → show success state: "Thanks — we'll be in touch within one business day." Hide the form.
> - `400` with `{ ok: false, errors: {...} }` → render each error under its corresponding field.
> - `400` with `{ ok: false, error: "spam_check_failed" }` → reset the Turnstile widget and show "Please complete the spam check and try again."
> - `429` → show "Too many submissions. Please wait a few minutes."
> - `502` or network error → show "Something went wrong. Please email hello@greatidea-cs.com directly."
>
> Disable the submit button and show a small spinner while the request is in-flight. Use the existing button styling from the site.

## Prompt B — make the hero phrases API-driven

> Update the hero section so its 3 text phrases (eyebrow / headline / subheader, or whatever the design calls for) are fetched at render time from `https://api.greatidea-cs.com/v1/content/hero`.
>
> Response shape:
> ```json
> { "phrase1": "string", "phrase2": "string", "phrase3": "string" }
> ```
>
> Mapping for the current design:
> - **phrase1** → the small eyebrow label above the main headline
> - **phrase2** → the main hero headline
> - **phrase3** → the subheader paragraph beneath the headline
>
> Behavior:
> - On mount, `fetch` the endpoint and render each phrase in its slot.
> - While loading, render the current hard-coded text as fallback (do **not** show a loading spinner — the existing text should appear instantly and be replaced when the fetch resolves).
> - If the fetch errors, keep the fallback text. Do not throw or show an error to the user.
> - Cache the response in `sessionStorage` under the key `hero-content` so navigations within the session don't re-fetch.
> - **Important:** if `?admin=1` is in the URL, skip the `sessionStorage` cache and always fetch fresh, so edits made via the admin card show immediately.

## Prompt C — floating admin card for editing hero text

> Add a floating admin card that lets the site owner edit the 3 hero phrases without touching code.
>
> **Visibility / trigger:**
> - The card is hidden by default.
> - Show it only when the URL has `?admin=1` (e.g., `https://greatidea-cs.com/?admin=1`).
> - Render it as a fixed-position card in the **bottom-right** corner of the viewport, with a soft drop shadow, rounded corners, and the same visual language as the rest of the site. Max width: 360px. Should sit above all other content (`z-index` high).
>
> **Card layout (top to bottom):**
> 1. **Header row:** title "Edit Hero" on the left, a small × close button on the right that hides the card (until the page is reloaded with `?admin=1` again).
> 2. **Admin token input** — password-type input, label "Admin token". Helper text below: "Saved in your browser only." On first load, check `localStorage.adminToken`; if it exists, pre-fill the input. On every change, save to `localStorage.adminToken`.
> 3. **Three text inputs** for the phrases:
>     - Label "Phrase 1 (eyebrow)" — single-line input
>     - Label "Phrase 2 (headline)" — single-line input
>     - Label "Phrase 3 (subheader)" — multi-line textarea (3 rows)
> 4. **Update button** — full-width, primary style.
> 5. **Status area** below the button — empty by default; renders inline success or error messages after each submit attempt.
>
> **Behavior:**
> - On mount, `GET https://api.greatidea-cs.com/v1/content/hero` and pre-populate the 3 phrase inputs with the returned values. If the fetch fails, leave the inputs blank (so the user can still write fresh values).
> - On clicking **Update**:
>   - Validate: all 3 phrase fields non-empty, admin token present. If not, show an inline error and don't submit.
>   - Disable the button and show "Updating…" while in flight.
>   - `PATCH https://api.greatidea-cs.com/v1/content/hero` with:
>     ```
>     Headers:
>       Authorization: Bearer <admin token from input>
>       Content-Type: application/json
>     Body:
>       { "phrase1": "...", "phrase2": "...", "phrase3": "..." }
>     ```
>   - On `200`: show green success message "Saved. Reload the page to see changes." Include a "Reload now" link that calls `window.location.reload()`.
>   - On `401`: show red error "Invalid admin token."
>   - On `400` with `errors`: show each field error inline under its input.
>   - On any other error: show red "Something went wrong — please try again."
>
> **Styling notes:**
> - Use the existing site fonts and colors. The card should feel native to the brand, not bolted on. Add subtle backdrop blur on the card background.
> - The card itself is purely a tool — keep it clean and functional, no decorative flourishes.

---

# Operations

## Updating hero text (you, manually)

```bash
ADMIN_TOKEN=<from-vercel-env>
curl -X PATCH https://api.greatidea-cs.com/v1/content/hero \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"headline":"New text here"}'
```

Cache TTL is 60s, so the Make site picks up the new text within a minute.

## Rate-limit reset

If a real user gets rate-limited during testing, clear the KV key:
```bash
# From a script with KV credentials
await kv.del("rl:contact:<their-ip>")
```

## Adding a new editable field (later)

1. Add the field + Zod validation to `app/api/v1/content/hero/route.ts`.
2. Update the `FALLBACK` constant with a default value.
3. Prompt Make to fetch + render the new field.
