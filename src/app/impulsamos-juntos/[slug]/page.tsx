import { notFound } from 'next/navigation'
import HeaderBanner from './_components/header-banner'
import { IMPULSEMOS_JUNTOS_CONTENT } from '../content/content'
import DataSlug from './_components/data-slug'
import MotorpointOptions from './_components/motor-point-opciones'
import VideosSlug from './_components/videos-slug'

const validPages = ["motorpoint", "rstronic", "esp-off-performance"]

const ImpulsamosJuntosPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const slug = (await params).slug;

    if (!validPages.includes(slug)) {
        notFound()
    }

    const content = IMPULSEMOS_JUNTOS_CONTENT[slug]

    return (
        <div>
            <HeaderBanner image={content.hero_section.image} instagram_url={content.instagram_url} />
            <div className='container mx-auto px-4'>
                <DataSlug slug={slug} />
                {slug === "motorpoint" ? <MotorpointOptions /> : <VideosSlug />}
            </div>
        </div>
    )
}

export default ImpulsamosJuntosPage