"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { MessageSquare } from 'lucide-react'
import { ChatDialog } from '../dialogs/chat/chat-dialog'
import { MensajesProvider } from '@/hooks/use-mensajes'

const MessageBtn = ({ title, publicacionId, vendedorId }: { title: string, publicacionId: number, vendedorId: number }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
                <Button variant="outline" size="icon" className="w-[10%]" onClick={() => setOpen(true)}>
                    <MessageSquare className="h-4 w-4" />
                </Button>
                {
                    open && (
                        <MensajesProvider>
                            <ChatDialog
                                open={open}
                                onOpenChange={setOpen}
                                vehicleTitle={title}
                                publicacionId={publicacionId}
                                vendedorId={vendedorId}
                            />
                        </MensajesProvider>
                    )
                }
        </>
    )
}

export default MessageBtn
