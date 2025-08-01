import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KidsActivitiesNear - Find Amazing Activities For Your Kids',
  description: 'Discover exciting activities, classes, and experiences for your children across the top 25 US cities. From preschools to summer camps, we help you find what your kids will love.',
  keywords: 'kids activities, children activities, preschools, summer camps, after school programs, sports for kids, arts and crafts',
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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

