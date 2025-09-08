
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const foods = await prisma.restaurant.findMany()
    console.log("Fetched foods:", foods)
    return res.status(200).json(foods)
  } catch (error) {
    console.error("Error fetching foods:", error)
    return res.status(500).json({ error: "Failed to fetch foods" })
  } finally {
    await prisma.$disconnect()
  }
}