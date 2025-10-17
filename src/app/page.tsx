export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Build a Website That Works — <span className="text-blue-600">Fast</span>.
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                We design and develop modern websites, web apps, and SEO systems that help small businesses grow. Simple process. Fair pricing. Launch-ready in weeks, not months.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200">
                  → Book a Free Consultation
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200">
                  → See Packages
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Trusted by local startups and small businesses across Utah and beyond.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
                <div className="text-8xl">💡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">
            Why Small Businesses Choose Great Idea
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast & Easy</h3>
              <p className="text-gray-600">
                Streamlined process from kickoff to launch — no unnecessary steps, just results.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable &amp; Clear</h3>
              <p className="text-gray-600">
                Tiered pricing and transparent deliverables — so you know exactly what you&rsquo;re getting.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Support</h3>
              <p className="text-gray-600">
                Work directly with our designers and developers. No ticket systems. No delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Snapshot */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">
            Everything You Need to Build and Grow Online
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Web Design & Development</h3>
              <p className="text-gray-600">
                Custom, responsive websites built for conversion and clarity.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Web Apps &amp; SaaS</h3>
              <p className="text-gray-600">
                We help startups go from idea to MVP fast — with scalable, secure solutions.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-4">SEO &amp; Marketing</h3>
              <p className="text-gray-600">
                Get found. We handle on-page SEO, analytics, and content optimization.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Branding &amp; Identity</h3>
              <p className="text-gray-600">
                Logo design, color systems, and visual storytelling to make your business stand out.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition-shadow cursor-pointer md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hosting &amp; Maintenance</h3>
              <p className="text-gray-600">
                Reliable cloud hosting, updates, and performance monitoring.
              </p>
              <p className="text-sm text-blue-600 mt-2">greatidea.cloud</p>
            </div>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
              → Explore All Services
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">
            See What We&rsquo;ve Built
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg mb-6"></div>
              <p className="text-gray-800 font-medium">
                &ldquo;Brand + Website for a local wellness studio — launched in 10 days.&rdquo;
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg mb-6"></div>
              <p className="text-gray-800 font-medium">
                &ldquo;Custom web app for startup logistics company — reduced admin time by 40%.&rdquo;
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg mb-6"></div>
              <p className="text-gray-800 font-medium">
                &ldquo;SEO overhaul for e-commerce shop — doubled organic traffic in 60 days.&rdquo;
              </p>
            </div>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
              → View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-16">
            What Our Clients Say
          </h2>
          <blockquote className="text-2xl text-gray-700 italic mb-8">
            &ldquo;The process was fast, affordable, and the site looked better than we imagined. Great Idea took care of everything.&rdquo;
          </blockquote>
          <p className="text-gray-600 font-medium">
            — Sarah, Founder of Ridge Studio
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Let&rsquo;s Turn Your Idea Into a Great Website.
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your free 15-minute consultation and get a custom quote today.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200 text-lg">
            → Book a Call
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Great Idea Creative Services</h3>
              <p className="text-gray-400 mb-6">
                Fast, affordable, professional web design and development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Portfolio</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">hello@greatidea-cs.com</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Great Idea Creative Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}