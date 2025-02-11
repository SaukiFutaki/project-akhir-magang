import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./lib/prisma";
import { admin } from "better-auth/plugins";

export const auth  = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn:  60 * 60 * 12 ,   
    updateAge: 60 * 60  * 12 , 
  },
  plugins: [admin()],
});
