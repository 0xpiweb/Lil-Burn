namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_CHAIN?: "avalanche" | "avalancheFuji" | "localhost";
    readonly NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
    readonly DATABASE_URL?: string;
    readonly DATABASE_AUTH_TOKEN?: string;
    readonly ALCHEMY_SIGNING_KEY?: string;
    readonly WARCHEST_DEPLOY_BLOCK?: string;
  }
}
