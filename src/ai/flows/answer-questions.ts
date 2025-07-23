'use server';

/**
 * @fileOverview An AI agent that answers questions about the documentation.
 *
 * - answerQuestions - A function that answers questions about the documentation.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  relevantDocs: z
    .string()
    .describe('Relevant documentation snippets from vector search.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions about technical documentation. Your goal is to provide a direct, helpful answer based on the provided content.

You MUST use the documentation snippets below to formulate your answer.
Do not tell the user to go read the documentation. Instead, extract the relevant information and provide a clear, concise answer to their question.
At the end of your answer, you MUST list the titles of the documents you used as sources under a "Sources:" heading.

Documentation snippets: {{{relevantDocs}}}

Question: {{{question}}}

Answer:`,
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
