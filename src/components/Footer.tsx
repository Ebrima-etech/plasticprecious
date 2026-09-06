import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-10 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Shop</h5>
            <ul className="text-sm space-y-2 text-neutral-700 font-bold">
              <li><Link href="/shop" className="hover:text-emerald-600 transition">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-emerald-600 transition">Custom Products</Link></li>
              <li><Link href="/shop" className="hover:text-emerald-600 transition">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Services</h5>
            <ul className="text-sm space-y-2 text-neutral-700 font-bold">
              <li><Link href="/services" className="hover:text-emerald-600 transition">Collections</Link></li>
              <li><Link href="/services" className="hover:text-emerald-600 transition">Recycling</Link></li>
              <li><Link href="/services" className="hover:text-emerald-600 transition">Workshops</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Company</h5>
            <ul className="text-sm space-y-2 text-neutral-700 font-bold">
              <li><Link href="/about" className="hover:text-emerald-600 transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-600 transition">Blog</Link></li>
              <li><a href="#" className="hover:text-emerald-600 transition">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Connect</h5>
            <ul className="text-sm space-y-2 text-neutral-700 font-bold">
              <li><Link href="/contact" className="hover:text-emerald-600 transition">Contact</Link></li>
              <li><a href="#" className="hover:text-emerald-600 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6 text-center text-xs text-neutral-600 font-bold">
          <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
