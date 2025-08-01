import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CityBrowseSection from '@/components/CityBrowseSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <CityBrowseSection />
      </main>
      <Footer />
    </div>
  )
}

