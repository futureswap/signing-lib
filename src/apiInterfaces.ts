export interface SupportedToken {
  publicAddress: string; // gets displayed to the user or use to look up their local wallet balance (unwrapped address)
  systemAddress: string; // address we use for talking with the system (wrapped address)
  symbol: string;
  name: string;
}
