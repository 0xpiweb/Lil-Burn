import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LilBurn", (m) => {
  const initialOwner = m.getAccount(0);

  const lilBurn = m.contract("WarChest", [initialOwner]);

  return { lilBurn };
});
