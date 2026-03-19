import type { ComponentType } from "react";

export type GrungeProps = {
  size?: "base" | "sm";
  icon?: ComponentType<{ className?: string }>;
  active?: boolean;
  className?: string;
};
