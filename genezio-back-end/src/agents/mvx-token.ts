import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { z } from 'zod';

import { MultiversXTokenType } from '../types';
import { jsonGeneratorAgent } from './utils/json';

export const mvxFungibleTokenJsonSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long',
    })
    .max(20, {
      message: 'must be at most 20 charactes long',
    })
    .describe('The name of the token'),
  ticker: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long',
    })
    .max(10, {
      message: 'must be at most 10 charactes long',
    })
    .refine((value) => {
      if (!/^[A-Z]+$/.test(value)) {
        return false;
      }

      return value;
    }, 'must be uppercase')
    .describe('The ticker/symbol of the token'),
  mintAmount: z
    .string()
    .min(1, 'required')
    .describe(
      'The amount of tokens to mint initially in declared decimals, e.g. if decimals is 18, 1 token is 1000000000000000000.',
    ),
  decimals: z
    .string()
    .refine((value) => {
      const number = Number.parseInt(value);

      if (Number.isNaN(number) || number < 0 || number > 18) {
        return false;
      }

      return value;
    }, 'must be between 0 and 18')
    .describe('The number of decimals of the token'),
  canFreeze: z.boolean().describe('Whether the token can be frozen'),
  canWipe: z.boolean().describe('Whether the token can be wiped'),
  canPause: z.boolean().describe('Whether the token can be paused'),
  canChangeOwner: z.boolean().describe('Whether the token owner can be changed'),
  canUpgrade: z.boolean().describe('Whether the token can be upgraded'),
  canAddSpecialRoles: z
    .boolean()
    .describe('Whether the token has special roles such as minting or burning after creation'),
});

export const mvxNonFungibleTokenJsonSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long',
    })
    .max(20, {
      message: 'must be at most 20 charactes long',
    })
    .describe('The name of the token'),
  ticker: z
    .string()
    .min(3, {
      message: 'must be at least 3 charactes long',
    })
    .max(10, {
      message: 'must be at most 10 charactes long',
    })
    .refine((value) => {
      if (!/^[A-Z]+$/.test(value)) {
        return false;
      }

      return value;
    }, 'must be uppercase')
    .describe('The ticker/symbol of the token'),
  canFreeze: z.boolean().describe('Whether the token can be frozen'),
  canWipe: z.boolean().describe('Whether the token can be wiped'),
  canPause: z.boolean().describe('Whether the token can be paused'),
  canChangeOwner: z.boolean().describe('Whether the token owner can be changed'),
  canTransferNFTCreateRole: z.boolean().describe('Whether the token can transfer NFT create role'),
  canUpgrade: z.boolean().describe('Whether the token can be upgraded'),
  canAddSpecialRoles: z
    .boolean()
    .describe('Whether the token has special roles such as minting or burning after creation'),
});

export function mvxTokenGeneratorAgent(modelName: string, tokenType: MultiversXTokenType) {
  const systemMsg = `Your task is to generate a {tokenType} token configuration for MultiversX blockchain based on user instructions. The configuration should be generated in JSON format and should always follow the provided schema.`;
  const userMsg = `Please generate a {tokenType} token configuration for MultiversX blockchain based on the following instructions: {instructions}`;

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg),
    ],
    inputVariables: ['tokenType', 'instructions'],
  });

  return prompt.pipe(
    jsonGeneratorAgent(
      modelName,
      tokenType === 'fungible' ? mvxFungibleTokenJsonSchema : mvxNonFungibleTokenJsonSchema,
    ),
  );
}
