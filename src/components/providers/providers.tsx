import { AuthProvider } from "@/hooks/use-auth"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                    {children}
                    <Toaster />
            </AuthProvider>
        </ThemeProvider>
    )
}


