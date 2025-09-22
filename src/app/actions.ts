'use server';

import { recommendBentoItems, RecommendBentoItemsInput, RecommendBentoItemsOutput } from '@/ai/flows/recommend-bento-items';
import { simulateVirtualPlayers, SimulateVirtualPlayersInput, SimulateVirtualPlayersOutput } from '@/ai/flows/simulate-virtual-players';

export async function getAiRecommendations(input: RecommendBentoItemsInput): Promise<RecommendBentoItemsOutput> {
  try {
    const result = await recommendBentoItems(input);
    return result;
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return { recommendations: [{name: "Error", reason: "Could not fetch recommendations."}] };
  }
}

export async function getVirtualPlayerChoices(input: SimulateVirtualPlayersInput): Promise<SimulateVirtualPlayersOutput> {
  try {
    const result = await simulateVirtualPlayers(input);
    return result;
  } catch (error) {
    console.error("Error getting virtual player choices:", error);
    return { playerChoices: [] };
  }
}
