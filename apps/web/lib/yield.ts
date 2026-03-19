export function computePurgeAllocation(
  yieldGenerated: number,
  externalRevenue: number,
  incomingRollover: number | null,
): number {
  return yieldGenerated * 0.8 + externalRevenue + (incomingRollover ?? 0);
}
