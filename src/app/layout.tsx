import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { Providers } from "@/components/providers/providers";
import { LoginDialog } from "@/components/dialogs/auth/login-dialog";
import { PublishDialog } from "@/components/dialogs/publicar/publicar-dialog";
import { RegisterDialog } from "@/components/dialogs/auth/register-dialog";
import { Footer } from "@/components/footer";
const inter = Inter({
  weight: ['400', '500', '600'],
  style: 'normal',
  display: 'swap',
  subsets: ['latin-ext']
})
export const metadata: Metadata = {
  title: "Demo car market",
  description: "Demo car market",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logo.png", // Ícono para dispositivos Apple (opcional)
    shortcut: "/logo.png", // Ícono para accesos directos (opcional)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <div className="min-h-screen bg-background text-foreground">
          <Providers>
            <NavBar />
            {children}
            <LoginDialog />
            <PublishDialog />
            <RegisterDialog />
            <Footer />
          </Providers>
        </div>

      </body>
    </html>
  );
}
