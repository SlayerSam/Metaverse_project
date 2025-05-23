import "@/app/globals.css"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import dynamic from "next/dynamic"
import ClientLayout from "@/components/ClientLayout"

const ReduxProvider = dynamic(() => import('@/redux/redux-provider'), { ssr: false })

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased select-none",
          fontSans.variable
        )}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="top-right" />
            <ClientLayout>
              {children}
            </ClientLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
