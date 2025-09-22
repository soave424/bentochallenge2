// src/ai/flows/recommend-bento-items.ts
'use server';

/**
 * @fileOverview Recommends Bento items to the user to optimize taste, convenience, and environmental impact, taking into account remaining budget and available bonus cards.
 *
 * - recommendBentoItems - A function that takes the current game state and returns a recommendation of items to purchase.
 * - RecommendBentoItemsInput - The input type for the recommendBentoItems function.
 * - RecommendBentoItemsOutput - The return type for the recommendBentoItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BentoItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  taste: z.number(),
  convenience: z.number(),
  environmental: z.number(),
  category: z.string(),
});

const BonusCardSchema = z.object({
  name: z.string(),
  description: z.string(),
  effect: z.string(),
});

const RecommendBentoItemsInputSchema = z.object({
  remainingBudget: z.number().describe('The player\'s remaining budget in seeds.'),
  currentBento: z.array(BentoItemSchema).describe('The items currently in the player\'s bento.'),
  availableItems: z.array(BentoItemSchema).describe('The items available for purchase.'),
  bonusCards: z.array(BonusCardSchema).optional().describe('The bonus cards the player has.'),
});
export type RecommendBentoItemsInput = z.infer<typeof RecommendBentoItemsInputSchema>;

const RecommendedItemSchema = z.object({
  name: z.string().describe('The name of the recommended item.'),
  reason: z.string().describe('The reason why this item is recommended.'),
});

const RecommendBentoItemsOutputSchema = z.object({
  recommendations: z.array(RecommendedItemSchema).describe('A list of recommended bento items with reasons.'),
});
export type RecommendBentoItemsOutput = z.infer<typeof RecommendBentoItemsOutputSchema>;

export async function recommendBentoItems(input: RecommendBentoItemsInput): Promise<RecommendBentoItemsOutput> {
  return recommendBentoItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendBentoItemsPrompt',
  input: {schema: RecommendBentoItemsInputSchema},
  output: {schema: RecommendBentoItemsOutputSchema},
  prompt: `You are an AI assistant that recommends items for a bento based on the player's remaining budget, current bento items, available items, and bonus cards.

  The goal is to optimize for taste, convenience, and environmental impact, while staying within the budget and considering the effects of any bonus cards.

  Remaining Budget: {{{remainingBudget}}}

  Current Bento Items:
  {{#each currentBento}}
  - {{this.name}} (Price: {{this.price}}, Taste: {{this.taste}}, Convenience: {{this.convenience}}, Environmental: {{this.environmental}}, Category: {{this.category}})
  {{/each}}

  Available Items:
  {{#each availableItems}}
  - {{this.name}} (Price: {{this.price}}, Taste: {{this.taste}}, Convenience: {{this.convenience}}, Environmental: {{this.environmental}}, Category: {{this.category}})
  {{/each}}

  Bonus Cards:
  {{#if bonusCards}}
    {{#each bonusCards}}
    - {{this.name}}: {{this.description}} (Effect: {{this.effect}})
    {{/each}}
  {{else}}
  None
  {{/if}}

  Please provide a list of recommended bento items with reasons, considering the above information.
  Format your response as a JSON object that matches the following schema:
  ${JSON.stringify(RecommendBentoItemsOutputSchema.description)},
  Make sure the "reason" field is compelling.
  `, 
});

const recommendBentoItemsFlow = ai.defineFlow(
  {
    name: 'recommendBentoItemsFlow',
    inputSchema: RecommendBentoItemsInputSchema,
    outputSchema: RecommendBentoItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
