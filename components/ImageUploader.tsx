// components/ImageUploader.tsx
"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { createClient } from "@/lib/supabase/client"

export default function ImageUploader({ onUpload }: { onUpload: (urls: string[]) => void }) {
    const [uploading, setUploading] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>([])

    const supabase = createClient()
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true)

        const urls: string[] = []

        for (const file of acceptedFiles) {
            const fileExt = file.name.split(".").pop()
            const filePath = `${Date.now()}-${Math.random()}.${fileExt}`

            const { data, error } = await supabase.storage
                .from("products") // your bucket name
                .upload(filePath, file)

            if (error) {
                console.error("Upload error:", error)
                continue
            }

            const url = supabase.storage.from("products").getPublicUrl(filePath).data.publicUrl
            urls.push(url)
        }

        setImageUrls(prev => [...prev, ...urls])
        onUpload(urls)
        setUploading(false)
    }, [onUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    })

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded-lg text-center transition ${
                    isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p className="text-gray-500">Uploading...</p>
                ) : (
                    <p className="text-gray-500">Drag & drop images here, or click to select</p>
                )}
            </div>

            {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Uploaded ${index}`}
                            className="w-full h-40 object-cover rounded"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}