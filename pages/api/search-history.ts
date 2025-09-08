
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { query, filter, location } = req.body
  try {
    await prisma.searchHistory.create({
      data: {
        query,
        filter,
        location, // Add location to the model
        userId: null, // Add userId if authentication is implemented
      },
    })
    res.status(200).json({ message: "Search saved" })
  } catch (error) {
    console.error("Error saving search:", error)
    res.status(500).json({ error: "Failed to save search" })
  } finally {
    await prisma.$disconnect()
  }
}