import { Schema, model } from 'mongoose';

type ContractTemplates = {
  base: string | null;
  token: string | null;
  staking: string | null;
  nft: string | null;
  marketplace: string | null;
  launchpad: string | null;
};

export type IChain = {
  chainId: number;
  chainName: string;
  chainLogoURL: string;
  modelName: string;
  auditorModelName: string;
  language: string;
  PINECONE_ENV: string;
  PINECONE_API_KEY: string;
  query: string;
  templates: ContractTemplates;
};

const ChainSchema = new Schema<IChain>({
  chainId: { type: Number, required: true },
  chainName: { type: String, required: true },
  chainLogoURL: { type: String, required: true },
  modelName: { type: String, required: true },
  auditorModelName: { type: String, required: true },
  language: { type: String, required: true },
  PINECONE_ENV: { type: String, required: true },
  PINECONE_API_KEY: { type: String, required: true },
  query: { type: String, required: true },
  templates: {
    base: { type: String, required: false },
    token: { type: String, required: false },
    staking: { type: String, required: false },
    nft: { type: String, required: false },
    marketplace: { type: String, required: false },
    launchpad: { type: String, required: false },
  },
});

export default model<IChain>('Chain', ChainSchema, 'chainsUpdated');
