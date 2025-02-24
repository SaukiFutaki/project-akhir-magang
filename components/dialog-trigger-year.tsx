import React from 'react'
import { DialogTrigger } from './ui/dialog'
import { FileText } from 'lucide-react'
import Image from 'next/image'

interface DialogTriggerYearViewProps {
    index : number;
    file : {
        url : string;
    }
}

export default function DialogTriggerYearView({file,index} : DialogTriggerYearViewProps) {
  return (
    <DialogTrigger asChild>
    {file.url
      .toLowerCase()
      .endsWith(".pdf") ? (
      <div className="relative aspect-video cursor-pointer group bg-gray-100 rounded-md border-2 border-white flex items-center justify-center">
        <FileText className="w-16 h-16 text-gray-500" />
        <div className="absolute bottom-2 left-2 right-2 text-sm text-gray-600 truncate">
          {file.url.split("/").pop()}
        </div>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
      </div>
    ) : (
      <div className="relative aspect-video cursor-pointer group">
        <Image
          width={200}
          height={200}
          src={file.url}
          alt={`Documentation ${
            index + 1
          }`}
          className="rounded-md object-cover w-full h-full border-2 border-white transition-all group-hover:opacity-90 group-hover:scale-[1.02]"
        />
      </div>
    )}
  </DialogTrigger>
  )
}
