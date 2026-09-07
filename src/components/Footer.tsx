import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SHOP</h5>
            <ul className="text-sm space-y-3 text-white">
              <li><Link href="/shop" className="text-white hover:text-emerald-400 transition font-semibold">All Products</Link></li>
              <li><Link href="/shop" className="text-white hover:text-emerald-400 transition font-semibold">Custom Orders</Link></li>
              <li><Link href="/shop" className="text-white hover:text-emerald-400 transition font-semibold">Collections</Link></li>
              <li><Link href="/shop" className="text-white hover:text-emerald-400 transition font-semibold">Bulk Discounts</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SERVICES</h5>
            <ul className="text-sm space-y-3 text-white">
              <li><Link href="/services" className="text-white hover:text-emerald-400 transition font-semibold">Recycling Programs</Link></li>
              <li><Link href="/services" className="text-white hover:text-emerald-400 transition font-semibold">Workshops</Link></li>
              <li><Link href="/services" className="text-white hover:text-emerald-400 transition font-semibold">Consulting</Link></li>
              <li><Link href="/services" className="text-white hover:text-emerald-400 transition font-semibold">Custom Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">COMPANY</h5>
            <ul className="text-sm space-y-3 text-white">
              <li><Link href="/about" className="text-white hover:text-emerald-400 transition font-semibold">About Us</Link></li>
              <li><Link href="/blog" className="text-white hover:text-emerald-400 transition font-semibold">Blog & News</Link></li>
              <li><Link href="/impact" className="text-white hover:text-emerald-400 transition font-semibold">Impact Report</Link></li>
              <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">CONNECT</h5>
            <ul className="text-sm space-y-3 text-white">
              <li><Link href="/contact" className="text-white hover:text-emerald-400 transition font-semibold">Contact Us</Link></li>
              <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Privacy Policy</a></li>
              <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Terms of Service</a></li>
              <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Sustainability</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-white text-sm mb-4 font-semibold">&copy; 2026 Plastic Precious. All rights reserved.</p>
          <p className="text-white text-xs">Made with 🌱 for a better planet • Building sustainable solutions together</p>
        </div>
      </div>
    </footer>
  );
}
