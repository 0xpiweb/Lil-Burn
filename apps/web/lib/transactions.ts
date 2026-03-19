import type { ToastContext } from "@/types/ToastContext";
import type { Hex } from "viem";
import type { Config } from "wagmi";
import { waitForTransactionReceipt, watchBlockNumber } from "wagmi/actions";

const CONFIRMATIONS = 4;

export async function trackTransaction(
  config: Config,
  hash: Hex | Hex[],
  { addToast, updateToast }: ToastContext,
) {
  const hashes = Array.isArray(hash) ? hash : [hash];

  const counts = new Array(hashes.length).fill(1);

  const toastId = addToast({
    status: "submitted",
    message: `Confirmations (1/${CONFIRMATIONS})`,
    transactionHash: hashes[0],
  });

  try {
    await Promise.all(
      hashes.map((hash, i) =>
        waitForConfirmations(config, hash, CONFIRMATIONS, (current, total) => {
          counts[i] = current;

          updateToast(toastId, {
            message: `Confirmations (${Math.min(...counts)}/${total})`,
          });
        }),
      ),
    );

    updateToast(toastId, {
      status: "success",
      message: "Transaction confirmed",
    });
  } catch (error) {
    updateToast(toastId, { status: "error", message: "Transaction failed" });

    throw error;
  }
}

async function waitForConfirmations(
  config: Config,
  hash: Hex,
  confirmations: number,
  onProgress?: (current: number, total: number) => void,
) {
  const { blockNumber: receiptBlockNumber } = await waitForTransactionReceipt(
    config,
    { hash },
  );

  onProgress?.(1, confirmations);

  if (confirmations <= 1) {
    return;
  }

  return new Promise<void>((resolve) => {
    const unwatch = watchBlockNumber(config, {
      onBlockNumber(blockNumber) {
        const count = Number(blockNumber - receiptBlockNumber) + 1;

        onProgress?.(Math.min(count, confirmations), confirmations);

        if (count >= confirmations) {
          unwatch();
          resolve();
        }
      },
    });
  });
}
