export type YieldEpochSummary = {
  number: number;
  startBlockNumber: number;
  startBlockTimestamp: Date;
  endBlockNumber: number | null;
  endBlockTimestamp: Date | null;
  yieldGenerated: number;
  externalRevenue: number;
  purgeTotalSpent: number;
};
