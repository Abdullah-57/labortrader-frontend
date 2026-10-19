import 'server-only';

/**
 * Frontend-experiment stub. The full site reads a verified participant session
 * from the database; here we always return null so the homepage stays generic.
 */
export type ConfirmedParticipantMarket = Readonly<{
  canonicalMarketId: string;
  city: string;
  state: string;
  marketName: string;
}>;

export async function getConfirmedParticipantMarket(): Promise<ConfirmedParticipantMarket | null> {
  return null;
}
