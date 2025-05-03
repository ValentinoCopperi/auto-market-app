"use client"

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useDialogStore } from '@/lib/store/dialogs-store'

const PublicarBtn = () => {
    const { openPublishDialog } = useDialogStore()
    return (
        <Button variant="outline" className="mb-4" onClick={openPublishDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Publicar
        </Button>
    )
}

export default PublicarBtn