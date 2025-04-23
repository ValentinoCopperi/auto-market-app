import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, SendHorizonal } from 'lucide-react'
import React, { useState }  from 'react'
import { useMensajes } from '@/hooks/use-mensajes'

const InputSendMessage = () => {
    
    const [message, setMessage] = useState("")
    const { sendMessage, isSending} = useMensajes()

    const handleSendMessage = () => {
        sendMessage({ message })
        setMessage("")
    }

    return (
        <div className='flex items-center justify-center py-2 px-4'>
            <Input
                placeholder='Escribe un mensaje'
                className='w-full'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type='text'
                disabled={isSending}
            />
            <Button
                variant='outline'
                className='w-10 h-10'
                disabled={isSending}
                onClick={handleSendMessage}
            >
                <SendHorizonal className='w-4 h-4' />
            </Button>


        </div>
    )
}

export default InputSendMessage