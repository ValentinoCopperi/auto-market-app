import { MensajesProvider } from "@/hooks/use-mensajes";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession();

    // if(!session?.userId || !session?.email){
    //     redirect("/");
    // }

    return (
        <MensajesProvider>
            {children}
        </MensajesProvider>
    )
}       
