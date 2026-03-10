import { Address } from "viem";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DEPLOY_PK?: string;
      readonly MULTISIG_ADDRESS?: Address;
      readonly SNOWTRACE_API_KEY?: string;

      readonly LILBURN_HOLDER_MERKLE_ROOT?: string;
      readonly LILBURN_WHITELIST_MERKLE_ROOT?: string;
      readonly LILBURN_HOLDER_START?: string;
      readonly LILBURN_WHITELIST_START?: string;
      readonly LILBURN_PUBLIC_START?: string;
      readonly LILBURN_TOKEN_BASE_URI?: string;
      readonly LILBURN_PAUSED?: "true" | "false";
    }
  }
}
