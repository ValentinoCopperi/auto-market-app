import { create } from 'zustand'

type DialogType = 'iniciar_sesion' | 'registrarse' | 'publicar' | null

interface DialogState {
  // Estado
  dialogType: DialogType
  isOpen: boolean
  
  // Acciones
  openRegisterDialog: () => void
  openLoginDialog: () => void
  openPublishDialog: () => void
  closeDialog: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  // Estado inicial
  dialogType: null,
  isOpen: false,
  
  // Acciones
  openRegisterDialog: () => set({ dialogType: 'registrarse', isOpen: true }),
  openLoginDialog: () => set({ dialogType: 'iniciar_sesion', isOpen: true }),
  openPublishDialog: () => set({ dialogType: 'publicar', isOpen: true }),
  closeDialog: () => set({ isOpen: false, dialogType: null }),
}))