import { MensajesProvider } from "@/hooks/use-mensajes";
import { getSession } from "@/lib/session/session";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {

    

    return (
        <MensajesProvider>
            {children}
        </MensajesProvider>
    )
}       
