import { Button } from '@/components/ui/button'
import { Planes } from '@/types/suscriciones';
import {  Check, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React from 'react'

interface Plan {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    tipoPago: string;
    destacado: boolean;
    features: string[];
}

interface SuscripcionCardProps {
    plan: Plan;
    selectedPlan: Planes | null;
    handleSelectPlan: (plan: Planes) => void;
}

const SuscripcionCard = ({ plan, selectedPlan, handleSelectPlan}: SuscripcionCardProps) => {

    return (
        <div
        
            className={`bg-card rounded-xl border ${selectedPlan === plan.id ? "border-primary border-2" : "border-border"} overflow-hidden shadow-sm flex flex-col transition-all duration-200`}
        >
            <div className="p-6 border-b border-border">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">{plan.nombre}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{plan.descripcion}</p>
                    </div>
                    {
                        plan.destacado ? (
                            <Badge variant="outline" className="bg-primary text-primary-foreground">Recomendado</Badge>
                        ) : (

                            <Crown className="h-5 w-5 text-amber-500" />
                        )
                    }
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.precio}</span>
                    <span className="text-muted-foreground ml-1">{plan.tipoPago}</span>
                </div>
            </div>

            <div className="p-6 flex-grow">
                <ul className="space-y-3">
                    {plan.features.map((feature) => (
                        <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}


                </ul>
            </div>
            <div className="p-6 border-t border-border">
                <Button
                    className="w-full"
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id as Planes)}
                >
                    {selectedPlan === plan.id ? "Plan Seleccionado" : "Seleccionar Plan"}
                </Button>
            </div>
        </div>
    )
}

export default SuscripcionCard