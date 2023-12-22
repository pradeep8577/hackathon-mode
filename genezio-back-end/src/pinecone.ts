import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

import { IChain } from './db-schemas/ChainSchema';

dotenv.config();

export const upsert = async (
  data: {
    content: string;
    contentTokens: number;
    embedding: number[];
  },
  chainData: any,
) => {
  const pinecone = await initPineconeClient(chainData);

  const index = pinecone.Index('article');
  const { content, contentTokens, embedding } = data;

  try {
    const upsertResponse = await index.upsert([
      {
        id: uuid(),
        values: embedding,
        metadata: {
          content,
          contentTokens,
        },
      },
    ]);
    return upsertResponse;
  } catch (err) {
    return err;
  }
};

export const initPineconeClient = async (chainData: IChain) => {
  const pinecone = new Pinecone({
    environment: chainData.PINECONE_ENV,
    apiKey: chainData.PINECONE_API_KEY,
  });

  return pinecone;
};

export const queryPinecone = async (embed: number[], pinecone: Pinecone) => {
  const index = pinecone.Index('article');

  try {
    const response = await index.query({
      vector: embed,
      topK: 10,
      includeValues: false,
      includeMetadata: true,
    });

    return { data: response };
  } catch (err) {
    return { error: err };
  }
};
