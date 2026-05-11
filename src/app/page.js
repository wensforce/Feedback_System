'use client';

export default function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210';
  const whatsappBookingLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20WENSFORCE%2C%20I%20would%20like%20to%20book%20your%20services.`;
  const mainWebsiteLink = 'https://wensforce.com';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-yellow-600/20 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-15 h-15" src="/logo.png" alt="WENS FORCE Logo" />
            <div>
              <div className="text-lg tracking-widest text-white font-bold">WENS Force</div>
            </div>
          </div>
          <a
            href={mainWebsiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors border-b border-yellow-600/30 pb-1"
          >
            OFFICIAL WEBSITE
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <div className="mb-8 inline-block px-6 py-2 border border-yellow-600/30 rounded-sm text-xs font-light tracking-widest text-yellow-400">
            PREMIUM SERVICES
          </div>
          <h1 className="text-6xl lg:text-7xl font-light mb-8 tracking-tight">
            Luxury & <span className="text-yellow-400">Protection</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Experience elite security and luxury transportation services designed for discerning clientele. Professional excellence, absolute discretion.
          </p>
          <a
            href={whatsappBookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 bg-yellow-400 text-black font-medium text-sm tracking-widest hover:bg-yellow-300 transition-all duration-300"
          >
            BOOK NOW
          </a>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        </div>

        {/* Services */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Bodyguard */}
            <div className="group border border-yellow-600/20 p-12 hover:border-yellow-600/50 transition-all duration-500">
              <div className="w-16 h-16 border border-yellow-600/40 rounded-sm flex items-center justify-center mb-8 group-hover:border-yellow-400 transition-colors">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-wide mb-4 text-white">BODYGUARD SERVICES</h3>
              <p className="text-gray-400 font-light mb-8 leading-relaxed">
                Highly trained security professionals providing discreet personal protection. Available 24/7 for your peace of mind.
              </p>
              <ul className="space-y-4 mb-10 text-sm font-light text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Personal Protection & Security
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Corporate & Event Security
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Executive Escorts
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Discreet & Professional
                </li>
              </ul>
              <a
                href={whatsappBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-3 border border-yellow-600/60 text-yellow-400 font-light text-sm tracking-widest hover:bg-yellow-400 hover:text-black transition-all duration-300"
              >
                INQUIRE
              </a>
            </div>

            {/* Luxury Car */}
            <div className="group border border-yellow-600/20 p-12 hover:border-yellow-600/50 transition-all duration-500">
              <div className="w-16 h-16 border border-yellow-600/40 rounded-sm flex items-center justify-center mb-8 group-hover:border-yellow-400 transition-colors">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-wide mb-4 text-white">LUXURY CAR RENTAL</h3>
              <p className="text-gray-400 font-light mb-8 leading-relaxed">
                Premium fleet of luxury vehicles with professional drivers. Experience refined elegance and uncompromising comfort.
              </p>
              <ul className="space-y-4 mb-10 text-sm font-light text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Premium & Executive Vehicles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Professional Chauffeurs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Hourly & Daily Arrangements
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-yellow-600/60 rounded-full" />
                  Corporate & Event Transportation
                </li>
              </ul>
              <a
                href={whatsappBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-3 border border-yellow-600/60 text-yellow-400 font-light text-sm tracking-widest hover:bg-yellow-400 hover:text-black transition-all duration-300"
              >
                RESERVE
              </a>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        </div>

        {/* Why Us */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <h2 className="text-4xl font-light tracking-wide mb-16 text-center">THE WENSFORCE DIFFERENCE</h2>
          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-5xl font-light text-yellow-400 mb-4">24/7</div>
              <p className="text-gray-400 font-light text-sm">Always available. Always ready. Anytime, anywhere.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-yellow-400 mb-4">100%</div>
              <p className="text-gray-400 font-light text-sm">Complete confidentiality and absolute discretion guaranteed.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-yellow-400 mb-4">PRO</div>
              <p className="text-gray-400 font-light text-sm">Highly trained and certified security professionals.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-yellow-400 mb-4">ELITE</div>
              <p className="text-gray-400 font-light text-sm">Serving discerning corporate and private clients.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        </div>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center border border-yellow-600/20 rounded-sm bg-black/50">
          <h2 className="text-3xl font-light tracking-wide mb-8">EXPERIENCE EXCELLENCE</h2>
          <p className="text-gray-400 font-light mb-12 text-lg">
            Contact us today to book our premium services or learn more about what we offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={whatsappBookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 bg-yellow-400 text-black font-medium text-sm tracking-widest hover:bg-yellow-300 transition-all duration-300"
            >
              WHATSAPP BOOKING
            </a>
            <a
              href={mainWebsiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 border border-yellow-600/60 text-yellow-400 font-light text-sm tracking-widest hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              LEARN MORE
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-600/20 mt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs font-light tracking-widest">
          <p>© 2026 WENSFORCE. LUXURY SECURITY & TRANSPORTATION. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
