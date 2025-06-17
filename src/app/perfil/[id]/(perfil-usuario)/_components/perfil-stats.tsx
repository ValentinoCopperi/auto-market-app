import { Button } from "@/components/ui/button"
import { Star, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PerfilStatsProps {
  calificacion: number
  numResenas: number
  editable: boolean
}

export const PerfilStats = ({ calificacion, numResenas, editable }: PerfilStatsProps) => {
  const stats = [
    {
      name: "Calificación",
      value: isNaN(calificacion) || !calificacion ? 0 : calificacion.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
    },
    {
      name: "Reseñas",
      value: isNaN(numResenas) || !numResenas ? 0 : numResenas,
      icon: MessageSquare,
      color: "text-blue-500",
    },
  ]

  const StatsContent = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex flex-col items-center text-center">
            <div className={`p-2 rounded-full bg-muted mb-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>
      {editable && (
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <Link href="/resenas">Ver detalles</Link>
          </Button>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Desktop version - normal card */}
      <div className="hidden lg:block bg-card rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
        <StatsContent />
      </div>

      {/* Mobile version - accordion */}
      <div className="lg:hidden bg-card rounded-lg border border-border shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stats" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h3 className="text-lg font-semibold">Estadísticas</h3>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <StatsContent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}
