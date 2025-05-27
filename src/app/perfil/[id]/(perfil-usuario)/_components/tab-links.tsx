"use client";
import { cn } from '@/lib/utils';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Car, Star, ShoppingCart } from 'lucide-react';

interface TabLinksProps {
  id: string;
}

const TabLinks = ({ id }: TabLinksProps) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Publicaciones',
      href: `/perfil/${id}/publicaciones`,
      icon: Car,
      exact: true
    },
    {
      name: 'Reseñas',
      href: `/perfil/${id}/resenas`,
      icon: Star
    },
    {
      name: 'Autos vendidos',
      href: `/perfil/${id}/vendidos`,
      icon: ShoppingCart
    }
  ];

  return (
    <div className="border-b border-border">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.exact 
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 py-4 text-sm font-medium transition-colors hover:text-primary',
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TabLinks;