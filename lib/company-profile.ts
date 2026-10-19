/** Canonical LaborTrader contact addresses used in UI, SEO, and email copy. */
export const COMPANY_EMAILS = {
  support: 'support@labortraders.com',
  partners: 'partners@labortraders.com',
  investors: 'investors@labortraders.com',
  privacy: 'privacy@labortraders.com',
  legal: 'legal@labortraders.com',
  accessibility: 'accessibility@labortraders.com',
} as const;

export const COMPANY_PROFILE = {
  brandName: 'LaborTrader',
  legalName: 'LaborTrader Inc.',
  /** Primary public / support contact (Loops sender & reply-to target). */
  email: COMPANY_EMAILS.support,
  facebookUrl: 'https://facebook.com/labortraders',
  mailingAddress: {
    streetAddress: '1701 S. Main St. #2931',
    addressLocality: 'Broken Arrow',
    addressRegion: 'OK',
    postalCode: '74013',
    addressCountry: 'US',
  },
  founder: {
    name: 'Ben Randall',
    jobTitle: 'Founder and CEO',
    imagePath: '/founder/ben-randall.webp',
  },
} as const;

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/u, '');
}

export function organizationStructuredData(origin: string) {
  const siteOrigin = normalizeOrigin(origin);

  return {
    '@type': 'Organization',
    '@id': `${siteOrigin}/#organization`,
    name: COMPANY_PROFILE.brandName,
    legalName: COMPANY_PROFILE.legalName,
    url: siteOrigin,
    logo: `${siteOrigin}/brand/labortrader-mark-social.jpg`,
    email: COMPANY_PROFILE.email,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: COMPANY_EMAILS.support,
        areaServed: 'US',
        availableLanguage: ['English'],
      },
    ],
    sameAs: [COMPANY_PROFILE.facebookUrl],
    address: {
      '@type': 'PostalAddress',
      ...COMPANY_PROFILE.mailingAddress,
    },
    founder: {
      '@id': `${siteOrigin}/about#ben-randall`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  } as const;
}

export function founderStructuredData(origin: string) {
  const siteOrigin = normalizeOrigin(origin);
  const aboutUrl = `${siteOrigin}/about`;
  const founderId = `${aboutUrl}#ben-randall`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${aboutUrl}#profile-page`,
        url: aboutUrl,
        name: 'About LaborTrader and Founder Ben Randall',
        mainEntity: { '@id': founderId },
        isPartOf: { '@id': `${siteOrigin}/#website` },
      },
      {
        '@type': 'Person',
        '@id': founderId,
        name: COMPANY_PROFILE.founder.name,
        jobTitle: COMPANY_PROFILE.founder.jobTitle,
        image: `${siteOrigin}${COMPANY_PROFILE.founder.imagePath}`,
        url: aboutUrl,
        worksFor: { '@id': `${siteOrigin}/#organization` },
        description:
          'Founder and CEO of LaborTrader Inc. with 20 years of HVAC experience, including six years as an HVAC contractor and business owner.',
      },
    ],
  } as const;
}
