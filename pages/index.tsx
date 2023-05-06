import Image from 'next/image'
import { Inter } from 'next/font/google'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import TweetForm from '@/components/TweetForm'
import { Post, User } from '@prisma/client'
import TweetBox from '@/components/TweetBox'
import { Router, useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true
  })
  const [username, setUsername] = useState<string>("")
  const [profileImage, setProfileImage] = useState<string>("/blank_pp.webp")
  const [base64, setBase64] = useState<string>("") // image that gets uploaded in new tweet
  const [txt, setTxt] = useState<string>("") // body of the new tweet
  const [key, setKey] = useState<number>(0) // key of the tweet form component
  const [tweets, setTweets] = useState<Array<Post>>([])
  const [tweetUserData, setTweetUserData] = useState<Array<User>>([])
  const [loading, setLoading] = useState<boolean>(true)

  async function tweet() {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: txt,
        userEmail: session?.user?.email,
        image: base64
      })
    })
    if (response.status == 200) {
      // fetch the tweets
      await getTweets()
      setBase64("") // reset the uploaded image
      setKey(key + 1) // reset the contenteditable div
    }
  }

  async function getTweets() {
    const response = await fetch("/api/post")
    if (response.status == 200) {
      const data = await response.json()
      setTweets(data.posts)
      setTweetUserData(data.userData)
      setLoading(false)
    }
  }

  function makeid(length: number) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async function getUser(email: string) {
    const params = new URLSearchParams({
      email: email
    })
    const response = await fetch("/api/user?" + params)
    if (response.status == 200) {
      const data = await response.json()
      return data
    }
  }

  async function createUser() {
    const email = session?.user?.email as string
    const name = session?.user?.name as string
    const username = session?.user?.name?.split(" ")[0] + "_" + makeid(6) as string
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        name,
        username,
        profileImage: "/blank_pp.webp"
      })
    })
    if (response.status == 200) {
      const data = await response.json()
      return data
    }
  }

  useEffect(() => {
    async function f() {
      if (status != "loading" && session) {
        const data = await getUser(session.user?.email as string)
        if (data.msg == "new user") {
          const userData = await createUser()
          if (userData) {
            setUsername(userData.user.username)
            setProfileImage(userData.user.profileImage)
          }
        } else {
          setUsername(data.user.username)
          setProfileImage(data.user.profileImage)
        }
        await getTweets()
      }
    }
    f()
  }, [status, session])

  if (status == "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-grow h-screen overflow-y-scroll bg-black text-white">
      <header className='sticky top-0 flex w-full z-10'>
        <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex items-center border-b border-neutral-600 px-4">
          <h1 className='text-lg font-bold'>Home</h1>
        </div>
        <div className='hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600'></div>
      </header>
      <div className='relative -top-16 w-full flex'>
        <div className='w-full lg:w-3/5 grow-0 shrink-0'>
          <div className='flex flex-col pt-16 min-h-screen'>
            <TweetForm
              key={key}
              onSubmit={tweet}
              txt={txt}
              setTxt={setTxt}
              profileImage={profileImage}
              base64={base64}
              setBase64={setBase64}
              label="Submit"
            />
            {/* list of tweets */}
            {loading ? <div className='flex justify-center p-8'>
              loading...
            </div> : tweets.map((post: Post, i: number) => (
              <TweetBox
                onClick={() => router.push(`/tweet/${post.id}`)}
                key={post.id}
                post={post}
                userData={tweetUserData[i]}
                userEmail={session.user?.email as string}
              />
            ))}
          </div>
        </div>
        <div className='border-l border-neutral-600 flex-grow self-stretch relative top-16'></div>
      </div>
    </div>
  )
}
