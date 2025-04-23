import { create } from "zustand"

interface SearchingStore {
    searching: boolean
    setSearching: (searching: boolean) => void
}

export const useSearchingStore = create<SearchingStore>((set) => ({
    searching: false,
    setSearching: (searching) => set({ searching })
}))
