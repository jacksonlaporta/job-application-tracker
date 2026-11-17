import { Stage } from "../generated/prisma/enums";
import { NewApplication } from "./validation";
import prisma from "./prisma";

export async function listApplications() {
  return prisma.application.findMany({ orderBy: { createdAt: "desc" } });
}

export async function saveApplication(data: NewApplication) {
  return prisma.application.create({ data });
}

export async function setApplicationStage(
  id: number,
  stage: Stage,
): Promise<boolean> {
  const result = await prisma.application.updateMany({
    where: { id },
    data: { stage },
  });

  return result.count === 1;
}
