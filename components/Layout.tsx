import Link from "next/link"
import React from "react"
import { ArrowLeftOnRectangleIcon, BookmarkIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline"
import { HomeIcon as HomeIconSolid, BookmarkIcon as BookmarkIconSolid, UserIcon as UserIconSolid } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"

const TwitterSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" data-name="Layer 1" viewBox="0 0 24 24" id="twitter"><path fill="#fff" d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z"></path></svg>
)

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    // router.pathname == "/login"
    if (router.pathname == "/login") {
        return <div>{children}</div>
    }
    return <main className="w-full h-screen flex">
        <div className="w-20 lg:w-1/4 shrink-0 grow-0 border-r border-neutral-600 bg-black text-white h-screen">
            <div className="h-screen flex flex-col space-y-6 p-4">
                <div className="flex w-full justify-center lg:justify-end">
                    <div className="w-60 flex flex-col items-center lg:items-start gap-6">
                        <div className="px-0 lg:px-8">
                            <TwitterSVG />
                        </div>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/">
                            {router.pathname == "/" ? <HomeIconSolid className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/" ? "font-bold" : "font-light"}`}>Home</p>
                        </Link>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/bookmarks">
                            {router.pathname == "/bookmarks" ? <BookmarkIconSolid className="h-6 w-6" /> : <BookmarkIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/bookmarks" ? "font-bold" : "font-light"}`}>Bookmarks</p>
                        </Link>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/profile">
                            {router.pathname == "/profile" ? <UserIconSolid className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/profile" ? "font-bold" : "font-light"}`}>Profile</p>
                        </Link>
                        <button className="flex items-center gap-4 px-0 lg:px-8" onClick={() => signOut()}>
                            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                            <p className="text-lg hidden lg:inline-flex font-light">Logout</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {children}
    </main>
}