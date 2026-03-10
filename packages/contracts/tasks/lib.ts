import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { type Abi, type Address, getAddress } from "viem";

async function resolveContract(name: string) {
  const { network } = await import("hardhat");

  const { viem, networkName, networkConfig } = await network.connect();

  const explorer = networkConfig.ignition.explorerUrl;

  const publicClient = await viem.getPublicClient();

  const chainId = await publicClient.getChainId();

  const deployedAddressesPath = join(
    dirname(fileURLToPath(import.meta.url)),
    `../ignition/deployments/chain-${chainId}/deployed_addresses.json`,
  );

  let contractAddress: Address;

  try {
    const deployedAddresses = JSON.parse(
      await readFile(deployedAddressesPath, "utf-8"),
    );

    contractAddress = getAddress(deployedAddresses[name]);
  } catch {
    console.error(
      `Error: no deployment found for chain ${chainId}. Run deploy:${networkName} first.`,
    );

    process.exit(1);
  }

  console.log(`Network: ${networkName}`);
  console.log(`Contract: ${contractAddress}`);

  return { viem, networkName, explorer, contractAddress };
}

export async function getLilBurnContract() {
  const { viem, contractAddress, ...rest } =
    await resolveContract("LilBurn#LilBurn");

  const lilBurn = await viem.getContractAt("LilBurn", contractAddress);

  return { ...rest, lilBurn };
}

export async function getWarChestContract() {
  const { viem, contractAddress, ...rest } =
    await resolveContract("LilBurn#WarChest");

  const warChest = await viem.getContractAt("WarChest", contractAddress);

  return { ...rest, warChest };
}

export function intent(abi: Abi, fnName: string, args: unknown[] = []) {
  const fn = abi.find(
    (item) => item.type === "function" && item.name === fnName,
  );

  const params =
    fn && fn.type === "function"
      ? fn.inputs.map((input, i) => `${input.name}: ${args[i]}`).join(", ")
      : args.join(", ");

  console.log(`${fnName}(${params})`);
}

export async function confirm(prompt = "Confirm? (y/N) ") {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await readline.question(prompt);

  readline.close();

  const confirmed = answer.toLowerCase() === "y";

  if (!confirmed) {
    console.log("Aborted");
  }

  return confirmed;
}
