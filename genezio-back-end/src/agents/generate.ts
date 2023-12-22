import { Pinecone } from '@pinecone-database/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnablePassthrough, RunnableSequence } from 'langchain/schema/runnable';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

// TODO: create tests and compare with current generation
export async function generatorAgent(modelName: string, pineconeClient: Pinecone) {
  const systemMsg =
    'Your function is to parse and interpret user requests specifically for smart contract development. You must generate complete smart contract code exclusively, without any explanatory or conversational text and placeholder comments. Focus on the user-provided examples to tailor the smart contract code precisely to their requirements. Be sure every smartcontract generated contains the correct events, modifiers, struct, functions, libraries and all the necessary logic parts. Use openzeppelin libraries when possible. Be sure onlyOwner functions have the correct modifier. Use pragma 0.8.19 everytime. Do not use SafeMath functions or library. Always generate only one smart contract of provided type per request. ';
  const contextMsg = 'Context: {context}';
  const userMsg =
    '{contractExample} \n Using the previous code as reference, create a solidity Smart Contract for a {contractType} type, with the following functionalities: {requirements}. Also here are mandatory additional customizations: {customization}.';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      HumanMessagePromptTemplate.fromTemplate(contextMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg),
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
    ],
    inputVariables: ['context', 'contractExample', 'contractType', 'requirements', 'customization'],
  });

  const pineconeStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), {
    pineconeIndex: pineconeClient.index('article'),
  });
  const pineconeRetriever = pineconeStore.asRetriever({ k: 10, searchType: 'similarity', verbose: true }); // todo: try out mmr

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: modelName,
    temperature: 0.45,
    modelKwargs: { seed: 1337 },
  });

  const retrievalChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => [input.contractType, input.requirements, input.customization].join(' '),
        pineconeRetriever,
        formatDocuments,
      ]),
      contractExample: new RunnablePassthrough(),
      contractType: new RunnablePassthrough(),
      requirements: new RunnablePassthrough(),
      customization: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  return retrievalChain;
}

function formatDocuments(documents: Document[]) {
  return documents.map((doc) => doc.metadata.content).join('\n');
}
