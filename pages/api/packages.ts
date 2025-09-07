
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const packages = await prisma.package.findMany()
    console.log("Fetched packages:", packages) // Debug
    res.status(200).json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    res.status(500).json({ error: "Failed to fetch packages" })
  } finally {
    await prisma.$disconnect()
  }
}
