import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface EmailDialogProps {
    loading: boolean;
    handleProceedToPayment: (email: string) => void;
    email: string;
    setEmail: (email: string) => void;
    code: string | null;
    setCode: (code: string | null) => void;
}

const EmailDialog = ({ loading, handleProceedToPayment, email, setEmail, code, setCode }: EmailDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={loading} className="bg-blue-900 hover:bg-blue-800 text-white">
                    {loading ? "Procesando..." : "Proceder al pago"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ingrese su email</DialogTitle>
                    
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-2">
                        <Label >
                            Email
                        </Label>
                        <Input id="email" type='email' value={email} className="col-span-3" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        *Usa el email asociado a tu cuenta de Mercado Pago para recibir notificaciones de tu suscripción y gestionar su cancelación.
                    </p>

                    <div className="grid grid-cols-4 items-center gap-2">
                        <Label>
                            Codigo de activacion
                        </Label>
                        <Input id="code" type='text' value={code || ""} className="col-span-3" onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <p className='text-xs text-muted-foreground'>*Si tiene el codigo de activacion, ingreselo aqui, sino deje el campo vacio</p>
                </div>
                <DialogFooter>
                    <Button disabled={loading} className="bg-blue-900 hover:bg-blue-800 text-white" type="submit" onClick={() => handleProceedToPayment(email)}>
                        <ArrowRight className="ml-2 h-4 w-4" />
                        {loading ? "Procesando..." : "Proceder al pago"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmailDialog