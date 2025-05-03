"use client";
import { cn } from '@/lib/utils';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const TabLinks = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const tabs = [
    { value: 'publicaciones', label: 'Publicaciones', href: `/perfil/${id}/publicaciones` },
    { value: 'resenas', label: 'Reseñas', href: `/perfil/${id}/resenas` },
    { value: 'vendidos', label: 'Vendidos', href: `/perfil/${id}/vendidos` },
  ];

  return (
    <div className="grid w-full grid-cols-3 gap-1 mb-6 rounded-lg">
      {tabs.map((tab) => {
        // Check if the current tab is active by comparing the href with the current pathname
        const isActive = pathname === tab.href;

        return (
          <div
            key={tab.value}
            className={cn(
              'relative flex items-center justify-center py-2 px-3 text-sm font-medium transition-all duration-200 rounded-md sm:py-2.5 sm:px-4',
              isActive
                ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-semibold'
                : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:scale-[1.02] dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800',
              'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1',
              'cursor-pointer'
            )}
          >
            <Link
              href={tab.href}
              className="w-full h-full flex items-center justify-center"
            >
              {tab.label}
            </Link>
            {/* Active tab indicator (bottom border) */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabLinks;