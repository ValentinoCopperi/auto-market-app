"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import React, { useState } from 'react'
import { toast } from 'sonner'

const BtnCancelar = ({ id_suscripcion }: { id_suscripcion: number }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const cancelar = async () => {
        setLoading(true)
        if (!user) {
            toast.error("Debes estar autenticado para cancelar tu suscripcion", {
                description: "Porfavor, inicia sesión para continuar.",
            })
            setLoading(false)
            return
        }
        try {
            const response = await fetch('/api/cancel-suscripcion', {
                method: 'POST',
                body: JSON.stringify({ subscriptionId: id_suscripcion, userId: user.id }),
            })

            if (!response.ok) {
                throw new Error("Error al cancelar la suscripcion")
            }

            const data = await response.json()

            if (data.error) {
                throw new Error(data.message)
            }

            toast.success("Suscripcion cancelada correctamente", {
                description: "Tu suscripcion ha sido cancelada correctamente.",
            })

        } catch (error) {
            console.error(error)
            toast.error("Error al cancelar tu suscripcion", {
                description: "Porfavor, intenta nuevamente.",
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:hover:border-red-800 dark:hover:bg-red-950/30"
                    >
                        Cancelar suscripción
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar suscripción</AlertDialogTitle>
                        <AlertDialogDescription>
                            Para cancelar tu suscripcion debes ir a mercado pago y cancelar la suscripcion desde el panel de control de suscripciones.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            <Button variant="outline" onClick={cancelar} disabled={loading}>Cancelar</Button>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>



        </>
    )
}

export default BtnCancelar