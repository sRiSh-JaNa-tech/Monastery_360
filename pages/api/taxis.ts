
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const taxis = await prisma.taxi.findMany()
    console.log("Fetched taxis:", taxis)
    return res.status(200).json(taxis)
  } catch (error) {
    console.error("Error fetching taxis:", error)
    return res.status(500).json({ error: "Failed to fetch taxis" })
  } finally {
    await prisma.$disconnect()
  }
}