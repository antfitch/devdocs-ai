// src/ai/flows/generate-code.ts
'use server';

/**
 * @fileOverview A code generation AI agent.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  text: z.string().describe('The documentation text to generate code from.'),
  existingCode: z.string().optional().describe('An existing code sample to be revised.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer specializing in generating code snippets based on documentation.

  You will use the following documentation to generate code, and return the code in the 'code' output field.
  Please ensure that the generated code does not exceed 80 characters per line unless absolutely necessary.
  {{#if existingCode}}
  You must generate a NEW and DIFFERENT code sample from the one provided below, but it should illustrate the same concept.
  Existing code:
  \`\`\`
  {{{existingCode}}}
  \`\`\`
  {{/if}}

  Documentation: {{{text}}}`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
