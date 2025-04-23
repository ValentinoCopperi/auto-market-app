import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { Providers } from "@/components/providers/providers";
import { LoginDialog } from "@/components/dialogs/auth/login-dialog";
import { PublishDialog } from "@/components/dialogs/publicar/publicar-dialog";
import { RegisterDialog } from "@/components/dialogs/auth/register-dialog";
const inter = Inter({
  weight: ['400', '500', '600'],
  style: 'normal',
  display: 'swap',
  subsets: ['latin-ext']
})
export const metadata: Metadata = {
  title: "Demo",
  description: "Demo",
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
          </Providers>
        </div>

      </body>
    </html>
  );
}
