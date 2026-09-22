// Approved client testimonials. Copy is lightly condensed from each client's
// questionnaire and approved by Tim. Do not edit wording without re-approval.
//
// Rules:
// - Two beats only, always rendered with "Before" and "After" labels. Without
//   the Before label, the pain-state line reads as though we built that site.
// - The endorsement is folded into `after`; there is no third beat.
// - `beforeShort` / `afterShort` are hand-written one-liners for compact
//   layouts. Never machine-truncate the long form.
// - Quotes name the brand (Great Idea CS / "they"), never Tim personally.
//   Wording adapted from the originals; re-confirm with each client.

export type Testimonial = {
  slug: string;
  client: {
    name: string;
    firstName: string;
    title: string;
    industry: string;
  };
  before: string;
  beforeShort: string;
  after: string;
  afterShort: string;
  site: { url: string; domain: string };
};

export const testimonials: Testimonial[] = [
  {
    slug: "keith-crossley",
    client: {
      name: "Keith Crossley",
      firstName: "Keith",
      title: "Coach, author and speaker",
      industry: "coaching",
    },
    before:
      "I had a mediocre website that did not represent the caliber of work I do, nor was it designed to capture leads, emails, or sell.",
    beforeShort: "A mediocre site that did not capture leads, emails, or sell.",
    after:
      "Great Idea CS has created a beautiful site that has a robust back end. What's behind it is as important as what it looks like, and I feel my business is set up properly. They work with integrity and deliver on what they promise.",
    afterShort:
      "A beautiful site with a robust back end. My business is set up properly.",
    site: { url: "https://keithcrossley.com", domain: "keithcrossley.com" },
  },
  {
    slug: "jay-scott",
    client: {
      name: "Jay Scott",
      firstName: "Jay",
      title: "Men's coach, Unshakable Man Method",
      industry: "coaching",
    },
    before:
      "I was trying to do everything on my own, with limited capacity on both time and knowledge of how to bring my vision to life. My online presence never seemed congruent with the vision I had in my mind.",
    beforeShort: "Doing everything alone, never matching the vision in my head.",
    after:
      "Working with Great Idea CS was like having someone with the knowledge and know-how to put my vision into action. I ask for something and they are already working on completing it. They are a true partner to have.",
    afterShort:
      "Someone with the know-how to put my vision into action. A true partner.",
    site: { url: "https://jayscottcoaching.com", domain: "jayscottcoaching.com" },
  },
];
