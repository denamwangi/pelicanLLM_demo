"use server";
import prisma from "@/app/lib/prisma";
import { Svg, Prisma } from "@prisma/client";

// This creates a type that includes the relation

export type SvgWithModelAndProvider = Prisma.SvgGetPayload<{
  include: {
    model: {
      include: { provider: true };
    };
  };
}>;
/**
 * Fetches the most recent SVG for each of the provided model names.
 */
export async function fetchInitial(
  modelNames: string[]
): Promise<SvgWithModelAndProvider[]> {
  return await prisma.svg.findMany({
    where: {
      model: {
        name: { in: modelNames },
      },
    },
    distinct: ["modelId"],
    orderBy: {
      createdAt: "desc",
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
}

export async function searchByModelOrProvider(term: string) {
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
        include: { provider: true }, // This returns the full context for your UI
      },
    },
    take: 20,
  });
}
