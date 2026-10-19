'use client';

import Image from 'next/image';
import {
  BadgeCheck,
  ChevronDown,
  ClipboardCheck,
  FileText,
  MapPin,
} from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from './how-it-works-profile-preview.module.css';

export type ExampleProfileRole =
  | 'worker'
  | 'independent-contractor'
  | 'service-business'
  | 'hiring-organization';

type ProfileStatus = {
  label: string;
  state: 'Verified' | 'Confirmed' | 'Required' | 'Self-reported';
};

type ProfileStat = {
  value: string;
  label: string;
};

type ProfileActivity = {
  tabLabel?: string;
  listingLabel: string;
  listingTitle: string;
  listingDetail: string;
  priceLabel: string;
  price: string;
  engagement: string;
  evidenceLabel: string;
  statuses: ProfileStatus[];
  stats: ProfileStat[];
};

type ExampleProfile = {
  name: string;
  specialty: string;
  location: string;
  overview: string;
  foundingMarket: string;
  foundingRole: string;
  skillsLabel: string;
  skills: string[];
  imageSrc: string;
  imageAlt: string;
  imageKind: 'person' | 'organization';
  primaryActivity: ProfileActivity;
  secondaryActivity?: ProfileActivity;
};

const exampleProfiles: Record<ExampleProfileRole, ExampleProfile> = {
  worker: {
    name: 'Marcus R.',
    specialty: 'HVAC Service Technician',
    location: 'Tulsa, OK · 30-mile work area',
    overview:
      'Commercial service technician focused on diagnostics, rooftop equipment, refrigeration, and controls.',
    foundingMarket: 'Oklahoma',
    foundingRole: 'Worker',
    skillsLabel: 'Skills',
    skills: [
      'Commercial HVAC',
      'Diagnostics',
      'RTUs',
      'Refrigeration',
      'Controls',
    ],
    imageSrc: '/profiles/example-worker.webp',
    imageAlt: 'Marcus R., example HVAC service technician',
    imageKind: 'person',
    primaryActivity: {
      listingLabel: 'Available for Work',
      listingTitle: 'Commercial HVAC service work',
      listingDetail: 'Weekdays · Service calls or short projects',
      priceLabel: 'Target Rate',
      price: '$34/hr',
      engagement: 'Short-term W-2',
      evidenceLabel: 'Credentials',
      statuses: [
        { label: 'EPA 608 Universal', state: 'Verified' },
        {
          label: 'Oklahoma Mechanical Journeyman',
          state: 'Verified',
        },
        { label: 'Tools and transportation', state: 'Self-reported' },
      ],
      stats: [
        { value: '4.9', label: 'Engagement rating' },
        { value: '34', label: 'Jobs completed' },
        { value: '1,284', label: 'Documented hours' },
        { value: '8', label: 'Repeat hires' },
      ],
    },
  },
  'independent-contractor': {
    name: 'Daniel O.',
    specialty: 'Licensed Electrical Contractor',
    location: 'Oklahoma City, OK · 45-mile service area',
    overview:
      'Licensed electrical contractor focused on service calls, troubleshooting, panel work, tenant finish, and small commercial projects.',
    foundingMarket: 'Oklahoma',
    foundingRole: 'Independent Contractor',
    skillsLabel: 'Skills',
    skills: [
      'Service Calls',
      'Panels',
      'Troubleshooting',
      'Tenant Finish',
      'Emergency Work',
    ],
    imageSrc: '/profiles/example-independent-contractor.webp',
    imageAlt: 'Daniel O., example licensed electrical contractor',
    imageKind: 'person',
    primaryActivity: {
      listingLabel: 'Accepting Projects',
      listingTitle: 'Service and small commercial projects',
      listingDetail: 'Flexible scheduling · Quotes by defined scope',
      priceLabel: 'Pricing',
      price: 'Quotes by scope',
      engagement: 'Independent contract',
      evidenceLabel: 'Credentials',
      statuses: [
        {
          label: 'Oklahoma Electrical Contractor License',
          state: 'Verified',
        },
        { label: 'Insurance certificate and limits', state: 'Verified' },
      ],
      stats: [
        { value: '5.0', label: 'Engagement rating' },
        { value: '48', label: 'Jobs completed' },
        { value: '2,460', label: 'Documented hours' },
        { value: '16', label: 'Repeat hires' },
      ],
    },
  },
  'service-business': {
    name: 'Redline Mechanical',
    specialty: 'HVAC and Controls Service Business',
    location: 'Tulsa, OK · Northeast Oklahoma',
    overview:
      'Commercial HVAC and controls company using one profile to offer open capacity and hire qualified help.',
    foundingMarket: 'Oklahoma',
    foundingRole: 'Service Business',
    skillsLabel: 'Services Offered',
    skills: [
      'HVAC Service',
      'Controls',
      'Preventive Maintenance',
      'Chillers',
      'Crew Capacity',
    ],
    imageSrc: '/profiles/example-service-business.webp',
    imageAlt: 'Redline Mechanical example organization mark',
    imageKind: 'organization',
    primaryActivity: {
      tabLabel: 'Providing Work',
      listingLabel: 'Available Capacity',
      listingTitle: '2 service technicians available',
      listingDetail: 'Next week · Commercial service and controls',
      priceLabel: 'Service Rate',
      price: '$105/hr per technician',
      engagement: 'Crew or defined service',
      evidenceLabel: 'Business Credentials',
      statuses: [
        { label: 'Mechanical contractor license', state: 'Verified' },
        { label: 'Insurance certificate and limits', state: 'Verified' },
      ],
      stats: [
        { value: '4.9', label: 'Provider rating' },
        { value: '46', label: 'Jobs completed' },
        { value: '97%', label: 'Completion rate' },
        { value: '5,840', label: 'Hours worked' },
      ],
    },
    secondaryActivity: {
      tabLabel: 'Hiring Help',
      listingLabel: 'Hiring Now',
      listingTitle: '1 controls technician',
      listingDetail: 'Starts in 2 weeks · Broken Arrow, OK',
      priceLabel: 'Pay Range',
      price: '$48 to $55/hr',
      engagement: 'Short-term W-2',
      evidenceLabel: 'Job Requirements and Hiring Details',
      statuses: [
        { label: 'Controls experience', state: 'Required' },
        { label: 'Valid driver license', state: 'Required' },
        { label: 'Payment method', state: 'Confirmed' },
      ],
      stats: [
        { value: '4.8', label: 'Hirer rating' },
        { value: '19', label: 'Jobs hired' },
        { value: '94%', label: 'Hire rate' },
        { value: '3,120', label: 'Hours paid' },
      ],
    },
  },
  'hiring-organization': {
    name: 'Pinnacle Facilities',
    specialty: 'Commercial Facilities Operator',
    location: 'Dallas-Fort Worth, TX',
    overview:
      'Multi-site facilities team hiring licensed trade talent for planned projects, service calls, and surge coverage.',
    foundingMarket: 'Texas',
    foundingRole: 'Hiring Organization',
    skillsLabel: 'Trades Hired',
    skills: ['HVAC', 'Electrical', 'Plumbing', 'Controls', 'Facilities'],
    imageSrc: '/profiles/example-hiring-organization.webp',
    imageAlt: 'Pinnacle Facilities example organization mark',
    imageKind: 'organization',
    primaryActivity: {
      listingLabel: 'Current Job Post',
      listingTitle: '3 journeyman electricians',
      listingDetail: '3 openings · 6 weeks · Night shift · Retail remodels',
      priceLabel: 'Pay Range',
      price: '$52 to $60/hr',
      engagement: 'Short-term W-2',
      evidenceLabel: 'Credentials and Requirements',
      statuses: [
        { label: 'Texas Journeyman Electrician', state: 'Required' },
        { label: 'OSHA 10', state: 'Required' },
        { label: 'Business identity', state: 'Verified' },
      ],
      stats: [
        { value: '4.8', label: 'Hirer rating' },
        { value: '86', label: 'Jobs posted' },
        { value: '84%', label: 'Hire rate' },
        { value: '$428K', label: 'Confirmed payments' },
      ],
    },
  },
};

function ProfileVisual({ profile }: { profile: ExampleProfile }) {
  return (
    <div className={styles.avatar} data-kind={profile.imageKind}>
      <Image
        fill
        className={
          profile.imageKind === 'organization'
            ? styles.organizationImage
            : styles.personImage
        }
        src={profile.imageSrc}
        alt={profile.imageAlt}
        sizes="(min-width: 640px) 88px, 64px"
      />
    </div>
  );
}

function StatusIcon({ state }: { state: ProfileStatus['state'] }) {
  if (state === 'Required') return <ClipboardCheck aria-hidden="true" />;
  if (state === 'Self-reported') return <FileText aria-hidden="true" />;
  return <BadgeCheck aria-hidden="true" />;
}

function ProfileStats({
  stats,
  statsId,
}: {
  stats: ProfileStat[];
  statsId: string;
}) {
  return (
    <div id={statsId} className={styles.history} aria-live="polite">
      <p className={styles.label}>Verified work history</p>
      <dl className={styles.stats}>
        {stats.map(({ value, label }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProfileActivityView({
  activity,
  activityId,
}: {
  activity: ProfileActivity;
  activityId: string;
}) {
  return (
    <div id={activityId} className={styles.activity}>
      <div className={styles.listing}>
        <p className={styles.availability}>{activity.listingLabel}</p>
        <h4>{activity.listingTitle}</h4>
        <p className={styles.listingDetail}>{activity.listingDetail}</p>
        <dl className={styles.terms}>
          <div>
            <dt>{activity.priceLabel}</dt>
            <dd>{activity.price}</dd>
          </div>
          <div>
            <dt>Engagement</dt>
            <dd>{activity.engagement}</dd>
          </div>
        </dl>
      </div>
      <div className={styles.credentials}>
        <p className={styles.label}>{activity.evidenceLabel}</p>
        <ul className={styles.statuses}>
          {activity.statuses.map(({ label, state }) => (
            <li key={`${label}-${state}`}>
              <StatusIcon state={state} />
              <span>
                <span className={styles.credentialName}>{label}</span>
                <span className={styles.credentialState}>{state}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HowItWorksProfilePreview({
  role,
}: {
  role: ExampleProfileRole;
}) {
  const profile = exampleProfiles[role];
  const activityId = useId();
  const statsId = useId();
  const [activityView, setActivityView] = useState<'primary' | 'secondary'>(
    'primary',
  );
  const activity =
    activityView === 'secondary' && profile.secondaryActivity
      ? profile.secondaryActivity
      : profile.primaryActivity;

  return (
    <section
      className={styles.profile}
      aria-label={`Illustrative ${profile.foundingRole} profile`}
    >
      <div className={styles.profileBody}>
        <p className={styles.exampleLabel}>Example profile</p>
        <div className={styles.identity}>
          <ProfileVisual profile={profile} />
          <div>
            <h3>{profile.name}</h3>
            <p className={styles.specialty}>{profile.specialty}</p>
          </div>
        </div>
        <p className={styles.location}>
          <MapPin aria-hidden="true" />
          <span>{profile.location}</span>
        </p>
        <p className={styles.overview}>{profile.overview}</p>

        {profile.secondaryActivity && (
          <fieldset className={styles.activitySwitch}>
            <legend className="sr-only">
              Service Business marketplace activity
            </legend>
            <Button
              type="button"
              variant="ghost"
              aria-pressed={activityView === 'primary'}
              aria-controls={`${statsId} ${activityId}`}
              onClick={() => setActivityView('primary')}
            >
              {profile.primaryActivity.tabLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-pressed={activityView === 'secondary'}
              aria-controls={`${statsId} ${activityId}`}
              onClick={() => setActivityView('secondary')}
            >
              {profile.secondaryActivity.tabLabel}
            </Button>
          </fieldset>
        )}

        <ProfileStats stats={activity.stats} statsId={statsId} />
        <div className={styles.skills}>
          <p className={styles.label}>{profile.skillsLabel}</p>
          <ul>
            {profile.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
      <ProfileActivityView activity={activity} activityId={activityId} />
      <details className={styles.exampleNote}>
        <summary>
          About this example
          <ChevronDown aria-hidden="true" />
        </summary>
        <p>
          Illustrative profile. Live work history, ratings, hours, and repeat
          hires come from completed marketplace engagements.
        </p>
      </details>
    </section>
  );
}
