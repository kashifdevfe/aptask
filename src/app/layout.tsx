import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'APTASK - AI-First Email Client',
  description: 'Modern, AI-powered universal email client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
