// English content for insan.one. Plain, measured tone: no buzzwords, no client or competitor names.
// Payroll is "continuous", never "real-time". AI advises and never decides pay.

export default {
  lang: "en",
  dir: "ltr",
  ui: {
    skip: "Skip to main content",
    home: "insanONE home",
    menu: "Menu",
    closeMenu: "Close",
    menuTitle: "Menu",
    mainNav: "Main",
    footerNav: "Footer",
    display: "Display",
    textSize: "Text size",
    smaller: "Smaller",
    larger: "Larger",
    reset: "Reset",
    sizeNow: "Text size {n}%",
    theme: "Colour mode",
    light: "Light",
    dark: "Dark",
    contrast: "High contrast",
    themeNow: "{t} mode on",
    language: "Language",
    switchTo: "العربية",
    switchLang: "ar",
    values: "Human. Innovation. Simplicity.",
    privacy: "No cookies and no tracking. Display settings are saved in your browser only.",
    rights: "© 2026 insanONE. All rights reserved.",
    onThisPage: "On this page",
  },
  nav: [
    { slug: "", label: "Home" },
    { slug: "platform", label: "Platform" },
    { slug: "approach", label: "Approach" },
    { slug: "about", label: "About" },
    { slug: "founder", label: "Founder" },
    { slug: "contact", label: "Contact" },
  ],
  footerExtra: [{ slug: "accessibility", label: "Accessibility" }],

  pages: {
    "": {
      title: "insanONE | HR and payroll for the UAE",
      description:
        "insanONE is a UAE-native HR and payroll platform, designed from the outputs that must be right: payslips, WPS files, leave balances and end-of-service.",
      sections: [
        {
          type: "hero",
          eyebrow: "UAE-native HR and payroll",
          h1: "HR and payroll for the UAE, designed to be right.",
          lead:
            "insanONE is one platform for people, time, absence and payroll, built around UAE labour law from the start. It begins with the outputs that must be correct, and designs everything else around them.",
          ctas: [
            { label: "See the platform", slug: "platform", primary: true },
            { label: "Contact us", slug: "contact" },
          ],
          specimen: {
            label: "The outputs that come first",
            rows: [
              { k: "Payslip", v: "Gross to net, every component traced" },
              { k: "WPS", v: "SIF file generated and validated" },
              { k: "Leave", v: "Balances in calendar days, mapped to hours" },
              { k: "End of service", v: "Calculated under Federal Decree-Law No. 33 of 2021" },
              { k: "Reporting", v: "Versioned views that do not drift" },
            ],
          },
        },
        {
          type: "cards",
          h2: "Three ideas behind insanONE",
          items: [
            {
              icon: "list-checks",
              title: "Output-back design",
              text: "We define the results that must be right first. The data, rules, workflows and screens are then derived from them.",
            },
            {
              icon: "scale",
              title: "Compliance by design",
              text: "UAE rules are built into the core rather than left to configuration, so an override cannot quietly produce a non-compliant result.",
            },
            {
              icon: "refresh-cw",
              title: "Continuous payroll",
              text: "Pay is recalculated as data changes. Readiness and exceptions are visible throughout the period, not discovered at month-end.",
            },
          ],
        },
        {
          type: "modules",
          h2: "One platform for the whole employee lifecycle",
          intro: "From hire to final settlement, for HR teams, managers and employees alike.",
          items: [
            { icon: "users", title: "Core HR", text: "One trusted record for every person, checked at the point of entry." },
            { icon: "network", title: "Organisation and positions", text: "Positions, reporting lines and costs that stay clear as you change." },
            { icon: "calendar-clock", title: "Time and absence", text: "Leave, overtime and working hours that follow UAE law." },
            { icon: "wallet", title: "Payroll and WPS", text: "Deterministic payroll with a full audit trail and WPS output." },
            { icon: "file-check", title: "Documents and compliance", text: "Contracts, expiries and statutory obligations in one place." },
            { icon: "chart-column", title: "Reporting and insight", text: "Stable reporting, and checks that catch problems before payday." },
          ],
          link: { label: "Explore the platform", slug: "platform" },
        },
        {
          type: "checklist",
          h2: "Built for how the UAE works",
          intro: "Local rules are part of the core design, not an add-on.",
          items: [
            "WPS SIF file generation and validation",
            "End-of-service calculated from the law, not a spreadsheet",
            "Ramadan working hours and statutory overtime at 125% and 150%",
            "Visa, Emirates ID and passport expiry tracking",
            "Several positions for one person, with one payslip and one WPS line",
            "Federal, DIFC and ADGM employment rules",
            "English and Arabic, with a full right-to-left layout",
          ],
        },
        {
          type: "statement",
          icon: "sparkles",
          h2: "AI that advises, and never decides",
          text:
            "Insight has its own layer. It checks data before payroll, flags anomalies and explains results in plain language. Every payroll and compliance outcome stays deterministic, explainable and auditable. AI never changes pay.",
        },
        {
          type: "band",
          h2: "Where we are",
          text:
            "insanONE is in design. The data model, rules and required outputs are documented, and the platform will be built by a dedicated engineering team. We are talking to UAE employers who would like to help shape it as design partners.",
          cta: { label: "Become a design partner", slug: "contact" },
        },
      ],
    },

    platform: {
      title: "Platform | insanONE",
      description: "Core HR, organisation, time and absence, payroll and WPS, documents, self-service, reporting and insight, in one UAE-native platform.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "Platform",
          h1: "One connected record for people, time and pay",
          lead: "Each part of insanONE is designed around the outputs it must produce, and every part shares one data model.",
        },
        {
          type: "features",
          items: [
            {
              icon: "users",
              title: "Core HR and workforce",
              text: "The single source of truth for your people. Data is checked when it is entered, so problems are fixed before they reach payroll.",
              bullets: [
                "Personal, identity, passport, visa and residency records",
                "Full employment history, effective-dated",
                "Jobs, grades, pay and allowance structures",
                "Dependants and emergency contacts",
              ],
            },
            {
              icon: "network",
              title: "Organisation and positions",
              text: "Positions exist in their own right, so vacancies, reporting lines and costs stay clear as the organisation changes.",
              bullets: [
                "Position-based structures and reporting lines",
                "One person in several positions at the same time",
                "Cost centres, locations and departments",
                "A history of every change",
              ],
            },
            {
              icon: "calendar-clock",
              title: "Time and absence",
              text: "Built on UAE labour law, so entitlements follow the rules without manual interpretation.",
              bullets: [
                "Annual leave in calendar days, mapped to hours",
                "Statutory overtime at 125% and 150%",
                "Ramadan working hours",
                "Sick leave at full pay, half pay and unpaid",
                "Maternity, parental, bereavement, study and Hajj leave",
              ],
            },
            {
              icon: "wallet",
              title: "Payroll and WPS",
              text: "A deterministic payroll engine with an audit trail for every component. Pay is recalculated as data changes, so there is no month-end surprise.",
              bullets: [
                "Gross to net, with continuous calculation",
                "Back pay, joiners, leavers and final settlements",
                "End-of-service calculation",
                "WPS SIF file generation and validation",
                "Expense claims paid through payroll",
              ],
            },
            {
              icon: "file-check",
              title: "Documents and compliance",
              text: "Documents, expiry dates and statutory obligations are tracked in one place.",
              bullets: [
                "Contracts and letters generated from the record",
                "Alerts before visas, Emirates IDs and passports expire",
                "Emiratisation reporting",
                "A complete audit trail",
              ],
            },
            {
              icon: "user",
              title: "Employee and manager self-service",
              text: "Employees and managers use the same platform as HR, in English or Arabic, on any device.",
              bullets: [
                "Payslips and leave requests",
                "Approvals for managers",
                "Personal detail updates, checked before they are saved",
                "Designed for phones first, and accessible",
              ],
            },
            {
              icon: "chart-column",
              title: "Reporting and analytics",
              text: "Reporting reads from read-only, versioned views, so your figures stay stable when the platform changes.",
              bullets: [
                "Dashboards for headcount, absence and cost",
                "Power BI and similar tools connect directly",
                "Snapshots and exports that stay consistent over time",
              ],
            },
            {
              icon: "sparkles",
              title: "Insight layer",
              text: "AI and statistical checks sit in their own layer. They advise; they never decide pay.",
              bullets: [
                "Checks before each payroll",
                "Anomaly detection",
                "Plain-language payslip explanations",
                "English and Arabic translation of policies and documents",
              ],
            },
            {
              icon: "shield-check",
              title: "Security and data residency",
              text: "Personal data stays in the UAE, and security is part of the design from the start.",
              bullets: [
                "Hosted in the UAE on Microsoft Azure",
                "Strict separation between client organisations",
                "Encryption, role-based access and audit logs",
                "Aligned with ISO/IEC 27001 principles",
              ],
            },
          ],
        },
        {
          type: "band",
          h2: "See it for yourself",
          text: "We are happy to walk through the design with HR, payroll and finance teams.",
          cta: { label: "Contact us", slug: "contact" },
        },
      ],
    },

    approach: {
      title: "Approach | insanONE",
      description: "The design principles behind insanONE, and the things it will deliberately not do.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "Approach",
          h1: "Principles we design by",
          lead: "insanONE is shaped by more than twenty years of HR and payroll implementation work. These principles are design constraints, not slogans.",
        },
        {
          type: "principles",
          items: [
            {
              title: "Start from the outputs",
              text: "Most systems are built around screens and options, and correct results are expected to follow. We reverse that. Payslips, WPS files, leave balances, end-of-service, statutory reports and audit trails are defined first, and the rest of the platform is built to produce them.",
            },
            {
              title: "Compliance is part of the core",
              text: "Labour-law calculations, working time, leave, overtime, public holidays, identity and visa cycles and WPS validation are built into the platform. They are not left to each client to configure.",
            },
            {
              title: "Firm about outcomes, flexible about process",
              text: "Where a wrong setting creates risk, there are strong defaults and clear guardrails. Everywhere else, you can work your way. Guided lists are best-practice starting points that you can add to and change.",
            },
            {
              title: "Payroll that is always up to date",
              text: "Continuous payroll recalculates as data changes, so problems show up during the period while there is still time to fix them.",
            },
            {
              title: "History you can trust",
              text: "Every change is effective-dated and kept. Reports read from versioned views, so last year's numbers are the same next year.",
            },
            {
              title: "One platform for every client",
              text: "insanONE is a true multi-tenant service on a single codebase. Every client runs the same tested version, and changes in the law reach everyone at once.",
            },
            {
              title: "Accessible by default",
              text: "We design to WCAG 2.2 AA: English and Arabic with a right-to-left layout, scalable text, high-contrast display and full keyboard use.",
            },
          ],
        },
        {
          type: "boundaries",
          h2: "What insanONE will not do",
          intro: "These limits are deliberate. They protect correctness over the long term.",
          items: [
            "Run payroll for other countries. insanONE is built for the UAE only.",
            "Let anyone override statutory rules or calculations.",
            "Build separate versions of the platform for individual clients.",
            "Let AI make payroll or compliance decisions.",
            "Depend on consultants to keep working correctly.",
          ],
        },
        {
          type: "statement",
          icon: "handshake",
          h2: "How we implement",
          text: "We deliver implementations with our own team. Every client completes a successful parallel payroll run before going live.",
        },
      ],
    },

    about: {
      title: "About | insanONE",
      description: "insanONE is building HR and payroll software for the UAE, and only the UAE.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "About",
          h1: "Built in and for the UAE",
          lead: "insanONE is building HR and payroll software for the UAE, and only the UAE.",
        },
        {
          type: "prose",
          blocks: [
            {
              h2: "Why the UAE",
              paras: [
                "Labour law, WPS, visa and identity cycles, Emiratisation and bilingual operation make the UAE one of the most demanding places to run HR and payroll. It deserves a platform designed for it, rather than one adapted to it.",
              ],
            },
            {
              h2: "Who it is for",
              paras: [
                "Employers of around 300 to more than 5,000 people: private companies, free-zone employers including those in DIFC and ADGM, and government-related organisations.",
              ],
            },
            {
              h2: "How we work with clients",
              paras: [
                "insanONE is a long-term service, not a one-off installation. Clients join on multi-year agreements, use one platform that improves for everyone, and we stay responsible for its reliability.",
              ],
            },
          ],
        },
        {
          type: "values",
          h2: "Our values",
          items: [
            { title: "Human", text: "People are the reason the platform exists: the employee being paid, and the team making sure they are." },
            { title: "Innovation", text: "We use new technology where it makes pay more accurate or work simpler, never for its own sake." },
            { title: "Simplicity", text: "Fewer options, clear defaults and results you can trust. Simple to use, because the hard work is done in the design." },
          ],
        },
        {
          type: "statement",
          icon: "graduation-cap",
          h2: "Emirati talent at the centre",
          text: "We plan for around 40 per cent of our team to be Emirati, with graduate pathways supported by Nafis programmes and university partnerships. Hiring is based on merit, with a structured written assessment before CVs.",
        },
      ],
    },

    founder: {
      title: "Founder | insanONE",
      description: "Tom Hutchison founded insanONE after more than twenty years in HR and payroll technology.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "Founder",
          h1: "Tom Hutchison",
          lead: "Founder and CEO",
        },
        {
          type: "founder",
          paras: [
            "Tom has worked in HR and payroll technology for more than twenty years, and has run his own consultancy, Hutchison HR, since 2010.",
            "He has worked on more than 120 implementations for organisations with 2,000 to more than 80,000 employees, across local government, higher education, financial services, insurance and the private sector. He is often brought in to recover programmes in difficulty.",
            "Across that work he saw the same pattern: systems built for flexibility rather than correctness, compliance treated as configuration, and reporting that broke whenever the system changed. insanONE is his response: a platform designed around the results that must be right.",
          ],
          quote: "Software must tell the truth about an organisation.",
          facts: [
            { n: "20+", l: "years in HR and payroll technology" },
            { n: "120+", l: "implementations" },
            { n: "80,000+", l: "employees in the largest organisations" },
          ],
          expertiseTitle: "Areas of expertise",
          expertise: [
            "HR and payroll implementation and modernisation",
            "Data migration, validation and cutover",
            "Payroll controls, statutory outputs and compliance",
            "Time and attendance",
            "Reporting, analytics and data governance",
          ],
        },
      ],
    },

    contact: {
      title: "Contact | insanONE",
      description: "Contact insanONE about the platform, design partnership or investment.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "Contact",
          h1: "Talk to us",
          lead: "We would like to hear from HR, payroll and finance teams in the UAE, from employers interested in becoming design partners, and from investors.",
        },
        {
          type: "contact",
          items: [
            { icon: "mail", label: "Email", value: "contact@insan.one", href: "mailto:contact@insan.one" },
            { icon: "globe", label: "LinkedIn", value: "linkedin.com/company/insanone", href: "https://www.linkedin.com/company/insanone" },
          ],
          note: "Please do not send personal or payroll data by email.",
        },
      ],
    },

    accessibility: {
      title: "Accessibility | insanONE",
      description: "How to adjust this website, and our accessibility commitment.",
      sections: [
        {
          type: "pagehead",
          eyebrow: "Accessibility",
          h1: "Accessibility statement",
          lead: "We aim to meet WCAG 2.2 level AA on this website and in the insanONE platform.",
        },
        {
          type: "prose",
          blocks: [
            {
              h2: "Adjust this website",
              paras: [
                "Open the Menu to change the text size, switch between light, dark and high-contrast colour modes, or change the language between English and Arabic.",
                "Your display settings are saved in your browser only. We do not use cookies or tracking.",
              ],
            },
            {
              h2: "What you can expect",
              list: [
                "Every page works with a keyboard alone, with a visible focus indicator",
                "Pages can be zoomed to 400% without losing content",
                "Text and controls meet WCAG contrast levels in every colour mode",
                "Headings, landmarks and labels are structured for screen readers",
                "Animation is kept to a minimum and follows your reduced-motion setting",
                "Arabic pages use a right-to-left layout, while the header and menu stay in the same place",
              ],
            },
            {
              h2: "Tell us about a problem",
              paras: [
                "If something on this site does not work for you, email contact@insan.one and describe the page and the problem. We will reply and fix it.",
                "This statement was last reviewed in September 2026.",
              ],
            },
          ],
        },
      ],
    },
  },
};
