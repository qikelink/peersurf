declare module '@livepeer/sdk' {
  export interface BlockchainConfig {
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

  export class BlockchainSDK {
    constructor(config?: BlockchainConfig);
    getTranscoders(): Promise<Transcoder[]>;
    getTranscoder(address: string): Promise<Transcoder | null>;
  }
} 