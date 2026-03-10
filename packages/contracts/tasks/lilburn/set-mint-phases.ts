import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types/arguments";
import { confirm, getLilBurnContract, intent } from "../lib.js";

function getTimestamp(name: string, value?: string): bigint {
  if (!value) {
    throw new Error(`Error: '${name}' missing`);
  }

  const milliseconds = Date.parse(value);

  if (isNaN(milliseconds)) {
    throw new Error(
      `Error: '${name}' must be a valid ISO 8601 date (e.g. 2026-04-01T18:00:00Z)`,
    );
  }

  const timestamp = BigInt(Math.floor(milliseconds / 1000));

  if (timestamp <= BigInt(Math.floor(Date.now() / 1000))) {
    console.warn(`Warning: '${name}' is in the past`);
  }

  return timestamp;
}

export const lilburnSetMintPhases = () =>
  task(
    ["lilburn", "set-mint-phases"],
    "Set holder, whitelist, and public phase timestamps",
  )
    .addOption({
      name: "holderStart",
      description: "Holder phase start (ISO 8601 date)",
      defaultValue: process.env.LILBURN_HOLDER_START,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .addOption({
      name: "whitelistStart",
      description: "Whitelist phase start (ISO 8601 date)",
      defaultValue: process.env.LILBURN_WHITELIST_START,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .addOption({
      name: "publicStart",
      description: "Public phase start (ISO 8601 date)",
      defaultValue: process.env.LILBURN_PUBLIC_START,
      type: ArgumentType.STRING_WITHOUT_DEFAULT,
    })
    .setInlineAction(
      async ({
        holderStart: holderStartRaw,
        whitelistStart: whitelistStartRaw,
        publicStart: publicStartRaw,
      }) => {
        const holderStart = getTimestamp("holderStart", holderStartRaw);

        const whitelistStart = getTimestamp(
          "whitelistStart",
          whitelistStartRaw,
        );

        const publicStart = getTimestamp("publicStart", publicStartRaw);

        if (whitelistStart <= holderStart || publicStart <= whitelistStart) {
          throw new Error(
            "Error: Timestamps must be in order 'holderStart' < 'whitelistStart' < 'publicStart'",
          );
        }

        const { explorer, lilBurn } = await getLilBurnContract();

        const [currentHolderStart, currentWhitelistStart, currentPublicStart] =
          await Promise.all([
            lilBurn.read.holderStart(),
            lilBurn.read.whitelistStart(),
            lilBurn.read.publicStart(),
          ]);

        if (
          currentHolderStart === holderStart &&
          currentWhitelistStart === whitelistStart &&
          currentPublicStart === publicStart
        ) {
          return console.log(`Phases already set. Skipping.`);
        }

        intent(lilBurn.abi, "setPhaseSchedule", [
          holderStart,
          whitelistStart,
          publicStart,
        ]);

        if (!(await confirm())) {
          return;
        }

        const tx = await lilBurn.write.setPhaseSchedule([
          holderStart,
          whitelistStart,
          publicStart,
        ]);

        if (explorer) {
          console.log(`${explorer}/${tx}`);
        }
      },
    )
    .build();
