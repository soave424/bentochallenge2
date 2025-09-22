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
  id: z.string(),
  name: z.string(),
  price: z.number(),
  taste: z.number(),
  convenience: z.number(),
  eco: z.number(),
});

const SimulateVirtualPlayersInputSchema = z.object({
  availableSeeds: z.number().describe('각 가상 플레이어에게 사용 가능한 시드의 수입니다.'),
  menuItems: z.array(MenuItemSchema).describe('The list of available menu items with their properties.'),
  numVirtualPlayers: z.number().describe('The number of virtual players to simulate.'),
});
export type SimulateVirtualPlayersInput = z.infer<typeof SimulateVirtualPlayersInputSchema>;

const VirtualPlayerChoicesSchema = z.object({
  playerChoices: z.array(z.object({
    itemIds: z.array(z.string()).describe('The item ids chosen by the virtual player.'),
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

The game involves players selecting items from a menu to create a bento box while staying within a budget. Each player starts with a fixed number of 시드 (currency) to spend.

The menu consists of items from different categories. Each player should select a variety of items.

Given the following constraints and the menu items, create a plausible shopping list for each virtual player for the entire game.

Constraints:
- Each virtual player starts with {{availableSeeds}} 시드.
- Players should aim to get a good balance of taste, convenience and eco scores, while spending their 시드.
- The total cost of items in the list should be close to, but not exceeding, the available 시드.
- Each player should try to buy items from different categories.

Menu Items (only use the id for the output):
{{#each menuItems}}
  id:{{this.id}}, name:{{this.name}}
{{/each}}

Simulate the shopping list for {{numVirtualPlayers}} virtual players. Provide the item ids chosen by each player in the following JSON format.
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
