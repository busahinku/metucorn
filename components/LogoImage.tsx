'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

export default function LogoImage() {
  const [imageError, setImageError] = useState(false)

  // If logo.png exists in /public, it will show
  // If not, fallback to the gradient box
  if (imageError) {
    return (
      <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center flex-shrink-0">
        <Play className="w-10 h-10 text-white fill-white" />
      </div>
    )
  }

  return (
    <div className="w-20 h-20 relative flex items-center">
      <Image
        src="/logo.png"
        alt="metucorn"
        width={160}
        height={160}
        className="rounded-lg object-contain w-full h-full"
        onError={() => setImageError(true)}
        priority
      />
    </div>
  )
}

