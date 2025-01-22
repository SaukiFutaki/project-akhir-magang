import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./lib/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    // 1 days
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24,
  },
  plugins: [admin()],
});
