"use client";

import { Sponsor } from "@/types/Sponsor";
import { useQuery } from "@tanstack/react-query";

export function useSponsors() {
  return useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      return [
        {
          name: "CryptoFlare NFT",
          image: "/cover.png",
          description:
            "Sponsored our Q4 2025 Burn Event with 25 AVAX and provided cross-promotional marketing to their 10k+ community.",
          contribution: 25,
          url: "#",
        },
        {
          name: "BlockChain Ventures",
          image: "/cover.png",
          description:
            "Major sponsor of our Genesis Burn Event. Contributed infrastructure support and 40 AVAX to accelerate initial burn mechanics.",
          contribution: 40,
          url: "#",
        },
        {
          name: "MetaVerse Alliance",
          image: "/cover.png",
          description:
            "Strategic partner supporting our hyper-deflationary model. Sponsored monthly burn events and community engagement initiatives.",
          contribution: 18,
          url: "#",
        },
        {
          name: "DegenLabs",
          image: "/cover.png",
          description:
            "Early supporter of the Lil-Burn ecosystem. Provided technical consultation and sponsored our first community burn with 15 AVAX.",
          contribution: 15,
          url: "#",
        },
        {
          name: "Avalanche Punks",
          image: "/cover.png",
          description:
            "Partnered on cross-collection burn events. Their community helped drive initial adoption and contributed to War Chest growth.",
          contribution: 12,
          url: "#",
        },
        {
          name: "NFT Collective",
          image: "/cover.png",
          description:
            "Supporting sponsor for Q1 2026 burn initiatives. Provided marketing support and direct AVAX contributions to the War Chest.",
          contribution: 10,
          url: "#",
        },
      ] satisfies Sponsor[];
    },
  });
}
