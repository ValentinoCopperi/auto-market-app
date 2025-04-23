import { Button } from "@/components/ui/button"
import { Check, Instagram } from "lucide-react"
import { IMPULSEMOS_JUNTOS_CONTENT } from "../../content/content"
import Image from "next/image"

interface ServiceFeaturesSectionProps {
    slug: string
}

const DataSlug = ({ slug }: ServiceFeaturesSectionProps) => {

    const content = IMPULSEMOS_JUNTOS_CONTENT[slug]

    return (
        <section className="py-16 md:py-24 " data-slug={slug} data-component="motorpoint-features">
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold ">{content.data_slug.title}</h2>

                        <p className="text-lg ">
                            {content.data_slug.description}
                        </p>

                        <div className="space-y-4 pt-4">
                            {
                                content.data_slug.features.map((feature) => (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-600 rounded-full p-1 mt-1">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="">{feature}</p>
                                    </div>
                                ))
                            }

                        </div>

                        <div className="pt-4">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 h-auto rounded-md flex items-center text-sm">
                                <Instagram className="h-4 w-4 mr-2" />
                                Visita nuestro instagram
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end">

                        <div className="relative w-[600px] h-[500px]">
                            <Image src={content.data_slug.image} className="object-cover rounded-2xl" alt="data-slug" fill />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default DataSlug
