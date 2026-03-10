import type { AlchemyWebhookPayload } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { network } from "hardhat";
import { createHmac } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Address, parseEther } from "viem";

const NETWORK_NAME = "simulated";
const METADATA_PORT = 3002;
const WEBDATA_DIR = "../../../apps/web/data";
const RPC_DELAY_MS = 100;
const MINING_INTERVAL = 1000;
const DONATIONS_WEBHOOK_URL = "http://localhost:3000/api/webhooks/donations";
const DONATIONS_SIGNING_KEY = "signing-key";

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

async function startNetworkServer() {
  const { viem, networkHelpers, provider } =
    await network.connect(NETWORK_NAME);

  await provider.request({
    method: "evm_setIntervalMining",
    params: [MINING_INTERVAL],
  });

  const server = await createJsonRpcServer(provider, "127.0.0.1", 8545);

  const wallets = (await viem.getWalletClients()).slice(0, 6);

  const labels = [
    "Owner",
    "Holder",
    "Holder whitelisted",
    "Whitelisted",
    "Other",
    "Multisig",
  ];

  const pks = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  ];

  const [owner, holder, holderWhitelisted, whitelisted, other, multisig] =
    wallets;

  await Promise.all([
    wallets.map(({ account: { address } }, i) => {
      networkHelpers.setBalance(address, parseEther("1000"));

      console.log(`1,000 AVAX sent to "${labels[i]}" ${address} ${pks[i]}`);
    }),
  ]);

  const lilBurn = await viem.deployContract("LilBurn", [owner.account.address]);

  console.log(`LilBurn deployed at ${lilBurn.address}`);

  await lilBurn.write.ownerMint([multisig.account.address, 8n]);

  console.log(`First 8 NFTs minted to ${multisig.account.address}`);

  const holderTree = StandardMerkleTree.of<[`0x${string}`, bigint]>(
    [
      [holder.account.address, 3n],
      [holderWhitelisted.account.address, 2n],
    ],
    ["address", "uint256"],
  );

  await lilBurn.write.setHolderMerkleRoot([holderTree.root as Address]);

  console.log(`Holder merkle root ${holderTree.root}`);

  const whitelistTree = StandardMerkleTree.of<[`0x${string}`]>(
    [[holderWhitelisted.account.address], [whitelisted.account.address]],
    ["address"],
  );

  await lilBurn.write.setWhitelistMerkleRoot([whitelistTree.root as Address]);

  console.log(`Whitelist merkle root ${whitelistTree.root}`);

  const webDataDir = join(dirname(fileURLToPath(import.meta.url)), WEBDATA_DIR);

  await mkdir(webDataDir, { recursive: true });

  function writeTree(tree: StandardMerkleTree<any>, name: string) {
    return writeFile(
      join(webDataDir, name),
      JSON.stringify(tree.dump(), (_, value: unknown) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }

  await writeTree(holderTree, "holder-tree-localhost.json");

  await writeTree(whitelistTree, "whitelist-tree-localhost.json");

  console.log(`Merkle trees written to ${webDataDir}`);

  await lilBurn.write.setBaseURI([`http://127.0.0.1:${METADATA_PORT}/`]);

  console.log(`Base url set to http://127.0.0.1:${METADATA_PORT}`);

  const publicClient = await viem.getPublicClient();

  const now = (await publicClient.getBlock()).timestamp;

  const holderStart = now + 60n;
  const whitelistStart = now + 60n * 2n;
  const publicStart = now + 60n * 3n;

  await lilBurn.write.setPhaseSchedule([
    holderStart,
    whitelistStart,
    publicStart,
  ]);

  console.log("Mint phase schedule set to public");

  const warChest = await viem.deployContract("WarChest", [
    owner.account.address,
  ]);

  console.log(`WarChest deployed at ${warChest.address}`);

  publicClient.watchContractEvent({
    address: warChest.address,
    abi: warChest.abi,
    eventName: "Donated",
    onLogs: async (logs) => {
      for (const log of logs) {
        const [block, tx, receipt] = await Promise.all([
          publicClient.getBlock({ blockNumber: log.blockNumber }),
          publicClient.getTransaction({ hash: log.transactionHash }),
          publicClient.getTransactionReceipt({ hash: log.transactionHash }),
        ]);

        const payloadObj: AlchemyWebhookPayload = {
          webhookId: "wh_local",
          id: `whevt_${log.transactionHash}`,
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
                logs: [
                  {
                    data: log.data,
                    topics: log.topics,
                    index: log.logIndex,
                    transaction: {
                      hash: log.transactionHash,
                      nonce: tx.nonce,
                      index: receipt.transactionIndex,
                      from: { address: tx.from },
                      to: { address: tx.to! },
                      value: `0x${tx.value.toString(16)}`,
                      gasPrice: `0x${tx.gasPrice!.toString(16)}`,
                      maxFeePerGas: `0x${(tx.maxFeePerGas ?? tx.gasPrice!).toString(16)}`,
                      maxPriorityFeePerGas: `0x${(tx.maxPriorityFeePerGas ?? 0n).toString(16)}`,
                      gas: Number(tx.gas),
                      status: receipt.status === "success" ? 1 : 0,
                      gasUsed: Number(receipt.gasUsed),
                      cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
                      effectiveGasPrice: `0x${receipt.effectiveGasPrice.toString(16)}`,
                      createdContract: receipt.contractAddress ?? null,
                    },
                    account: { address: warChest.address },
                  },
                ],
              },
            },
          },
        };

        const payload = JSON.stringify(payloadObj);

        const signature = createHmac("sha256", DONATIONS_SIGNING_KEY)
          .update(payload)
          .digest("hex");

        await fetch(DONATIONS_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-alchemy-signature": signature,
          },
          body: payload,
        }).catch((err) =>
          console.warn(`Webhook forward failed: ${err.message}`),
        );
      }
    },
  });

  // setTimeout(() => {
  //   function donate() {
  //     warChest.write.donate({
  //       account: owner.account,
  //       value: parseEther("0.1"),
  //     });
  //   }

  //   donate();

  //   setInterval(donate, 10000);
  // }, 5000);

  console.log(`Started webhook notify on ${DONATIONS_WEBHOOK_URL}`);

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
