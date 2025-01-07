import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from "@/components/ui/use-toast"
import "./globals.css"

export const metadata = {
  title: 'Wellspace',
  description: 'Navigate healthcare and improve your health outcomes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}


