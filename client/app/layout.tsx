import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import '@ant-design/v5-patch-for-react-19';
import QueryClientProvider from "./hooks/QueryClientProvider"

const inter = Inter({ subsets: ["latin"] })

console.log('%cDeveloped by Osama Benali', 'color: green; font-size: 18px; font-weight: bold;');

export const metadata: Metadata = {
  title: "wessAcademy - Foundation for a Better Future",
  description: "A community with high expectation and high academic achievement",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </QueryClientProvider>
      </body>
    </html>
  )
}