import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { useState } from "react"
import { useDropzone } from "react-dropzone"

export default function TweetForm({ onSubmit, txt, setTxt, base64, setBase64, profileImage, label }: {
    onSubmit: () => void,
    txt: string,
    setTxt: (value: string) => void,
    base64: string,
    setBase64: (value: string) => void,
    profileImage: string,
    label: string
}) {
    const [sending, setSending] = useState<boolean>(false)

    async function submit() {
        setSending(true)
        // hit the create post api
        await onSubmit()
        setBase64('')
        setSending(false)
    }

    function handleDrop(files: File[]) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (event: any) => {
            setBase64(event.target.result) // base64 string
        }
        reader.readAsDataURL(file)
    }

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: handleDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    })
    return <div className="w-full border-b border-neutral-600 pl-4 pr-6 py-6 flex">
        <div className="w-16 shrink-0 grow-0 mr-2 flex flex-col items-center">
            <Image
                className="rounded-full h-12 w-12"
                src={profileImage}
                height={1000}
                width={1000}
                alt="profile pic"
            />
        </div>
        <div className="flex flex-col gap-4 flex-grow items-stretch">
            <div onBlur={e => setTxt(e.target.innerHTML)} contentEditable suppressContentEditableWarning className="w-full text-lg outline-none mb-4"></div>
            {base64 ? <div className="relative mb-4">
                <div onClick={() => setBase64("")} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-40 cursor-default"><XMarkIcon className="h-4 w-4" /></div>
                <Image
                    src={base64}
                    className="rounded-xl w-full"
                    height={1000}
                    width={1000}
                    alt="uploaded"
                />
            </div> : null}
            <div className="w-full flex items-center justify-between">
                <div {...getRootProps({ className: "hover:bg-blue-900 hover:bg-opacity-30 rounded-full p-2 cursor-pointer w-fit" })}>
                    <input {...getInputProps()} />
                    <PhotoIcon className="text-blue-500 h-6 w-6" />
                </div>
                <button disabled={sending} onClick={submit} className="bg-blue-500 hover:bg-blue-600 font-bold w-24 h-10 flex items-center justify-center rounded-full">
                    {sending ? <div className='border-2 w-5 h-5 border-white border-t-transparent animate-spin rounded-full'></div> : label}
                </button>
            </div>
        </div>
    </div>
}