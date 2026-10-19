import { Children, isValidElement, type ReactNode } from 'react';
import { serializeJsonLd } from './breadcrumb-json-ld';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const questions: Array<{ question: string; answer: ReactNode }> = [
  {
    question: 'What is LaborTrader?',
    answer: (
      <p>
        LaborTrader connects skilled people and businesses with the people who
        hire them. Choose W-2 help through SkillCraft Staffing, independent
        contractors, or service businesses.
      </p>
    ),
  },
  {
    question: 'When does my market open?',
    answer: (
      <p>
        Oklahoma is scheduled to open in February 2027. Additional states will
        follow as local supply and demand are ready. Pre-register now and we
        will notify you when your market opens.
      </p>
    ),
  },
  {
    question: 'What is the minimum W-2 engagement?',
    answer: (
      <p>
        W-2 engagements start at eight hours, with a $200 minimum. Review worker
        pay and any provider charges in the engagement quote before agreeing to
        the work.
      </p>
    ),
  },
  {
    question: 'Who can pre-register?',
    answer: (
      <p>
        Workers, contractors, service businesses, and hiring organizations use
        participant registration. Clients have a separate project-owner path.
        Staffing and payroll providers use partner inquiries.{' '}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/early-access"
        >
          Choose a participant role
        </Link>
        {' or '}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/for-clients#client-preregistration"
        >
          pre-register as a Client or Project Owner
        </Link>
        .
      </p>
    ),
  },
  {
    question: 'Where will LaborTrader launch?',
    answer: (
      <p>
        We are building markets nationwide, with outreach focused on Oklahoma,
        Texas, and Florida. Markets open when there are enough people offering
        and hiring skilled work to make the marketplace useful.
      </p>
    ),
  },
  {
    question: 'What happens when I pre-register?',
    answer: (
      <p>
        You join the launch list for your role, specialty, and state. Basic
        pre-registration counts toward public signup totals immediately,
        including before email confirmation. Finish your detailed profile and
        required verification for free-use eligibility and launch.
      </p>
    ),
  },
  {
    question: 'What does the pre-registration launch benefit include?',
    answer: (
      <p>
        Pre-register before launch for up to 90 days of eligible platform use:
        up to $500 for workers, contractors, and clients, or $1,000 for
        businesses and hiring organizations. Your benefit starts after
        verification and approval when your market and account go live. It ends
        when the time or cap runs out. There is no monthly membership fee.{' '}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/launch-benefits"
        >
          See launch benefit details
        </Link>
        .
      </p>
    ),
  },
  {
    question: 'What does client access cost?',
    answer: (
      <p>
        Client accounts have no monthly fee. Pre-register before your market
        opens for up to 90 days of platform use, capped at $500, starting after
        verification, approval, and launch. After the benefit ends, job posts
        cost $10; any contract fee is shown before both sides agree. Provider
        pay and other project costs are separate.{' '}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/terms#launch-benefit-and-marketplace-charges"
        >
          Read the offer terms
        </Link>
        .
      </p>
    ),
  },
  {
    question: 'How will matching work?',
    answer: (
      <p>
        Match by specialty, credentials, availability, location, and engagement
        type. Review the fit and agree on terms before work begins.
      </p>
    ),
  },
  {
    question: 'How will credentials and user-provided details be handled?',
    answer: (
      <p>
        Contact checks confirm email and phone ownership. Professional
        credentials receive a verified label after manual review. Rates,
        availability, tools, and other profile details remain labeled as
        self-reported.
      </p>
    ),
  },
  {
    question: 'Is LaborTrader a staffing agency or employer?',
    answer: (
      <p>
        LaborTrader is the marketplace. SkillCraft Staffing provides the W-2
        staffing path and handles the employment arrangement for those
        assignments. Independent contractors and service businesses use their
        own engagement paths. Other staffing providers can reach us through the{' '}
        <Link
          className="font-bold underline underline-offset-4"
          href="/partners#partner-inquiry"
        >
          partners form
        </Link>
        .
      </p>
    ),
  },
  {
    question: 'What do referrals earn?',
    answer: (
      <p>
        Each new account that joins through your link and completes verification
        adds 10 days to your eligible platform-use period. Your dollar cap stays
        the same. Referral benefits have no cash value.{' '}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/referrals"
        >
          See referral rules
        </Link>
        .
      </p>
    ),
  },
  {
    question: 'Are partner and investor inquiries pre-registration?',
    answer: (
      <p>
        No. Use marketplace pre-registration to join as a participant or client.
        Partner and investor inquiries start separate conversations.
      </p>
    ),
  },
];

function answerText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number')
        return String(child);
      if (isValidElement<{ children?: ReactNode }>(child))
        return answerText(child.props.children);
      return '';
    })
    .join('');
}

export function faqStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerText(answer).replace(/\s+/gu, ' ').trim(),
      },
    })),
  };
}

export function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqStructuredData()) }}
    />
  );
}

export function FaqList() {
  return (
    <div className="min-w-0 border-t border-foreground/16">
      {questions.map((item) => (
        <details
          key={item.question}
          className="group min-w-0 border-b border-foreground/16"
        >
          <summary className="grid min-h-14 cursor-pointer list-none lt-accordion-title items-center gap-3 py-5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring">
            <h3 className="min-w-0 text-lg font-semibold tracking-[-0.03em] sm:text-xl">
              {item.question}
            </h3>
            <ChevronDown
              className="size-5 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="min-w-0 space-y-4 pb-7 lt-accordion-body text-sm leading-7 text-foreground ">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
