'use server';

import { simulateVirtualPlayers, SimulateVirtualPlayersInput, SimulateVirtualPlayersOutput } from '@/ai/flows/simulate-virtual-players';

export async function getVirtualPlayerChoices(input: SimulateVirtualPlayersInput): Promise<SimulateVirtualPlayersOutput> {
  try {
    const result = await simulateVirtualPlayers(input);
    return result;
  } catch (error) {
    console.error("Error getting virtual player choices:", error);
    return { playerChoices: [] };
  }
}
