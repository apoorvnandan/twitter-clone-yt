import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    if (req.method == "GET") {
        const email = req.query.email as string
        const posts = await prisma.post.findMany({
            where: {
                bookmarkedUserEmails: {
                    has: email
                }
            }
        })
        let userData = []
        for (let i = 0; i < posts.length; i++) {
            const user = await prisma.user.findUnique({
                where: {
                    email: posts[i].userEmail
                }
            })
            userData.push(user)
        }
        res.status(200).json({ posts, userData })
        return
    }
    if (req.method == "POST") {
        const post = await prisma.post.update({
            where: {
                id: req.body.id
            },
            data: {
                bookmarkedUserEmails: req.body.bookmarkedUserEmails
            }
        })
        res.status(200).json({ msg: "done", post })
    }
    res.status(201).json({ msg: "incorrect request" })
}