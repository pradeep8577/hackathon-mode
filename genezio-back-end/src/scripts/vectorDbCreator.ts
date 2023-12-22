/* eslint-disable @typescript-eslint/no-empty-function */
import dotenv from 'dotenv';
import * as fs from 'fs';
import { encode } from 'gpt-3-encoder';
import mongoose from 'mongoose';
import * as path from 'path';

import Chain from '../db-schemas/ChainSchema';
import { createEmbedding } from '../openaihelper';
import { upsert } from '../pinecone';

dotenv.config();

const CHUNK_LIMIT = 200;
const CHUNK_MINIMAL = 100;

interface Chunk {
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: any[]; // Define the proper type for 'embedding'
}

const chunkArticle = (article: string): Chunk[] => {
  const articleTextChunks: Chunk[] = [];

  if (encode(article).length > CHUNK_LIMIT) {
    const split = article.split('. ');
    let chunkText = '';

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_LIMIT) {
        articleTextChunks.push({
          content: chunkText,
          content_length: chunkText.length,
          content_tokens: encode(chunkText).length,
          embedding: [],
        });
        chunkText = '';
      }

      if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
        chunkText += sentence + '. ';
      } else {
        chunkText += sentence + ' ';
      }
    }

    articleTextChunks.push({
      content: chunkText.trim(),
      content_length: chunkText.trim().length,
      content_tokens: encode(chunkText.trim()).length,
      embedding: [],
    });
  } else {
    articleTextChunks.push({
      content: article.trim(),
      content_length: article.trim().length,
      content_tokens: encode(article.trim()).length,
      embedding: [],
    });
  }

  if (articleTextChunks.length > 1) {
    for (let i = 0; i < articleTextChunks.length; i++) {
      const chunk = articleTextChunks[i];
      const prevChunk = articleTextChunks[i - 1];

      if (chunk.content_tokens < CHUNK_MINIMAL && prevChunk) {
        prevChunk.content += ' ' + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        articleTextChunks.splice(i, 1);
        i--;
      }
    }
  }

  return articleTextChunks;
};

async function createTestDb() {
  const openai_api_key = process.env.OPENAI_API_KEY;

  const directoryPath = 'data-gnz'; // Replace with the path to your directory
  const requiredExts = ['.sol']; // Replace with the required file extensions
  const chainId = '5'; // Replace with the required chain_id which mentioned in mongodb
  const extra_flag = ''; // Replace with the not mandatory field extra_flag e.g. near_js

  const chainData = await Chain.findOne({ id: chainId });

  // check if openai api key is set
  if (!openai_api_key) {
    throw new Error(
      'You need to provide an OpenAI API key. Go to https://platform.openai.com/account/api-keys to get one.',
    );
  }

  const createDirIfNotExists = (dir: string) => (!fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined);

  createDirIfNotExists('vectordb');

  function readDirectoryRecursively(directoryPath: string, requiredExts: string[], fileList: string[] = []): string[] {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // If it's a directory, recursively read it
        readDirectoryRecursively(filePath, requiredExts, fileList);
      } else if (stat.isFile() && requiredExts.includes(path.extname(file))) {
        // If it's a file with the required extension, add it to the list
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  const elems = readDirectoryRecursively(directoryPath, requiredExts);

  for (const dirent of elems) {
    console.log(dirent);
    const article = await fs.promises.readFile(dirent, { encoding: 'utf8' });
    const chunkedArticles = chunkArticle(article);

    for (let i = 0; i < chunkedArticles.length; i++) {
      const embedding = await createEmbedding(chunkedArticles[i].content);
      await upsert(
        {
          content: chunkedArticles[i].content,
          contentTokens: chunkedArticles[i].content_tokens,
          embedding,
        },
        chainData,
      );

      setTimeout(() => {}, 500);
    }
    fs.rm(dirent, () => {});
  }
}

(async () => {
  await mongoose.connect(process.env.MONGO_DB_URI || '').catch((error) => {
    console.log('Error connecting to the DB', error);
  });
  console.log('Creating LanceDB vector table..');
  await createTestDb();
  console.log('Successfully created LanceDB vector table.');
})();
