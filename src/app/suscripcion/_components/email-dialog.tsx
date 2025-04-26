import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface EmailDialogProps{
    loading:boolean;
    handleProceedToPayment:(email:string)=>void;
}

const EmailDialog = ({loading, handleProceedToPayment}:EmailDialogProps) => {
    const [email, setEmail] = useState("")
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
                    <DialogDescription>
                        Este email debe ser el que este asociado a su cuenta de Mercado Pago.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Email
                        </Label>
                        <Input id="email" type='email' value={email} className="col-span-3" onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} className="bg-blue-900 hover:bg-blue-800 text-white" type="submit" onClick={()=>handleProceedToPayment(email)}>
                        <ArrowRight className="ml-2 h-4 w-4" />
                        {loading ? "Procesando..." : "Proceder al pago"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmailDialog