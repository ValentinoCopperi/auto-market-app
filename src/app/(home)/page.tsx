


import LandingPage from "./_componenets/landing-page"
import { CategorySection } from "./_componenets/category-section"
import { BrandsSection } from "./_componenets/brands-section"
import { PublicacionesDestacadas } from "./_componenets/publicaciones-destacadas"
import { getSession } from "@/lib/session/session"

const HomePage = async () => {
 
  return (
    <div>
        <LandingPage />
        <div className="bg-[#F9FAFB] dark:bg-[#00000063]">
            <div className="container">
                <CategorySection />
                <BrandsSection />
                <PublicacionesDestacadas />
            </div>
        </div>
    </div>
  )
}

export default HomePage