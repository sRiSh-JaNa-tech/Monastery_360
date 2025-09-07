
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const festivals = await prisma.festival.findMany()
    console.log("Fetched festivals:", festivals) // Debug
    res.status(200).json(festivals)
  } catch (error) {
    console.error("Error fetching festivals:", error)
    res.status(500).json({ error: "Failed to fetch festivals" })
  } finally {
    await prisma.$disconnect()
  }
}