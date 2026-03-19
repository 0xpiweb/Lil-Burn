"use client";

import { useEffect, useState } from "react";

function secondsUntil(unixSeconds: number) {
  return Math.max(0, unixSeconds - Math.floor(Date.now() / 1000));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function format(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const _seconds = seconds % 60;

  return days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
    : hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(_seconds)}`
      : `${pad(minutes)}:${pad(_seconds)}`;
}

export function useCountdown(
  startAt: number | undefined,
  onExpire?: () => void,
) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (startAt == null) {
      return;
    }

    const id = setInterval(() => {
      setTick((t) => t + 1);

      if (secondsUntil(startAt) === 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [startAt, onExpire]);

  if (startAt == null) {
    return null;
  }

  const remaining = secondsUntil(startAt);

  return remaining > 0 ? format(remaining) : null;
}
