import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { confirm, getLilBurnContract, intent } from "../lib.js";

export const lilburnSetPaused = () =>
  task(["lilburn", "set-paused"], "Pause or unpause minting")
    .addOption({
      name: "paused",
      description: "Set to 'true' to pause or 'false' to unpause",
      defaultValue: process.env.LILBURN_PAUSED,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(async ({ paused: rawValue }) => {
      if (!rawValue || !["true", "false"].includes(rawValue)) {
        throw new Error("Error: 'paused' must be set to 'true' or 'false'");
      }

      const paused = rawValue === "true";

      const { explorer, lilBurn } = await getLilBurnContract();

      const currentPaused = await lilBurn.read.paused();

      if (currentPaused === paused) {
        return console.log(
          `Mint is already ${paused ? "paused" : "unpaused"}. Skipping.`,
        );
      }

      intent(lilBurn.abi, "setPaused", [paused]);

      if (!(await confirm())) {
        return;
      }

      const tx = await lilBurn.write.setPaused([paused]);

      if (explorer) {
        console.log(`${explorer}/${tx}`);
      }
    })
    .build();
