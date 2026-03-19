import type { Hex } from "viem";

export function formatHex(hex: Hex) {
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`;
}

export function formatDateUTC(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
}

export function formatNumber(value: number) {
  return parseFloat(value.toFixed(2));
}
