import { ArrowPathRoundedSquareIcon, BookmarkIcon, ChatBubbleLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { Post, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

export default function TweetBox({ onClick, userData, post, userEmail }: {
    onClick: () => void,
    userData: User,
    post: Post,
    userEmail: string
}) {
    const [likedEmails, setLikedEmails] = useState<Array<string>>(post.likedUserEmails)
    const [bookmarkedEmails, setBookmarkedEmails] = useState<Array<string>>(post.bookmarkedUserEmails)

    function isLiked() {
        return likedEmails.includes(userEmail)
    }

    function isBookmarked() {
        return bookmarkedEmails.includes(userEmail)
    }

    async function like() {
        let newLikedUserEmails = []
        if (post.likedUserEmails.includes(userEmail)) {
            newLikedUserEmails = post.likedUserEmails.filter(email => email != userEmail)
            console.log(newLikedUserEmails)
        } else {
            newLikedUserEmails = [...post.likedUserEmails, userEmail]
            console.log(newLikedUserEmails)
        }
        setLikedEmails(newLikedUserEmails)
        const response = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: post.id,
                likedUserEmails: newLikedUserEmails
            })
        })
        if (response.status == 200) {
            const data = await response.json()
            setLikedEmails(data.post.likedUserEmails)
        }
    }

    async function bookmark() {
        let newBookmarkedUserEmails = []
        if (post.bookmarkedUserEmails.includes(userEmail)) {
            newBookmarkedUserEmails = post.bookmarkedUserEmails.filter(email => email != userEmail)
            console.log(newBookmarkedUserEmails)
        } else {
            newBookmarkedUserEmails = [...post.bookmarkedUserEmails, userEmail]
            console.log(newBookmarkedUserEmails)
        }
        setBookmarkedEmails(newBookmarkedUserEmails)
        const response = await fetch("/api/bookmark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: post.id,
                bookmarkedUserEmails: newBookmarkedUserEmails
            })
        })
        if (response.status == 200) {
            const data = await response.json()
            setBookmarkedEmails(data.post.bookmarkedUserEmails)
        }
    }

    return <div onClick={onClick} className="p-4 border-b border-neutral-600 flex">
        <div className="w-16 shrink-0 grow-0 mr-2 flex flex-col items-center">
            <Image
                className="rounded-full h-12 w-12"
                src={userData?.profileImage as string}
                height={1000}
                width={1000}
                alt="profile pic"
            />
        </div>
        <div className="flex-grow">
            <p className="font-bold">{userData?.name} <span className="font-normal text-neutral-400 ml-2">@{userData?.username}</span></p>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: post?.body }}></div>
            {post?.image != "" ? <Image
                className="w-full rounded-xl"
                src={post?.image as string}
                width={1000}
                height={1000}
                alt="tweet image"
            /> : null}
            <div className="flex gap-12 pt-4">
                <button className="flex items-center gap-2 hover:text-blue-500"><ChatBubbleLeftEllipsisIcon className="h-5 w-5" />{post?.commentIds.length}</button>
                <button className="flex items-center gap-2 hover:text-blue-500"><ArrowPathRoundedSquareIcon className="h-5 w-5" />{0}</button>
                <button onClick={(e) => { e.stopPropagation(); like() }} className="flex items-center gap-2 hover:text-blue-500">{isLiked() ? <HeartIconSolid className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}{likedEmails.length}</button>
                <button onClick={(e) => { e.stopPropagation(); bookmark() }} className="flex items-center gap-2 hover:text-blue-500">{isBookmarked() ? <BookmarkIconSolid className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}{bookmarkedEmails.length}</button>
            </div>
        </div>
    </div>
}