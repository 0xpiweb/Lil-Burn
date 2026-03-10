import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { getAddress, isAddress, type Address } from "viem";
import { confirm, getWarChestContract, intent } from "../lib.js";

export const warchestTransferOwnership = () =>
  task(
    ["warchest", "transfer-ownership"],
    "Transfer contract ownership to a new address",
  )
    .addOption({
      name: "to",
      description: "New owner address",
      defaultValue: process.env.MULTISIG_ADDRESS,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(async ({ to }) => {
      if (!to || !isAddress(to, { strict: false })) {
        throw new Error(`Error: 'to' must be a valid address ${to}`);
      }

      const newOwner: Address = getAddress(to);

      const { explorer, warChest } = await getWarChestContract();

      const currentOwner = await warChest.read.owner();

      if (currentOwner.toLowerCase() === newOwner.toLowerCase()) {
        return console.log(`Owner is already ${newOwner}. Skipping.`);
      }

      intent(warChest.abi, "transferOwnership", [newOwner]);

      if (!(await confirm())) {
        return;
      }

      const tx = await warChest.write.transferOwnership([newOwner]);

      if (explorer) {
        console.log(`${explorer}/${tx}`);
      }
    })
    .build();
