
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const restaurants = await prisma.restaurant.findMany()
    console.log("Fetched restaurants:", restaurants)
    return res.status(200).json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return res.status(500).json({ error: "Failed to fetch restaurants" })
  } finally {
    await prisma.$disconnect()
  }
}