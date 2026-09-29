import { afterAll, beforeEach } from "vitest";
import prisma from "../prismaClient.js";
import { resetDatabase } from "./resetDatabase.js";

export const useCleanDatabase = () => {
  beforeEach(() => resetDatabase(prisma));
  afterAll(() => prisma.$disconnect());
};
