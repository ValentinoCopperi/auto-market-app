"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Youtube } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  duration: string
}

interface VideosSectionProps {
  slug?: string
  videos?: VideoItem[]
}

const defaultVideos: VideoItem[] = [
  {
    id: "video1",
    title: "La chipié en 3 lugares y sigue fallando",
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-04-16%20032430-jhi45cNssgZZUa9TbFt5cKfYJPiatZ.png", // Replace with actual thumbnail URL
    duration: "25:23",
  },
  {
    id: "video2",
    title: "ASTRONIC 485 HP y 685 Nm",
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-04-16%20032430-jhi45cNssgZZUa9TbFt5cKfYJPiatZ.png", // Replace with actual thumbnail URL
    duration: "7:35",
  },
  {
    id: "video3",
    title: "TAMBALEO SOLUCIONADO - TEST ONBOARD",
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-04-16%20032430-jhi45cNssgZZUa9TbFt5cKfYJPiatZ.png", // Replace with actual thumbnail URL
    duration: "7:18",
  },
]

const VideosSection = ({ slug = "youtube-videos", videos = defaultVideos }: VideosSectionProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleWatchVideo = (videoId: string) => {
    setSelectedVideo(videoId)
    // Here you would typically open a modal or navigate to the video page
    window.open(`https://youtube.com/watch?v=${videoId}`, "_blank")
  }

  return (
    <section className="py-16 md:py-24" data-slug={slug} data-component="videos-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Button variant="outline" className="uppercase text-sm font-medium tracking-wider mb-2 bg-red-500 hover:bg-red-600 text-white hover:text-white">
            <Link href="https://www.youtube.com/@impulsamosjuntos" target="_blank" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Ir al canal de Youtube
            </Link>
          </Button>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Descubrí más en nuestro canal</h2>
          <p className="text-lg">Contenido exclusivo. Solo en nuestro canal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col">
              <div className="relative rounded-lg overflow-hidden mb-4 aspect-video">
                {/* Video thumbnail */}
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${video.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay for video titles */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white text-shadow font-bold">{video.title}</div>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 text-sm rounded">
                    {video.duration}
                  </div>
                </div>
              </div>

              {/* Watch button */}
              <Button
                variant="secondary"
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 w-full"
                onClick={() => handleWatchVideo(video.id)}
              >
                Ver Video
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideosSection
