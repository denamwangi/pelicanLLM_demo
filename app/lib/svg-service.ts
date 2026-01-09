// src/lib/svg-service.ts
import prisma from "@/app/lib/prisma"; // Your singleton Prisma client
import { Svg } from "@prisma/client";

/**
 * Fetches the most recent SVG for each of the provided model names.
 */
export async function fetchInitial(modelNames: string[]): Promise<Svg[]> {
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
  });
}
