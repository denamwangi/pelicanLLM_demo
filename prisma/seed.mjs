import { PrismaClient } from "@prisma/client";
// import svgData from "../src/data/svgs.json";
import svgData from "../app/data/svgs.json" assert { type: "json" };

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

  // Map your JSON data to models
  const modelMap = {
    "sonnet 3.5": sonnet35.id,
    "sonnet 3.7": sonnet37.id,
    haiku: haiku.id,
    "gpt-4o-mini": gpt4omini.id,
    "gpt-4.1": gpt41.id,
  };

  //   // Create SVGs from your JSON data
  //   let count = 0;
  //   for (const item of svgData) {
  //     const modelId = modelMap[item.model];
  //     if (modelId) {
  //       await prisma.svg.create({
  //         data: {
  //           modelId: modelId,
  //           content: item.content,
  //           createdAt: new Date(),
  //         },
  //       });
  //       count++;
  //     }
  //   }

  const svgsToCreate = svgData
    .filter((item) => modelMap[item.model]) // Ensure the model exists
    .map((item) => ({
      modelId: modelMap[item.model],
      content: item.content,
      createdAt: new Date(),
    }));

  // Batch insert everything in one single command
  const result = await prisma.svg.createMany({
    data: svgsToCreate,
    skipDuplicates: true, // Optional safety
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
