import type { AlchemyWebhookPayload } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { network } from "hardhat";
import { createHmac } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Address, Hex, PublicClient, parseEther } from "viem";

const NETWORK_NAME = "simulated";
const METADATA_PORT = 3002;
const WEBDATA_DIR = "../../../apps/web/data";
const RPC_DELAY_MS = 100;
const MINING_INTERVAL = 1000;
const DONATIONS_WEBHOOK_URL = "http://localhost:3000/api/webhooks/alchemy";
const DONATIONS_SIGNING_KEY = "signing-key";

function watchAlchemyWebhook(
  publicClient: PublicClient,
  addresses: Address[],
  webhookUrl: string,
  signingKey: string,
) {
  return publicClient.watchEvent({
    address: addresses,
    onLogs: async (logs) => {
      const byBlock = new Map<bigint, typeof logs>();

      for (const log of logs) {
        const key = log.blockNumber!;

        if (!byBlock.has(key)) {
          byBlock.set(key, []);
        }

        byBlock.get(key)!.push(log);
      }

      for (const [blockNumber, blockLogs] of byBlock) {
        const txHashes = [...new Set(blockLogs.map((l) => l.transactionHash!))];

        const block = await publicClient.getBlock({ blockNumber });

        const txData = await Promise.all(
          txHashes.map((hash) =>
            Promise.all([
              publicClient.getTransaction({ hash }),
              publicClient.getTransactionReceipt({ hash }),
            ]),
          ),
        );

        const txByHash = new Map(txHashes.map((hash, i) => [hash, txData[i]]));

        const payload: AlchemyWebhookPayload = {
          webhookId: "wh_local",
          id: `whevt_${block.hash}`,
          createdAt: new Date().toISOString(),
          type: "GRAPHQL",
          event: {
            sequenceNumber: "0",
            network: "LOCALHOST",
            data: {
              block: {
                hash: block.hash!,
                number: Number(block.number),
                timestamp: Number(block.timestamp),
                logs: blockLogs.map((log) => {
                  const [tx, receipt] = txByHash.get(log.transactionHash!)!;
                  return {
                    data: log.data,
                    topics: log.topics as [Hex, ...Hex[]],
                    index: log.logIndex!,
                    account: { address: log.address },
                    transaction: {
                      hash: log.transactionHash!,
                      nonce: tx.nonce,
                      index: receipt.transactionIndex,
                      from: { address: tx.from },
                      to: { address: tx.to! },
                      value: `0x${tx.value.toString(16)}`,
                      gasPrice: `0x${(tx.gasPrice ?? 0n).toString(16)}`,
                      maxFeePerGas: `0x${(tx.maxFeePerGas ?? tx.gasPrice ?? 0n).toString(16)}`,
                      maxPriorityFeePerGas: `0x${(tx.maxPriorityFeePerGas ?? 0n).toString(16)}`,
                      gas: Number(tx.gas),
                      status: receipt.status === "success" ? 1 : 0,
                      gasUsed: Number(receipt.gasUsed),
                      cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
                      effectiveGasPrice: `0x${receipt.effectiveGasPrice.toString(16)}`,
                      createdContract: receipt.contractAddress ?? null,
                    },
                  };
                }),
              },
            },
          },
        };

        const body = JSON.stringify(payload);

        const signature = createHmac("sha256", signingKey)
          .update(body)
          .digest("hex");

        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-alchemy-signature": signature,
          },
          body,
        }).catch((err) =>
          console.warn(`Webhook forward failed: ${err.message}`, err.cause),
        );
      }
    },
  });
}

function createJsonRpcServer(
  provider: {
    request: (req: { method: string; params?: unknown[] }) => Promise<unknown>;
  },
  hostname: string,
  port: number,
) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }

    const body = JSON.parse(Buffer.concat(chunks).toString());

    try {
      const result = await provider.request({
        method: body.method,
        params: body.params,
      });

      await new Promise((resolve) => setTimeout(resolve, RPC_DELAY_MS));

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });

      res.end(JSON.stringify({ jsonrpc: "2.0", id: body.id, result }));
    } catch (err: unknown) {
      const error = err as {
        code?: number;
        message?: string;
        data?: { data?: string };
      };

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });

      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          error: {
            code: error.code ?? -32603,
            message: error.message ?? "Internal error",
            data: error.data?.data,
          },
        }),
      );
    }
  });

  return new Promise<typeof server>((resolve) =>
    server.listen(port, hostname, () => {
      console.log(`Network on ${hostname}:${port}`);

      resolve(server);
    }),
  );
}

function writeTree(tree: StandardMerkleTree<any>, dir: string, name: string) {
  return writeFile(
    join(dir, name),
    JSON.stringify(tree.dump(), (_, value: unknown) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

async function setupWallets(
  networkHelpers: Awaited<ReturnType<typeof network.connect>>["networkHelpers"],
  allWallets: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof network.connect>>["viem"]["getWalletClients"]
    >
  >,
) {
  const wallets = allWallets.slice(0, 7);

  const [owner, holder, holderWhitelisted, whitelisted, , multisig, sweeper] =
    wallets;

  const infos = [
    [
      "Owner",
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    ],
    [
      "Holder",
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    ],
    [
      "Holder whitelisted",
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    ],
    [
      "Whitelisted",
      "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    ],
    [
      "Other",
      "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    ],
    [
      "Multisig",
      "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    ],
    [
      "Sweeper",
      "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    ],
  ] satisfies [string, Hex][];

  await Promise.all(
    wallets.map(({ account: { address } }, i) => {
      networkHelpers.setBalance(address, parseEther("1000"));

      console.log(`Funded "${infos[i][0]}" ${address}`);
    }),
  );

  return { owner, holder, holderWhitelisted, whitelisted, multisig, sweeper };
}

async function deployContracts(
  viem: Awaited<ReturnType<typeof network.connect>>["viem"],
  ownerAddress: Address,
  multisigAddress: Address,
) {
  const lilBurn = await viem.deployContract("LilBurn", [ownerAddress]);
  console.log(`LilBurn deployed at ${lilBurn.address}`);

  await lilBurn.write.ownerMint([multisigAddress, 8n]);
  console.log(`First 8 NFTs minted to ${multisigAddress}`);

  const warChest = await viem.deployContract("WarChest", [ownerAddress]);
  console.log(`WarChest deployed at ${warChest.address}`);

  return { lilBurn, warChest };
}

async function setupMerkleTrees(
  lilBurn: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof network.connect>>["viem"]["deployContract"]
    >
  >,
  holder: Address,
  holderWhitelisted: Address,
  whitelisted: Address,
  webDataDir: string,
) {
  const holderTree = StandardMerkleTree.of<[`0x${string}`, bigint]>(
    [
      [holder, 3n],
      [holderWhitelisted, 2n],
    ],
    ["address", "uint256"],
  );

  await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);
  console.log(`Holder merkle root ${holderTree.root}`);

  const whitelistTree = StandardMerkleTree.of<[`0x${string}`]>(
    [[holderWhitelisted], [whitelisted]],
    ["address"],
  );

  await lilBurn.write.setWhitelistMerkleRoot([whitelistTree.root as Address]);
  console.log(`Whitelist merkle root ${whitelistTree.root}`);

  await mkdir(webDataDir, { recursive: true });
  await Promise.all([
    writeTree(holderTree, webDataDir, "holder-tree-localhost.json"),
    writeTree(whitelistTree, webDataDir, "whitelist-tree-localhost.json"),
  ]);
  console.log(`Merkle trees written to ${webDataDir}`);
}

async function seedData(
  lilBurn: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof network.connect>>["viem"]["deployContract"]
    >
  >,
  warChest: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof network.connect>>["viem"]["deployContract"]
    >
  >,
  holderAccount: { address: Address },
) {
  const mintPrice = await lilBurn.read.MINT_PRICE();

  // ids 9–28
  await lilBurn.write.publicMint([20n], {
    account: holderAccount,
    value: mintPrice * 20n,
  });

  await Promise.all([
    Array.from({ length: 20 }).map((_, i) =>
      lilBurn.write.burn([BigInt(9 + i)], { account: holderAccount }),
    ),
  ]);

  // for (let i = 0; i < 10; ++i) {
  //   await warChest.write.donate({
  //     account: holderAccount,
  //     value: parseEther("0.1"),
  //   });
  // }
}

async function startNetworkServer() {
  const { viem, networkHelpers, provider } =
    await network.connect(NETWORK_NAME);

  await provider.request({
    method: "evm_setIntervalMining",
    params: [MINING_INTERVAL],
  });

  const server = await createJsonRpcServer(provider, "127.0.0.1", 8545);

  const { owner, multisig, holder, holderWhitelisted, whitelisted } =
    await setupWallets(networkHelpers, await viem.getWalletClients());

  const { lilBurn, warChest } = await deployContracts(
    viem,
    owner.account.address,
    multisig.account.address,
  );

  const webDataDir = join(dirname(fileURLToPath(import.meta.url)), WEBDATA_DIR);

  await setupMerkleTrees(
    lilBurn,
    holder.account.address,
    holderWhitelisted.account.address,
    whitelisted.account.address,
    webDataDir,
  );

  await lilBurn.write.setBaseURI([`http://127.0.0.1:${METADATA_PORT}/`]);
  console.log(`Base url set to http://127.0.0.1:${METADATA_PORT}`);

  const publicClient = await viem.getPublicClient();
  const now = (await publicClient.getBlock()).timestamp;

  await lilBurn.write.setPhaseSchedule([now - 3n, now - 2n, now - 1n]);

  console.log("Mint phase schedule set to public");

  await seedData(lilBurn, warChest, holder.account);

  // only start listening once the nextjs server is up
  setTimeout(() => {
    watchAlchemyWebhook(
      publicClient,
      [lilBurn.address, warChest.address],
      DONATIONS_WEBHOOK_URL,
      DONATIONS_SIGNING_KEY,
    );

    console.log(`Started webhook notify on ${DONATIONS_WEBHOOK_URL}`);
  }, 2000);

  return server;
}

function startMetadataServer() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const metadataDir = join(__dirname, "../../scripts/output/metadata");

  const server = createServer(async (req, res) => {
    const tokenId = req.url?.replace(/^\//, "").replace(/\.json$/, "");

    if (!tokenId || !/^\d+$/.test(tokenId)) {
      res.writeHead(404, { "Content-Type": "application/json" });

      res.end(JSON.stringify({ error: "Not found" }));

      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Content-Type", "application/json");

    try {
      const data = await readFile(
        join(metadataDir, `${tokenId}.json`),
        "utf-8",
      );

      res.writeHead(200);

      res.end(data);

      return;
    } catch {}

    res.writeHead(200);

    res.end(
      JSON.stringify({
        name: `LilBurn #${tokenId}`,
        description: "LilBurn NFT",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mNk+A9ECDCOKoQLogIANAQDAefB3ikAAAAASUVORK5CYII=",
        attributes: [],
      }),
    );
  });

  server.listen(METADATA_PORT, () =>
    console.log(`Metadata server on 127.0.0.1:${METADATA_PORT}`),
  );

  return server;
}

const [networkServer, metadataServer] = await Promise.all([
  startNetworkServer(),
  startMetadataServer(),
]);

process.on("SIGINT", async () => {
  metadataServer.close();

  networkServer.close();

  process.exit(0);
});
