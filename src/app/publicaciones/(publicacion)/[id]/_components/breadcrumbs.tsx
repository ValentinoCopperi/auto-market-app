import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"
interface BreadcrumbsProps {
  marca?: string
  modelo?: string
  titulo: string
}

export function Breadcrumbs({ marca, modelo, titulo }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="flex flex-wrap items-center text-sm text-muted-foreground"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors" itemProp="item">
            <Home className="h-4 w-4 mr-1" />
            <span itemProp="name">Inicio</span>
          </Link>
          <meta itemProp="position" content="1" />
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
        </li>

        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
          <Link href="/publicaciones" className="hover:text-foreground transition-colors" itemProp="item">
            <span itemProp="name">Publicaciones</span>
          </Link>
          <meta itemProp="position" content="2" />
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
        </li>

        {marca && (
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
            <Link
              href={`/publicaciones?marca=${encodeURIComponent(marca)}`}
              className="hover:text-foreground transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{marca}</span>
            </Link>
            <meta itemProp="position" content="3" />
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
          </li>
        )}

        {modelo && (
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
            <Link
              href={`/publicaciones?marca=${encodeURIComponent(marca || "")}&q=${encodeURIComponent(modelo)}`}
              className="hover:text-foreground transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{modelo}</span>
            </Link>
            <meta itemProp="position" content="4" />
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
          </li>
        )}

      
      </ol>
    </nav>
  )
}
