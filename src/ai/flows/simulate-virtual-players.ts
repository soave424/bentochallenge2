'use server';

/**
 * @fileOverview Simulates the choices of virtual players in the Eco Bento Challenge game.
 *
 * - simulateVirtualPlayers - Simulates the bento selections of virtual players within the game constraints.
 * - SimulateVirtualPlayersInput - The input type for the simulateVirtualPlayers function.
 * - SimulateVirtualPlayersOutput - The return type for the simulateVirtualPlayers function, containing the simulated choices.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  taste: z.number(),
  convenience: z.number(),
  eco: z.number(),
});

const SimulateVirtualPlayersInputSchema = z.object({
  availableSeeds: z.number().describe('The number of seeds available to each virtual player.'),
  menuItems: z.array(MenuItemSchema).describe('The list of available menu items with their properties.'),
  numVirtualPlayers: z.number().describe('The number of virtual players to simulate.'),
});
export type SimulateVirtualPlayersInput = z.infer<typeof SimulateVirtualPlayersInputSchema>;

const VirtualPlayerChoicesSchema = z.object({
  playerChoices: z.array(z.object({
    itemIds: z.array(z.number()).describe('The item ids chosen by the virtual player.'),
  })).describe('An array of virtual player choices, with each choice indicating the item ids selected.'),
});

export type SimulateVirtualPlayersOutput = z.infer<typeof VirtualPlayerChoicesSchema>;

export async function simulateVirtualPlayers(input: SimulateVirtualPlayersInput): Promise<SimulateVirtualPlayersOutput> {
  return simulateVirtualPlayersFlow(input);
}

const simulateVirtualPlayersPrompt = ai.definePrompt({
  name: 'simulateVirtualPlayersPrompt',
  input: {
    schema: SimulateVirtualPlayersInputSchema,
  },
  output: {
    schema: VirtualPlayerChoicesSchema,
  },
  prompt: `You are an AI that simulates the choices of virtual players in a game called Eco Bento Challenge.

The game involves players selecting items from a menu to create a bento box while staying within a budget and meeting certain category requirements. Each player starts with a fixed number of seeds (currency) to spend.

The menu consists of items from five categories: side dishes, fruits, drinks, containers, and snacks. Each player must select at least one item from each category, if possible within their budget.

Given the following constraints and the menu items, simulate the item choices for each virtual player.

Constraints:
- Each virtual player starts with {{availableSeeds}} seeds.
- Each player must select at least one item from each of the five categories if their budget allows.
- Players should aim to maximize their taste, convenience and eco scores.

Menu Items:
{{#each menuItems}}
  {{this.id}}: {{this.name}} (Price: {{this.price}}, Taste: {{this.taste}}, Convenience: {{this.convenience}}, Eco: {{this.eco}})
{{/each}}

Simulate the choices for {{numVirtualPlayers}} virtual players. Provide the item ids chosen by each player in the following JSON format:
\`\`\`json
{{jsonStringify output.schema}}
\`\`\`
`,
});

const simulateVirtualPlayersFlow = ai.defineFlow(
  {
    name: 'simulateVirtualPlayersFlow',
    inputSchema: SimulateVirtualPlayersInputSchema,
    outputSchema: VirtualPlayerChoicesSchema,
  },
  async input => {
    const {output} = await simulateVirtualPlayersPrompt(input);
    return output!;
  }
);
