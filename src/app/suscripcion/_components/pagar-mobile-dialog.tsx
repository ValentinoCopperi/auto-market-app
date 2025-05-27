import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from '@/components/ui/input';

interface PagarMobileDialogProps {
    open: boolean;
    handleProceedToPayment: () => Promise<void>;
    loading: boolean;
    selectedPlan: string | null;
    code: string | null;
    setCode: (code: string) => void;
}

const PagarMobileDialog = ({ open, handleProceedToPayment, loading, selectedPlan, code, setCode }: PagarMobileDialogProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!open || !selectedPlan) return null;

    return (
        <motion.div
            className='block md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border'
            initial={{y: 100}}
            animate={{y: 0}}
            exit={{y: 100}}
            transition={{ type: "spring", damping: 20 }}
        >
            <div className='container mx-auto px-4 py-4'>
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-sm text-muted-foreground'>Plan seleccionado</span>
                            <h2 className='text-xl font-semibold'>{selectedPlan}</h2>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full'>
                                <Check className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="h-8 w-8"
                            >
                                {isCollapsed ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className='flex flex-col gap-2'>
                                    <p className='text-sm text-muted-foreground'>
                                        *Todos los pagos son procesados por Mercado Pago.
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        *Si tienes un codigo de descuento, ingresalo en el campo y presiona el boton de proceder al pago.
                                    </p>
                                    <Input
                                        placeholder="Codigo de descuento..."
                                        type="text"
                                        value={code || ""}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <Button 
                                        className='w-full' 
                                        onClick={handleProceedToPayment}
                                        disabled={loading}
                                    >
                                        {loading ? "Procesando..." : "Proceder al pago"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

export default PagarMobileDialog