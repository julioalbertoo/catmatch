import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CatMatch',
  description: 'Reconoce gatos callejeros por una foto: ¿ya está registrado por aquí o es nuevo?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
