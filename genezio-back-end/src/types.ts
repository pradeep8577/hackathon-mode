export type ContractTemplate = 'base' | 'token' | 'staking' | 'nft' | 'marketplace' | 'launchpad';

export type SupportedChain = 'fuel' | 'multiversx' | 'solidity';

export type MultiversXTokenType = 'fungible' | 'non-fungible' | 'semi-fungible';

export type MultiversXFungibleToken = {
  name: string;
  ticker: string;
  mintAmount: string;
  decimals: string;
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canChangeOwner: boolean;
  canUpgrade: boolean;
  canAddSpecialRoles: boolean;
};

export type MultiversXNonFungibleToken = {
  name: string;
  ticker: string;
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canChangeOwner: boolean;
  canTransferNFTCreateRole: boolean;
  canUpgrade: boolean;
  canAddSpecialRoles: boolean;
};

export type GeneratorPromptArgs = {
  functionalRequirements: string[];
  description: string;
  contractType: string;
};

export type BuildResponse = {
  success: boolean;
  message: string;
  artifact: unknown; // Hardhat Artifact
  code: string;
};

export type AuditorResponse = {
  success: boolean;
  audits: {
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
};
