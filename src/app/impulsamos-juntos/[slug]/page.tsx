import { notFound } from 'next/navigation'
import HeaderBanner from './_components/header-banner'
import { IMPULSEMOS_JUNTOS_CONTENT } from '../content/content'
import DataSlug from './_components/data-slug'
import DynacoSlug from './_components/dynaco-slug'
import PhotoGallery from './_components/galery-photos'
const validPages = ["esp-off-performance", "dynaco-consulting"]

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const slug = (await params).slug;

    if (!validPages.includes(slug)) {
        notFound()
    }

    const { data_slug } = IMPULSEMOS_JUNTOS_CONTENT[slug]

    return {
        title: data_slug.title,
        description: data_slug.description,
        openGraph: {
            title: data_slug.title,
            description: data_slug.description,
        }
    }
}

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
            <HeaderBanner  instagram_url={content.instagram_url} />
            <div className='container mx-auto px-4'>
                <DataSlug slug={slug} instagram_url={content.instagram_url} />
                {
                    slug === "esp-off-performance" ?
                        <PhotoGallery /> :
                        <DynacoSlug instagram_url={content.instagram_url} />
                }
            </div>
        </div>
    )
}

export default ImpulsamosJuntosPage