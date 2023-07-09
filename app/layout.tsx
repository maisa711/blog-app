import '@styles/globals.css'
import Provider from '@components/Provider'
import Navbar from '@components/Navbar'
import { FavoritesProvider } from '@components/FavoritesContext'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Blog App',
  description: 'A blog app built with Next.js',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-main-bg'>
        <Provider>
          <FavoritesProvider>
            <main className={inter.className}>
              <Navbar />
              {children}
            </main>
          </FavoritesProvider>
        </Provider>
      </body>
    </html>
  )
}
