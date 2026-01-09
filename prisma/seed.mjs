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
    },
  });

  // Map your JSON data to models
  const modelMap = {
    "sonnet 3.5": sonnet35.id,
    "sonnet 3.7": sonnet37.id,
    haiku: haiku.id,
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
