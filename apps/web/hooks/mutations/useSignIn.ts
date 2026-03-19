"use client";

import { getNonce } from "@/actions/getNonce";
import { signIn } from "@/actions/signIn";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSiweMessage } from "viem/siwe";
import { useChainId, useConnection, useSignMessage } from "wagmi";

export function useSignIn() {
  const router = useRouter();

  const { address } = useConnection();

  const chainId = useChainId();

  const { mutateAsync: signMessage } = useSignMessage();

  return useMutation({
    mutationFn: async () => {
      if (!address) {
        return;
      }

      const nonce = await getNonce();

      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to LilBurn",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessage({ message });

      await signIn({ message, signature });
    },
    onSuccess: () => router.refresh(),
  });
}
