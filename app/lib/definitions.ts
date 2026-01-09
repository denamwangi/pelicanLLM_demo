import { Prisma } from "@prisma/client";

export type SvgWithModelAndProvider = Prisma.SvgGetPayload<{
  include: {
    model: {
      include: { provider: true };
    };
  };
}>;
