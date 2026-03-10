import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { type Hex, isHex } from "viem";
import { confirm, getLilBurnContract, intent } from "../lib.js";

function getMerkleRoot(name: string, value?: string) {
  if (!value) {
    throw new Error(`Error: '${name}' missing`);
  }

  if (!isHex(value) || value.length !== 66) {
    throw new Error(
      `Error: '${name}' must be a 32-byte hex string (e.g. 0x...)`,
    );
  }

  return value as Hex;
}

export const lilburnSetMerkleRoots = () =>
  task(["lilburn", "set-merkle-roots"], "Set holder and whitelist Merkle roots")
    .addOption({
      name: "holderRoot",
      description: "Holder Merkle root (32-byte hex string)",
      defaultValue: process.env.LILBURN_HOLDER_MERKLE_ROOT,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .addOption({
      name: "whitelistRoot",
      description: "Whitelist Merkle root (32-byte hex string)",
      defaultValue: process.env.LILBURN_WHITELIST_MERKLE_ROOT,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(
      async ({
        holderRoot: holderRootRaw,
        whitelistRoot: whitelistRootRaw,
      }) => {
        const holderRoot = getMerkleRoot("holderRoot", holderRootRaw);

        const whitelistRoot = getMerkleRoot("whitelistRoot", whitelistRootRaw);

        const { explorer, lilBurn } = await getLilBurnContract();

        const [currentHolderRoot, currentWhitelistRoot] = await Promise.all([
          lilBurn.read.holderMerkleRoot(),
          lilBurn.read.whitelistMerkleRoot(),
        ]);

        if (currentHolderRoot === holderRoot) {
          console.log(`Holder root already set ${holderRoot}. Skipping.`);
        } else {
          intent(lilBurn.abi, "setHolderMerkleRoot", [holderRoot]);

          if (!(await confirm())) {
            return;
          }

          const holderTx = await lilBurn.write.setHolderMerkleRoot([
            holderRoot,
          ]);

          if (explorer) {
            console.log(`${explorer}/${holderTx}`);
          }
        }

        if (currentWhitelistRoot === whitelistRoot) {
          console.log(`Whitelist root already set ${whitelistRoot}. Skipping.`);
        } else {
          intent(lilBurn.abi, "setWhitelistMerkleRoot", [whitelistRoot]);

          if (!(await confirm())) {
            return;
          }

          const whitelistTx = await lilBurn.write.setWhitelistMerkleRoot([
            whitelistRoot,
          ]);

          console.log(`Whitelist merkle root set: ${whitelistRoot}`);

          if (explorer) {
            console.log(`${explorer}/${whitelistTx}`);
          }
        }
      },
    )
    .build();
