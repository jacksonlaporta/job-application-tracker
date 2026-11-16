import prisma from "./prisma";
import { NewApplication } from "./validation";

export async function listApplications() {
  return prisma.application.findMany({ orderBy: { createdAt: "desc" } });
}

export async function saveApplication(data: NewApplication) {
  return prisma.application.create({ data });
}
