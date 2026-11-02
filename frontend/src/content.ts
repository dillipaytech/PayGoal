/**
 * ALL website copy and company details live in this file.
 * Edit text here; components read from it and need no changes.
 *
 * Search for "PLACEHOLDER" to find values that must be replaced
 * before going live.
 */
import {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  Blocks,
  ChartColumn,
  ClipboardList,
  Cloud,
  CreditCard,
  Eye,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Lock,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  PlaneTakeoff,
  Receipt,
  Rocket,
  ScanFace,
  Server,
  ShieldCheck,
  ShieldHalf,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Store,
  Tv,
  UserCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Company                                                            */
/* ------------------------------------------------------------------ */

// Terminal code shown with the PayGoal name everywhere on the site.
const TERMINAL = 'PBSTerminalS'
const BRAND = `PayGoal (${TERMINAL})`

export const company = {
  brand: BRAND,
  legalName: `PAYGOAL BUSINESS SOLUTIONS PRIVATE LIMITED (${TERMINAL})`,
  terminalCode: TERMINAL,
  address: 'Second Floor, Plot No. 5, Pocket 5, Rohini Sector 24, New Delhi, North Delhi, Delhi – 110085',
  website: 'paygoal.in',
  websiteUrl: 'https://paygoal.in',

  // Main contact: Contact Us section and footer
  email: 'admin@paygoal.in',
  phoneDisplay: '+91 93551 28299',
  phoneHref: 'tel:+919355128299',

  // WhatsApp: assumed to be the same as the main phone number. Change if different.
  whatsappHref: 'https://wa.me/919355128299',
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
  login: { label: 'User login', href: '/login' },
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
  notes: ['Registered in New Delhi', 'Pan-India user support', 'Human help, not bots'],

  // Mock dashboard. Purely illustrative: no real names or figures.
  dashboard: {
    title: 'User overview',
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
      { label: 'Business profile', status: 'Verified', tone: 'ok' },
      { label: 'Identity check', status: 'In review', tone: 'pending' },
      { label: 'Recharge & bill payments', status: 'Active', tone: 'ok' },
      { label: 'Help request', status: 'Resolved', tone: 'ok' },
    ] as const,
    footnote: 'Illustrative interface. Not real data.',
  },
}

/* ------------------------------------------------------------------ */
/* Ticker                                                             */
/* ------------------------------------------------------------------ */

export const ticker = [
  'Mobile Recharge',
  'DTH Recharge',
  'Credit Card Bill Payments',
  'Utility Bill Payments',
  'Expense Management',
  'Travel & Hotel Bookings',
  'Onboarding & Verification',
  'CRM, ERP & Hosting',
  'Reconciliation',
  'Server Management',
  'KYC Assistance',
  'Reporting & Analytics',
]

/* ------------------------------------------------------------------ */
/* Services                                                           */
/* ------------------------------------------------------------------ */

export type Item = { icon: LucideIcon; title: string; body: string }

export const services = {
  eyebrow: 'Services',
  title: 'Everything a growing business network needs.',
  body: 'From everyday recharges and bill payments to software, servers and reconciliation, delivered by one accountable team. Pick what you need today and add more as you grow.',
  items: [
    {
      icon: Smartphone,
      title: 'Mobile Recharge',
      body: 'Fast prepaid mobile recharges for all major operators across India, for retailers and their customers.',
    },
    {
      icon: Tv,
      title: 'DTH Recharge',
      body: 'Quick recharges for all leading DTH and satellite TV providers, available whenever your customers need them.',
    },
    {
      icon: CreditCard,
      title: 'Credit Card Bill Payments',
      body: 'Convenient credit card bill payments for customers of major banks, with a clear confirmation every time.',
    },
    {
      icon: Lightbulb,
      title: 'Utility Bill Payments',
      body: 'Electricity, water, gas, broadband and other utility bills, paid in one place without the queues.',
    },
    {
      icon: Receipt,
      title: 'Expense Management',
      body: 'Track, categorise and control business spending with simple tools and easy-to-read summaries.',
    },
    {
      icon: PlaneTakeoff,
      title: 'Travel & Hotel Bookings Management',
      body: 'Plan and manage business travel and hotel bookings, with every itinerary organised in one place.',
    },
    {
      icon: ScanFace,
      title: 'Onboarding & Verification Solutions',
      body: 'Identity, document and bank account verification tools that make onboarding quick and reliable.',
    },
    {
      icon: Blocks,
      title: 'Software Management, CRM, ERPs, Hosting & IT Services',
      body: 'CRM and ERP setup, software management, hosting and day-to-day IT support for your business.',
    },
    {
      icon: ArrowLeftRight,
      title: 'Backend & Reconciliation Services',
      body: 'Back-office operations and transaction reconciliation that keep your records accurate and up to date.',
    },
    {
      icon: Server,
      title: 'Server Management',
      body: 'Setup, monitoring, security updates and maintenance, so your servers stay fast, secure and online.',
    },
    {
      icon: UserCheck,
      title: 'Business Onboarding & KYC Assistance',
      body: 'Guided document collection and verification support, so new users get started quickly and correctly.',
    },
    {
      icon: ChartColumn,
      title: 'Reporting & Analytics',
      body: 'Clear, regular reports that show how your business is performing and where to focus next.',
    },
  ] satisfies Item[],
}

/* ------------------------------------------------------------------ */
/* Who it's for                                                       */
/* ------------------------------------------------------------------ */

export const audience = {
  eyebrow: 'Useful for',
  title: 'Built for businesses across industries.',
  body: 'From online stores and fintechs to NGOs and logistics teams, our services fit the way you work.',
  items: [
    { icon: ShoppingCart, title: 'E-Commerce Website Companies', body: 'Recharges, bill payments and back-office support that keep online stores running smoothly.' },
    { icon: Store, title: 'Digital Marketplace Companies', body: 'Seller onboarding, verification and reconciliation for multi-vendor platforms.' },
    { icon: Banknote, title: 'Fintech Companies', body: 'Onboarding, KYC and reconciliation services that help you scale with confidence.' },
    { icon: Landmark, title: 'NBFCs', body: 'Verification, reporting and backend operations for lending businesses.' },
    { icon: PlaneTakeoff, title: 'Travel Companies', body: 'Travel and hotel bookings management, with expenses tracked in one place.' },
    { icon: GraduationCap, title: 'Education Companies', body: 'Software, hosting and IT support for schools, institutes and ed-tech teams.' },
    { icon: Cloud, title: 'SaaS Based Companies', body: 'Server management, hosting and reconciliation for growing software products.' },
    { icon: ClipboardList, title: 'Vendor Management Companies', body: 'Onboarding, verification and expense tools to manage vendors at scale.' },
    { icon: HeartHandshake, title: 'NGOs', body: 'Simple expense management and clear reporting for your programmes.' },
    { icon: Stethoscope, title: 'Health Care & Logistics', body: 'Reliable IT, servers and back-office support for time-critical operations.' },
  ] satisfies Item[],
  more: '& Many More…',
}

/* ------------------------------------------------------------------ */
/* Highlights (qualitative only: no statistics)                      */
/* ------------------------------------------------------------------ */

export const highlights = {
  eyebrow: `Why ${BRAND}`,
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
      body: 'Headquartered in New Delhi, supporting users in cities and towns across India.',
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
      title: `Grow with ${BRAND}`,
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
    `${BRAND} never asks for card details, bank passwords or OTPs on this website, and the website does not take payments. It uses no tracking scripts.`,
  registrationTitle: 'Registered company',

  banking: {
    title: 'Our Banking',
    body: 'Banks we work with across India.',
    items: ['RBL Bank', 'AU Small Finance Bank', 'CSB Bank', 'Axis Bank', 'State Bank of India', 'HDFC Bank', 'IndusInd Bank', 'YES BANK'],
  },

  certifications: {
    title: 'Certifications & Security',
    items: [
      { icon: BadgeCheck, title: 'ISO Certified' },
      { icon: LockKeyhole, title: 'Secured Login' },
      { icon: ShieldHalf, title: 'Antivirus Enabled' },
      { icon: Rocket, title: 'Startup India' },
      { icon: ShieldCheck, title: 'SSL Secured' },
    ],
  },
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
      q: `What does ${BRAND} do?`,
      a: `PayGoal Business Solutions (${TERMINAL}) offers Mobile Recharge, DTH Recharge, Credit Card Bill Payments, Utility Bill Payments, Expense Management, Travel & Hotel Bookings Management, Onboarding & Verification Solutions, Business Onboarding & KYC Assistance, Software Management (CRM, ERPs, Hosting & IT Services), Backend & Reconciliation Services, Server Management, and Reporting & Analytics.`,
    },
    {
      q: `Who can work with ${BRAND}?`,
      a: 'E-Commerce Website Companies, Digital Marketplace Companies, Fintech Companies, NBFCs, Travel Companies, Education Companies, SaaS Based Companies, Vendor Management Companies, NGOs, Health Care & Logistics businesses, and many more. If you want reliable support behind your business, we would be glad to talk.',
    },
    {
      q: 'How does onboarding work?',
      a: 'After a short conversation about your needs, we share a clear checklist, help you prepare the required documents and walk you through setup and training. You will have one point of contact throughout.',
    },
    {
      q: 'Where do you operate?',
      a: 'Our registered office is in Rohini Sector 24, New Delhi. We support users across India through remote and on-ground assistance.',
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
  mapTitle: `${BRAND} registered office on Google Maps`,

  form: {
    title: 'Send us a message',
    note: 'We use these details only to reply to you.',
    interests: [
      'Opening a user account',
      'Recharges & Bill Payments',
      'Expense & Travel Management',
      'Onboarding & Verification',
      'Software, IT & Server Management',
      'Reconciliation & Reporting',
      'Something else',
    ],
    submit: 'Send message',
    successTitle: 'Thank you, message received.',
    successBody: 'Our team will get back to you soon.',
  },
}

/* ------------------------------------------------------------------ */
/* Footer & legal                                                     */
/* ------------------------------------------------------------------ */

export const footer = {
  tagline: 'Smart business solutions for companies across industries in India.',
  quickLinksTitle: 'Explore',
  legalTitle: 'Legal',
  companyTitle: 'Company',
}

export type LegalSection = { heading?: string; body?: string[]; list?: string[] }
export type LegalDoc = {
  title: string
  updated: string
  paragraphs?: string[]
  sections?: LegalSection[]
  /** Show the company contact block (email, website, phone) at the end. */
  contact?: boolean
}

// Have these policies reviewed by your legal advisor.
export const legal: Record<'privacy' | 'terms' | 'refund' | 'cancellation', LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 31 October 2026',
    paragraphs: [
      'This website does not use tracking cookies or analytics scripts. User accounts use a single essential cookie to keep you logged in.',
      'If you contact us through the contact form, email, phone or WhatsApp, we use the details you share only to respond to you and to provide the services you request.',
      'If you create a user account, we store your name, contact details and business details to manage your account, onboarding and support requests.',
      'We do not sell personal information. For questions about privacy, write to us at the email address listed on this page.',
    ],
    contact: true,
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated: 31 October 2026',
    paragraphs: [
      `The content on this website is provided for general information about ${company.legalName} and its services. It does not constitute an offer or a contract.`,
      'Illustrations on this website, including dashboard previews, are for representation only and do not show real data.',
      'All trademarks and content on this website belong to their respective owners. For any questions, please contact us.',
    ],
    contact: true,
  },
  refund: {
    title: 'Refund Policy',
    updated: 'Last updated: 31 October 2026',
    sections: [
      {
        heading: 'Important Notice',
        body: [
          `Once a User chooses to avail any service plan/offer announced by ${company.legalName} and agrees to buy that plan, such payment shall not be refunded by ${BRAND} under any circumstances.`,
        ],
      },
      {
        heading: 'KYC Verification',
        body: [
          `Post receipt of payment, ${BRAND} will create a User ID only after successful KYC verification. If the KYC is unsuccessful, a User ID cannot be created.`,
        ],
      },
      {
        heading: 'Refund Process',
        body: [
          `Transactions that fail due to issues directly attributable to ${BRAND} will be refunded within 3–21 working days. Only the actual transaction amount will be refunded, excluding fees.`,
          'For any queries, please contact our customer care.',
        ],
      },
    ],
    contact: true,
  },
  cancellation: {
    title: 'Cancellation Policy',
    updated: 'Last updated: 31 October 2026',
    paragraphs: [
      `${company.legalName}`,
      `Corporate Address: ${company.address}`,
      `At ${BRAND}, we take API service delivery seriously and expect clients to fully understand the scope and terms of service before activation. Please read the following:`,
    ],
    sections: [
      {
        heading: '1. No Cancellation after Activation',
        body: [
          'Once an API service has been activated, cancellations are not permitted. Clients are strongly advised to thoroughly review service documentation, technical requirements and compatibility before making any payments or proceeding with activation.',
        ],
      },
      {
        heading: '2. Contract-Based Services',
        body: [
          'For services offered under a formal contract, cancellation terms and conditions will be clearly outlined in the signed agreement. Clients must refer to their specific agreement for details regarding notice periods, penalties and refund eligibility.',
        ],
      },
      {
        heading: '3. Early Termination Fees',
        body: [
          'If a client initiates cancellation before the end of a contractual term, they may be required to pay an early termination fee as defined in their service agreement.',
        ],
      },
      {
        heading: `4. Termination by ${BRAND}`,
        body: [`${BRAND} reserves the right to suspend or terminate API services without prior notice if the client:`],
        list: [
          'Violates the Terms of Service',
          'Engages in fraudulent, illegal or unethical activities',
          'Misuses or abuses the API, affecting system performance or security',
        ],
      },
      {
        heading: '5. Refund Policy',
        body: [
          `In the event of termination due to policy violations or misuse, no refunds will be issued. In exceptional cases, refund eligibility will be determined solely at the discretion of ${company.legalName}.`,
        ],
      },
      {
        heading: '6. Final Note',
        body: [
          `By activating or integrating with ${BRAND}'s API services, clients agree to abide by this cancellation policy along with all applicable terms of use and service-level agreements.`,
          'For questions or clarification, please contact:',
        ],
      },
    ],
    contact: true,
  },
}
