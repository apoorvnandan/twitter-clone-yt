import { signIn } from "next-auth/react"

export default function Login() {
    return <div className="w-full h-screen flex items-center justify-center">
        <button className="flex text-white rounded-sm border border-blue-500" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <div className="w-12 h-12 bg-white flex items-center justify-center">
                <img className="h-5 w-5" src='https://developers.google.com/identity/images/g-logo.png' />
            </div>
            <div className="bg-blue-500 px-2 flex items-center self-stretch font-medium">
                Sign in with Google
            </div>
        </button>
    </div>
}