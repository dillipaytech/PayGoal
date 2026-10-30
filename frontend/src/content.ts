/**
 * ALL website copy and company details live in this file.
 * Edit text here; components read from it and need no changes.
 *
 * Search for "PLACEHOLDER" to find values that must be replaced
 * before going live.
 */
import {
  BadgeCheck,
  Briefcase,
  Building2,
  ChartColumn,
  CodeXml,
  Eye,
  Handshake,
  Headset,
  Lock,
  MapPin,
  MessageSquareText,
  Network,
  Rocket,
  ShieldCheck,
  Store,
  Truck,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Company                                                            */
/* ------------------------------------------------------------------ */

export const company = {
  brand: 'PayGoal',
  legalName: 'PAYGOAL BUSINESS SOLUTIONS PRIVATE LIMITED',
  gstin: '07AALCP7373D1Z6',
  address: 'Second Floor, Plot No. 5, Pocket 5, Rohini Sector 24, New Delhi, North Delhi, Delhi – 110085',
  website: 'paygoal.in',
  websiteUrl: 'https://paygoal.in',

  // PLACEHOLDER: replace with the real email address
  email: 'contact@paygoal.in',

  // PLACEHOLDER: replace with the real phone number (display + dialable form)
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneHref: 'tel:+91XXXXXXXXXX',

  // PLACEHOLDER: replace with the real WhatsApp number (digits only, with country code 91)
  whatsappHref: 'https://wa.me/91XXXXXXXXXX',

  // PLACEHOLDER: replace with real working hours
  hours: 'Monday – Saturday, 10:00 am – 6:00 pm IST',

  // Used for the embedded Google Map (no API key required)
  mapQuery: 'Plot No. 5, Pocket 5, Rohini Sector 24, New Delhi, Delhi 110085',
}

/* ------------------------------------------------------------------ */
/* Navigation                                                         */
/* ------------------------------------------------------------------ */

export const nav = {
  links: [
    { label: 'Services', href: '#services' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Contact us', href: '#contact' },
  login: { label: 'Partner login', href: '/login' },
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: 'Business solutions · India',
  // The word in `titleEmphasis` is set in italic gradient after `titleLead`.
  titleLead: 'Smart business solutions, built to',
  titleEmphasis: 'score.',
  subtitle:
    'Onboarding, technology and on-ground support that help businesses across India grow with confidence.',
  primaryCta: { label: 'Get in touch', href: '#contact' },
  secondaryCta: { label: 'Explore services', href: '#services' },
  notes: ['Registered in New Delhi', 'Pan-India partner support', 'Human help, not bots'],

  // Mock dashboard. Purely illustrative: no real names or figures.
  dashboard: {
    title: 'Partner overview',
    badge: 'Illustrative',
    chartLabel: 'Network activity',
    period: 'This quarter',
    tiles: [
      { label: 'Onboarding', value: 'On track' },
      { label: 'Support', value: 'Responsive' },
    ],
    progressLabel: 'Setup progress',
    progressText: 'Step 3 of 4',
    statuses: [
      { label: 'Retail partner · North zone', status: 'Verified', tone: 'ok' },
      { label: 'KYC documents', status: 'In review', tone: 'pending' },
      { label: 'API sandbox', status: 'Connected', tone: 'ok' },
      { label: 'Support request', status: 'Resolved', tone: 'ok' },
    ] as const,
    footnote: 'Illustrative interface. Not real data.',
  },
}

/* ------------------------------------------------------------------ */
/* Ticker                                                             */
/* ------------------------------------------------------------------ */

export const ticker = [
  'Business onboarding',
  'KYC assistance',
  'Retail network support',
  'Technology & APIs',
  'Reporting & analytics',
  'Distributor management',
  'Dedicated support',
  'Pan-India reach',
]

/* ------------------------------------------------------------------ */
/* Services                                                           */
/* ------------------------------------------------------------------ */

export type Item = { icon: LucideIcon; title: string; body: string }

export const services = {
  eyebrow: 'Services',
  title: 'Everything a growing business network needs.',
  body: 'Six focused services, delivered by one accountable team. Pick what you need today and add more as you grow.',
  items: [
    {
      icon: UserCheck,
      title: 'Business onboarding & KYC assistance',
      body: 'Guided document collection and verification support, so new partners get started quickly and correctly.',
    },
    {
      icon: Store,
      title: 'Retail network support',
      body: 'On-ground and remote help for retail outlets, from setup and training to everyday questions.',
    },
    {
      icon: CodeXml,
      title: 'Technology & API solutions',
      body: 'Clean integrations and tools that plug into the systems you already use, documented and supported.',
    },
    {
      icon: ChartColumn,
      title: 'Reporting & analytics',
      body: 'Clear, regular reports that show how your network is performing and where to focus next.',
    },
    {
      icon: Network,
      title: 'Partner & distributor management',
      body: 'Structured tools and processes to organise distributors, retailers and their relationships at scale.',
    },
    {
      icon: Headset,
      title: 'Dedicated customer support',
      body: 'A real team that knows your business, reachable by phone, email and WhatsApp during working hours.',
    },
  ] satisfies Item[],
}

/* ------------------------------------------------------------------ */
/* Who it's for                                                       */
/* ------------------------------------------------------------------ */

export const audience = {
  eyebrow: "Who it's for",
  title: 'Built for every link in the chain.',
  body: 'Whether you run a single shop or a national network, we shape our support around how you actually work.',
  items: [
    { icon: Store, title: 'Retailers', body: 'Simple setup and quick answers, so the counter keeps moving.' },
    { icon: Truck, title: 'Distributors', body: 'Visibility and tools to manage the retailers you serve.' },
    { icon: Wrench, title: 'Service centres', body: 'Reliable processes and support for walk-in customers.' },
    { icon: Briefcase, title: 'Small businesses', body: 'Enterprise-quality help without enterprise complexity.' },
    { icon: Building2, title: 'Enterprises', body: 'Integrations, reporting and a team that scales with you.' },
  ] satisfies Item[],
}

/* ------------------------------------------------------------------ */
/* Highlights (qualitative only: no statistics)                      */
/* ------------------------------------------------------------------ */

export const highlights = {
  eyebrow: 'Why PayGoal',
  title: 'Quietly reliable. Clearly accountable.',
  items: [
    {
      icon: ShieldCheck,
      title: 'Secure by design',
      body: 'Careful handling of business information is built into how we work, not added later.',
    },
    {
      icon: Zap,
      title: 'Fast onboarding',
      body: 'A clear checklist and a named contact help you get set up without back-and-forth.',
    },
    {
      icon: MapPin,
      title: 'Pan-India support',
      body: 'Headquartered in New Delhi, supporting partners in cities and towns across India.',
    },
    {
      icon: Eye,
      title: 'Transparent reporting',
      body: 'Plain-language reports and honest updates, so you always know where things stand.',
    },
  ] satisfies Item[],
}

/* ------------------------------------------------------------------ */
/* How it works                                                       */
/* ------------------------------------------------------------------ */

export const steps = {
  eyebrow: 'How it works',
  title: 'Three steps from first call to growth.',
  body: 'No long contracts to decode and no maze of departments. Just a clear path and people who follow through.',
  items: [
    {
      icon: MessageSquareText,
      title: 'Connect with us',
      body: 'Tell us about your business by phone, email or WhatsApp. We listen first and suggest what fits.',
    },
    {
      icon: BadgeCheck,
      title: 'Get onboarded',
      body: 'We guide you through documents, setup and training, with one point of contact throughout.',
    },
    {
      icon: Rocket,
      title: 'Grow with PayGoal',
      body: 'Ongoing support, reporting and new tools as your network expands. We grow when you do.',
    },
  ] satisfies Item[],
}

/* ------------------------------------------------------------------ */
/* Trust                                                              */
/* ------------------------------------------------------------------ */

export const trust = {
  eyebrow: 'Trust & privacy',
  title: 'Your information, handled with care.',
  body: 'Plain commitments about how we treat the information you share with us.',
  items: [
    {
      icon: Lock,
      title: 'Only what is needed',
      body: 'We ask only for information required to deliver a service, and we tell you why we need it.',
    },
    {
      icon: ShieldCheck,
      title: 'Never sold',
      body: 'We do not sell your information or share it with advertisers.',
    },
    {
      icon: UserCheck,
      title: 'Restricted access',
      body: 'Business information is available only to team members who need it to support you.',
    },
    {
      icon: Handshake,
      title: 'Straight talk',
      body: 'If anything changes in how we handle information, we will tell you in plain language.',
    },
  ] satisfies Item[],
  websiteNote:
    'PayGoal never asks for card details, bank passwords or OTPs on this website, and the website does not take payments. It uses no tracking scripts.',
  registrationTitle: 'Registered company',
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions, answered.',
  body: "Can't find what you're looking for? Reach out and a real person will reply.",
  items: [
    {
      q: 'What does PayGoal do?',
      a: 'PayGoal Business Solutions helps businesses and their partner networks with onboarding and KYC assistance, retail network support, technology and API solutions, reporting, distributor management and dedicated customer support.',
    },
    {
      q: 'Who can work with PayGoal?',
      a: 'Retailers, distributors, service centres, small businesses and enterprises. If you manage customers or partners and want reliable support behind you, we would be glad to talk.',
    },
    {
      q: 'How does onboarding work?',
      a: 'After a short conversation about your needs, we share a clear checklist, help you prepare the required documents and walk you through setup and training. You will have one point of contact throughout.',
    },
    {
      q: 'Do you offer technology or API integration?',
      a: 'Yes. We provide integrations and tools that connect with your existing systems, along with documentation and support from our technology team.',
    },
    {
      q: 'Where do you operate?',
      a: 'Our registered office is in Rohini Sector 24, New Delhi. We support partners across India through remote and on-ground assistance.',
    },
    {
      q: 'Does this website take payments?',
      a: 'No. The website and partner portal have no payment features, and we will never ask for card details, bank passwords or OTPs here. The contact form and partner accounts only collect the details needed to respond to you and support your business.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Contact                                                            */
/* ------------------------------------------------------------------ */

export const contact = {
  eyebrow: 'Contact',
  title: "Let's talk about your business.",
  body: 'Call, write or message us on WhatsApp. We usually reply within one working day.', // PLACEHOLDER: confirm reply time
  emailLabel: 'Email',
  phoneLabel: 'Phone',
  whatsappLabel: 'WhatsApp',
  whatsappText: 'Chat with us',
  hoursLabel: 'Working hours',
  detailsTitle: 'Company details',
  mapTitle: 'PayGoal registered office on Google Maps',

  form: {
    title: 'Send us a message',
    note: 'We use these details only to reply to you.',
    interests: ['Becoming a partner', 'Onboarding & KYC', 'Technology & APIs', 'Reporting', 'Something else'],
    submit: 'Send message',
    successTitle: 'Thank you, message received.',
    successBody: 'Our team will get back to you soon.',
  },
}

/* ------------------------------------------------------------------ */
/* Footer & legal                                                     */
/* ------------------------------------------------------------------ */

export const footer = {
  tagline: 'Smart business solutions for retailers, distributors and enterprises across India.',
  quickLinksTitle: 'Explore',
  legalTitle: 'Legal',
  companyTitle: 'Company',
}

// PLACEHOLDER: replace with policies reviewed by your legal advisor.
export const legal = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: [date]',
    paragraphs: [
      'This is placeholder text. Replace it with your final Privacy Policy before launch.',
      'This website does not use tracking cookies or analytics scripts. Partner accounts use a single essential cookie to keep you logged in.',
      'If you contact us through the contact form, email, phone or WhatsApp, we use the details you share only to respond to you and to provide the services you request.',
      'If you create a partner account, we store your name, contact details and business details to manage your account, onboarding and support requests.',
      'We do not sell personal information. For questions about privacy, write to us at the email address listed on this page.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated: [date]',
    paragraphs: [
      'This is placeholder text. Replace it with your final Terms of Use before launch.',
      'The content on this website is provided for general information about PAYGOAL BUSINESS SOLUTIONS PRIVATE LIMITED and its services. It does not constitute an offer or a contract.',
      'Illustrations on this website, including dashboard previews, are for representation only and do not show real data.',
      'All trademarks and content on this website belong to their respective owners. For any questions, please contact us.',
    ],
  },
}
