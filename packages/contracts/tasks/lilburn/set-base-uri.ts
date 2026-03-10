import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { confirm, getLilBurnContract, intent } from "../lib.js";

export const lilburnSetBaseUri = () =>
  task(["lilburn", "set-base-uri"], "Set the base URI for token metadata")
    .addOption({
      name: "baseUri",
      description: "Base URI for token metadata (must end with /)",
      defaultValue: process.env.LILBURN_TOKEN_BASE_URI,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(async ({ baseUri }) => {
      if (!baseUri) {
        throw new Error("Error: 'baseUri' missing");
      }

      if (!baseUri.endsWith("/")) {
        throw new Error("Error: 'baseUri' must end with /");
      }

      const { explorer, lilBurn } = await getLilBurnContract();

      intent(lilBurn.abi, "setBaseURI", [baseUri]);

      if (!(await confirm())) {
        return;
      }

      const tx = await lilBurn.write.setBaseURI([baseUri]);

      if (explorer) {
        console.log(`${explorer}/${tx}`);
      }
    })
    .build();
