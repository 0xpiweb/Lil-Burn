import { extendTailwindMerge, twJoin } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: ["glow-border-red"],
      "border-color": ["glow-border-red"],
    },
  },
});

export { twJoin, twMerge };
