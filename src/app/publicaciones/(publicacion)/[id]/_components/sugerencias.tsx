"use client"

import { PublicacionesGrid } from '@/components/publicaciones/publicaciones-grid';
import { Separator } from '@/components/ui/separator';
import { Publicacion } from '@/types/publicaciones';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface SugerenciasProps {
    marca: string;
    id: string;
}

const Sugerencias = ({ marca, id }: SugerenciasProps) => {

    const [sugerencias, setSugerencias] = useState<Publicacion[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchSugerencias = async () => {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/sugerencias?query=${marca}&id=${id}`)
            const data = await response.json()
            setSugerencias(data.suggestions)
            setLoading(false)
        }
        fetchSugerencias()
    }, [marca, id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Separator />
                <h2 className="text-2xl font-bold py-4">Sugerencias</h2>
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Separator />
            <h2 className="text-2xl font-bold py-4">Sugerencias</h2>
            <PublicacionesGrid publicaciones={sugerencias} />
        </div>
    )
}



export default Sugerencias