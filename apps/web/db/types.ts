import { customType } from "drizzle-orm/sqlite-core";
import { Address, getAddress, Hex, isAddress, isHex } from "viem";

export const address = customType<{ data: Address; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    if (!isAddress(value, { strict: false })) {
      throw new Error(`Invalid address ${value}`);
    }

    return getAddress(value);
  },
});

export const hex = customType<{ data: Hex; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    if (!isHex(value)) {
      throw new Error(`Invalid hex ${value}`);
    }

    return value;
  },
});

export const uint256 = customType<{ data: bigint; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    if (value < BigInt(0)) {
      throw new Error(`Invalid uint256 ${value}`);
    }

    return value.toString();
  },
  fromDriver(value) {
    return BigInt(value);
  },
});
