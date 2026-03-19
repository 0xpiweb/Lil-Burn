"use client";

import { signOut } from "@/actions/signOut";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => router.refresh(),
  });
}
