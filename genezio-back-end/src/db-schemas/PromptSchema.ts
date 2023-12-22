import { Schema, model } from 'mongoose';

export type IPrompt = {
  title: string;
  description: string;
};

const PromptSchema = new Schema<IPrompt>({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export default model<IPrompt>('Prompt', PromptSchema, 'prompts');
