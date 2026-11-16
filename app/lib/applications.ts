import prisma from "./prisma";

export async function listApplications() {
  return prisma.application.findMany({ orderBy: { title: "asc" } });
}
