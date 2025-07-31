declare module '@livepeer/sdk' {
  export interface LivepeerConfig {
    network?: string;
    provider?: string;
  }

  export interface Transcoder {
    address: string;
    name?: string;
    totalStake?: string;
    feeShare?: string;
    rewardCut?: string;
    active?: boolean;
    description?: string;
  }

  export class LivepeerSDK {
    constructor(config?: LivepeerConfig);
    getTranscoders(): Promise<Transcoder[]>;
    getTranscoder(address: string): Promise<Transcoder | null>;
  }
} 