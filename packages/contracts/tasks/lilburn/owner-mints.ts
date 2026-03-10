import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { isAddress } from "viem";
import { confirm, getLilBurnContract, intent } from "../lib.js";

export const lilburnOwnerMints = () =>
  task(
    ["lilburn", "owner-mints"],
    "Mint remaining owner tokens to a multisig address",
  )
    .addOption({
      name: "to",
      description: "Address that will receive the tokens",
      defaultValue: process.env.MULTISIG_ADDRESS,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(async ({ to }) => {
      if (!to || !isAddress(to, { strict: false })) {
        throw new Error(`Error: 'to' must be a valid address ${to}`);
      }

      const { explorer, lilBurn } = await getLilBurnContract();

      const [maxOwnerMints, ownerMintCount] = await Promise.all([
        lilBurn.read.MAX_OWNER_MINT(),
        lilBurn.read.ownerMintCount(),
      ]);

      const quantity = maxOwnerMints - ownerMintCount;

      if (quantity <= 0n) {
        return console.log("Owner mints done. Skipping");
      }

      intent(lilBurn.abi, "ownerMint", [to, quantity]);

      if (!(await confirm())) {
        return;
      }

      const tx = await lilBurn.write.ownerMint([to, quantity]);

      if (explorer) {
        console.log(`${explorer}/${tx}`);
      }
    })
    .build();
