import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext'
import { LayoutContent } from '@/components/LayoutContent'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wellspace",
  description: "Navigate healthcare and improve your health outcomes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}


