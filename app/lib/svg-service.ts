// src/lib/svg-service.ts
import prisma from "@/app/lib/prisma";
import type { SvgWithModelAndProvider } from "@/app/lib/definitions";

/**
 * Fetches the most recent SVG for each of the provided model names.
 * Results are sorted by model release date (oldest to newest).
 */
export async function fetchInitial(
  modelNames: string[]
): Promise<SvgWithModelAndProvider[]> {
  const results = await prisma.svg.findMany({
    where: {
      model: {
        name: { in: modelNames },
      },
    },
    distinct: ["modelId"],
    orderBy: {
      createdAt: "desc", // Get most recent SVG per model
    },
    // ✅ Nested include to reach the Provider via the Model
    include: {
      model: {
        include: {
          provider: true,
        },
      },
    },
  });

  // Sort by model release date (oldest to newest)
  return results.sort((a, b) => {
    const dateA = a.model.releaseDate
      ? new Date(a.model.releaseDate).getTime()
      : 0;
    const dateB = b.model.releaseDate
      ? new Date(b.model.releaseDate).getTime()
      : 0;
    return dateA - dateB;
  });
}

/**
 * Searches for SVGs by model name or provider name.
 * Results are sorted by model creation date in ascending order (oldest first).
 * No date filtering is applied - all matching SVGs are returned.
 */
export async function searchByModelOrProvider(
  term: string
): Promise<SvgWithModelAndProvider[]> {
  if (!term) return [];

  return await prisma.svg.findMany({
    where: {
      OR: [
        {
          model: {
            name: { contains: term, mode: "insensitive" },
          },
        },
        {
          model: {
            provider: {
              name: { contains: term, mode: "insensitive" },
            },
          },
        },
      ],
    },
    include: {
      model: {
        include: { provider: true },
      },
    },
    orderBy: {
      model: {
        createdAt: "asc",
      },
    },
    take: 50, // Increased limit to ensure all models are included
  });
}

/**
 * Fetches all SVGs.
 * Results are grouped by provider, then sorted by model release date (oldest to newest) within each provider.
 */
export async function fetchAllModels(): Promise<SvgWithModelAndProvider[]> {
  const results = await prisma.svg.findMany({
    include: {
      model: {
        include: {
          provider: true,
        },
      },
    },
  });

  // Group by provider, then sort by model release date (oldest to newest) within each provider
  return results.sort((a, b) => {
    // First sort by provider name
    const providerA = a.model.provider.name;
    const providerB = b.model.provider.name;
    if (providerA !== providerB) {
      return providerA.localeCompare(providerB);
    }

    // Within the same provider, sort by model release date (oldest to newest)
    const dateA = a.model.releaseDate
      ? new Date(a.model.releaseDate).getTime()
      : 0;
    const dateB = b.model.releaseDate
      ? new Date(b.model.releaseDate).getTime()
      : 0;
    return dateA - dateB;
  });
}

/**
 * Fetches a random SVG for each model in each group of model names.
 * Results are sorted by model release date (oldest to newest).
 */
export async function fetchRandomSvgs(
  modelGroups: string[][]
): Promise<SvgWithModelAndProvider[]> {
  const results: SvgWithModelAndProvider[] = [];

  for (const modelNames of modelGroups) {
    // Fetch all SVGs for these models
    const allSvgs = await prisma.svg.findMany({
      where: {
        model: {
          name: { in: modelNames },
        },
      },
      include: {
        model: {
          include: {
            provider: true,
          },
        },
      },
    });

    // Group by modelId and pick a random SVG for each model
    const svgsByModel = new Map<string, SvgWithModelAndProvider[]>();
    for (const svg of allSvgs) {
      const modelId = svg.modelId;
      if (!svgsByModel.has(modelId)) {
        svgsByModel.set(modelId, []);
      }
      svgsByModel.get(modelId)!.push(svg);
    }

    // Pick a random SVG for each model
    for (const [, svgs] of svgsByModel.entries()) {
      const randomIndex = Math.floor(Math.random() * svgs.length);
      results.push(svgs[randomIndex]);
    }
  }

  // Sort by model release date (oldest to newest)
  return results.sort((a, b) => {
    const dateA = a.model.releaseDate
      ? new Date(a.model.releaseDate).getTime()
      : 0;
    const dateB = b.model.releaseDate
      ? new Date(b.model.releaseDate).getTime()
      : 0;
    return dateA - dateB;
  });
}
