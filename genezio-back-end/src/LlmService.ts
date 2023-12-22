import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { auditJsonSchema, auditorAgent } from './agents/audit';
import { buildResolverAgent } from './agents/buildResolve';
import { mvxFungibleTokenJsonSchema, mvxNonFungibleTokenJsonSchema, mvxTokenGeneratorAgent } from './agents/mvx-token';
import Chain, { IChain } from './db-schemas/ChainSchema';
import Prompt, { IPrompt } from './db-schemas/PromptSchema';
import { retrieveDocsAndQueryLLM } from './openaihelper';
import { initPineconeClient } from './pinecone';
import {
  AuditorResponse,
  BuildResponse,
  ContractTemplate,
  GeneratorPromptArgs,
  MultiversXFungibleToken,
  MultiversXNonFungibleToken,
  MultiversXTokenType,
  SupportedChain,
} from './types';

dotenv.config();

export class LlmService {
  constructor() {
    this.#connect();
  }

  #connect() {
    mongoose.connect(process.env.MONGO_DB_URI || '').catch((error) => {
      console.log('Error connecting to the DB', error);
    });
  }

  private trimCode(code: string, language: string) {
    const codeMatch = new RegExp(`\`\`\`${language}([\\s\\S]*?)\`\`\``, 'g').exec(code);
    return codeMatch ? codeMatch[1].trim() : code;
  }

  async getAllChains(): Promise<IChain[]> {
    return await Chain.find({});
  }

  async getPrompts(): Promise<IPrompt[]> {
    return await Prompt.find({});
  }

  async callMVXTokenGeneratorLLM(
    prompt: string,
    tokenType: MultiversXTokenType,
  ): Promise<MultiversXFungibleToken | MultiversXNonFungibleToken> {
    const response = await mvxTokenGeneratorAgent('gpt-4-1106-preview', tokenType).invoke({
      instructions: prompt,
      tokenType,
    });

    return tokenType === 'fungible'
      ? mvxFungibleTokenJsonSchema.parse(response)
      : mvxNonFungibleTokenJsonSchema.parse(response);
  }

  async callGeneratorLLM(prompt: GeneratorPromptArgs, activeChainId: number): Promise<string> {
    const chainData = await Chain.findOne({ chainId: activeChainId });
    if (!chainData) throw new Error('Chain not found');

    const { query, modelName } = chainData;
    const requirementsStr = prompt.functionalRequirements.join(', ');

    // Fetch the template based on the contract type and chain data
    const contractType = prompt.contractType.toLowerCase() as ContractTemplate;
    const contractExample = chainData.templates[contractType] || chainData.templates.base;

    const updatedStr = query
      .replace('requirementsStr_defibuilder', requirementsStr)
      .replace('description_defibuilder', prompt.description)
      .replace('contract_type_defibuilder', prompt.contractType)
      .replace('contract_example_defibuilder', contractExample || '');

    const systemMsg =
      'Your function is to parse and interpret user requests specifically for smart contract development. You must generate complete smart contract code exclusively, without any explanatory or conversational text and placeholder comments. Focus on the user-provided examples to tailor the smart contract code precisely to their requirements. Be sure every smartcontract generated contains the correct events, modifiers, struct, functions, libraries and all the necessary logic parts. Use openzeppelin libraries when possible. Be sure onlyOwner functions have the correct modifier. Use pragma 0.8.19 everytime. Do not use SafeMath functions or library. Always generate only one smart contract of provided type per request. ';

    const pinecone = await initPineconeClient(chainData);
    const returnedCode = await retrieveDocsAndQueryLLM(updatedStr, prompt.description, modelName, systemMsg, pinecone);

    return this.trimCode(returnedCode, 'solidity');
  }

  async buildCode(chain: SupportedChain, smartContractCode: string): Promise<BuildResponse> {
    const buildResponse = await axios.post(
      `https://compiler-service.defibuilder.com/api/v1/${chain}`,
      { code: smartContractCode },
      {
        headers: {
          'X-API-KEY': process.env.X_API_KEY,
        },
      },
    );

    return { ...buildResponse.data, code: smartContractCode };
  }

  async callBuildResolverLLM(code: string, compilerError: string): Promise<string> {
    const returnCode = await buildResolverAgent('gpt-4-1106-preview').invoke({ code, compilerError });

    return this.trimCode(returnCode, 'solidity');
  }

  async callAuditorLLM(code: string, activeChainId: number): Promise<AuditorResponse> {
    const chainAuditData = await Chain.findOne({
      chainId: activeChainId,
    });
    const auditorModel = chainAuditData?.auditorModelName || 'ft:gpt-3.5-turbo-1106:personal::8Pw67TV2';
    try {
      const response = await auditorAgent(auditorModel).invoke({
        code: code,
      });

      return { success: true, audits: auditJsonSchema.parse(response).audits };
    } catch (error) {
      console.log(error);
      return { success: false, audits: [] };
    }
  }
}
