import Header from '@/components/Header/Header'
import './globals.css'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'My Blog',
  description: 'Учебный блог на Next.js + Tailwind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto flex-1 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
