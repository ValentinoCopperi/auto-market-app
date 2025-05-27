import { Button } from '@/components/ui/button';
import { Star, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface PerfilStatsProps {
  calificacion: number;
  numResenas: number;
  editable: boolean;
}

export const PerfilStats = ({ calificacion, numResenas, editable }: PerfilStatsProps) => {
  const stats = [
    {
      name: 'Calificación',
      value: calificacion.toFixed(1),
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      name: 'Reseñas',
      value: numResenas,
      icon: MessageSquare,
      color: 'text-blue-500'
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
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
      {
        editable && (
          <div className="mt-4">
            <Button variant="outline" className='w-full'>
              <Link href="/resenas">
                Ver detalles
              </Link>
            </Button>
          </div>
        )
      }
    </div>
  );
};

