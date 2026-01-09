import { Prisma } from "@prisma/client";

// Type definition for SVG with model and provider relations
export type SvgWithModelAndProvider = Prisma.SvgGetPayload<{
  include: {
    model: {
      include: { provider: true };
    };
  };
}>;
