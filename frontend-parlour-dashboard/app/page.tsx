import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-red-950 text-white">
        <Link href="/login">
          <button className="absolute top-0 right-0 cursor-pointer p-2 px-4 m-2 rounded-full bg-black/20">
            Login
          </button>
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to Parlour
        </h1>
        <p className="text-lg sm:text-xl mb-6 max-w-2xl">
          Relax, rejuvenate, and reveal your inner glow with our expert beauty
          services.
        </p>
        <a
          href="#services"
          className="bg-amber-400/20 hover:bg-yellow-200/30 text-white font-medium py-3 px-6 rounded-full transition"
        >
          Explore Services
        </a>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-[#E7D7C1] text-center">
        <h2 className="text-3xl font-semibold mb-10">Our Services</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-2 max-w-3xl mx-auto">
          {[
            { title: "Facials", icon: "/icons/facial.png" },
            { title: "Hair Styling", icon: "/icons/hair.png" },
            { title: "Manicure & Pedicure", icon: "/icons/nails.png" },
            { title: "Waxing", icon: "/icons/waxing.png" },
            { title: "Makeup", icon: "/icons/makeup.png" },
            { title: "Spa Therapy", icon: "/icons/spa.png" },
          ].map((service, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-2xl h-20">
              {/* Icon can be re-enabled if needed */}
              <h3 className="mt-4 text-lg font-medium">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-red-950/40 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">What Our Clients Say</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              name: "ABCD",
              quote:
                "Absolutely loved the service. The facial left my skin glowing and soft!",
            },
            {
              name: "EFGH",
              quote:
                "Professional staff and a relaxing environment. Highly recommend their spa treatments!",
            },
            {
              name: "IJKL",
              quote:
                "Got my wedding makeup done here. The results were stunning and flawless!",
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md p-6 rounded-lg border border-pink-100"
            >
              <p className="italic mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
              <h4 className="font-semibold">— {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-red-950 text-white text-center py-10 px-6">
        <h3 className="text-2xl font-semibold mb-2">Bliss Beauty Parlour</h3>
        <p className="mb-4">123 Glam Street, Beauty City, 456789</p>
        <p className="mb-4">Phone: +91 98765 43210</p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:underline">
            Facebook
          </a>
          <a href="#" className="hover:underline">
            Instagram
          </a>
          <a href="#" className="hover:underline">
            WhatsApp
          </a>
        </div>
        <p className="mt-6 text-sm text-white/80">
          © 2025 Bliss Beauty Parlour. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
