"use server";
import {
  fetchInitial as fetchInitialService,
  searchByModelOrProvider as searchByModelOrProviderService,
  fetchAllModels as fetchAllModelsService,
  fetchRandomSvgs as fetchRandomSvgsService,
} from "@/app/lib/svg-service";
import type { SvgWithModelAndProvider } from "@/app/lib/definitions";

/**
 * Server action: Fetches the most recent SVG for each of the provided model names.
 */
export async function fetchInitial(
  modelNames: string[]
): Promise<SvgWithModelAndProvider[]> {
  return await fetchInitialService(modelNames);
}

/**
 * Server action: Searches for SVGs by model name or provider name.
 */
export async function searchByModelOrProvider(
  term: string,
  page: number = 1,
  pageSize: number = 9
): Promise<{ data: SvgWithModelAndProvider[]; total: number }> {
  return await searchByModelOrProviderService(term, page, pageSize);
}

/**
 * Server action: Fetches all SVGs with pagination.
 */
export async function fetchAllModels(
  page: number = 1,
  pageSize: number = 9
): Promise<{ data: SvgWithModelAndProvider[]; total: number }> {
  return await fetchAllModelsService(page, pageSize);
}

/**
 * Server action: Fetches the most recent SVG for each model in each group of model names.
 */
export async function fetchRandomSvgs(
  modelGroups: string[][]
): Promise<SvgWithModelAndProvider[]> {
  return await fetchRandomSvgsService(modelGroups);
}
