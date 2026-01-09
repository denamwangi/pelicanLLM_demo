import { PrismaClient } from "@prisma/client";
import svgData from "../app/data/svgs.json" with { type: "json" };

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning database...");
  // Delete existing SVGs to avoid duplicates
  // Delete existing models
  // Delete existing providers

  await prisma.$transaction([
    prisma.svg.deleteMany(),
    prisma.model.deleteMany(),
    prisma.provider.deleteMany(),
  ]);
  console.log("🌱 Seeding database...");

  // Create Anthropic provider
  const anthropic = await prisma.provider.upsert({
    where: { name: "anthropic" },
    update: {},
    create: {
      name: "anthropic",
      displayName: "Anthropic",
    },
  });
  // Create Open AI provider
  const openAI = await prisma.provider.upsert({
    where: { name: "openAI" },
    update: {},
    create: {
      name: "openAI",
      displayName: "Open AI",
    },
  });

  // Create models

  const opus3 = await prisma.model.upsert({
    where: { name: "opus3" },
    update: {},
    create: {
      providerId: anthropic.id,
      name: "opus3",
      displayName: "Claude opus3",
      releaseDate: new Date("2024-03-04"),
    },
  });

  const haiku = await prisma.model.upsert({
    where: { name: "haiku" },
    update: {},
    create: {
      providerId: anthropic.id,
      name: "haiku",
      displayName: "Claude Haiku",
      releaseDate: new Date("2024-03-13"),
    },
  });

  const sonnet35 = await prisma.model.upsert({
    where: { name: "sonnet-3.5" },
    update: {},
    create: {
      providerId: anthropic.id,
      name: "sonnet-3.5",
      displayName: "Claude Sonnet 3.5",
      releaseDate: new Date("2024-06-20"),
    },
  });

  const sonnet37 = await prisma.model.upsert({
    where: { name: "sonnet-3.7" },
    update: {},
    create: {
      providerId: anthropic.id,
      name: "sonnet-3.7",
      displayName: "Claude Sonnet 3.7",
      releaseDate: new Date("2024-10-22"),
    },
  });


  const turbo35 = await prisma.model.upsert({
    where: { name: "turbo-3.5" },
    update: {},
    create: {
      providerId: openAI.id,
      name: "turbo-3.5",
      displayName: "GPT Turbo 3.5",
      releaseDate: new Date("2022-11-30"),
    },
  });
    const gpt4 = await prisma.model.upsert({
    where: { name: "gpt-4" },
    update: {},
    create: {
      providerId: openAI.id,
      name: "gpt-4",
      displayName: "GPT 4",
      releaseDate: new Date("2023-03-14"),
    },
  });
  const gpt4omini = await prisma.model.upsert({
    where: { name: "gpt-4o-mini" },
    update: {},
    create: {
      providerId: openAI.id,
      name: "gpt-4o-mini",
      displayName: "GPT 4o mini",
      releaseDate: new Date("2024-07-18"),
    },
  });

  const gpt41 = await prisma.model.upsert({
    where: { name: "gpt-4.1" },
    update: {},
    create: {
      providerId: openAI.id,
      name: "gpt-4.1",
      displayName: "GPT 4.1",
      releaseDate: new Date("2025-04-14"),
    },
  });
  // // Map your JSON data to models
  // const modelMap = {
  //   "sonnet 3.5": sonnet35.id,
  //   "sonnet 3.7": sonnet37.id,
  //   haiku: haiku.id,
  //   "gpt-4o-mini": gpt4omini.id,
  //   "gpt-4.1": gpt41.id,
  // };
  // Map IDs AND Release Dates
  const modelMap = {
    "gpt-4o-mini": { id: gpt4omini.id, releaseDate: gpt4omini.releaseDate },
    "gpt-4.1": { id: gpt41.id, releaseDate: gpt41.releaseDate },
    "gpt-4": { id: gpt4.id, releaseDate: gpt4.releaseDate },
    haiku: { id: haiku.id, releaseDate: haiku.releaseDate },
    opus3: { id: opus3.id, releaseDate: opus3.releaseDate },
    "sonnet 3.5": { id: sonnet35.id, releaseDate: sonnet35.releaseDate },
    "sonnet 3.7": { id: sonnet37.id, releaseDate: sonnet37.releaseDate },
    "turbo-3.5": { id: turbo35.id, releaseDate: turbo35.releaseDate },
  };
  const svgsToCreate = svgData
    .filter((item) => modelMap[item.model]) // Verify model exists in map
    .map((item) => {
      const model = modelMap[item.model];

      // 1. Get the base release date
      const baseDate = new Date(model.releaseDate);

      // 2. Calculate a random offset (0 to 30 days) in milliseconds
      // 30 days * 24h * 60m * 60s * 1000ms
      const maxOffset = 7 * 24 * 60 * 60 * 1000;
      const randomOffset = Math.floor(Math.random() * maxOffset);

      // 3. Create the jittered date
      const jitteredDate = new Date(baseDate.getTime() + randomOffset);

      return {
        modelId: model.id,
        content: item.content,
        createdAt: jitteredDate, // Prisma will insert this specific date
      };
    });

  // Execute the batch
  const result = await prisma.svg.createMany({
    data: svgsToCreate,
    skipDuplicates: true,
  });


  console.log(`✅ Seed completed! Created ${result.count} SVGs`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
