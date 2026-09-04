'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');

  const testimonials = [
    {
      name: 'John Doe',
      location: 'New York, USA',
      text: 'Finally found quality recycled products! Love knowing I\'m helping the environment while getting great products.',
      rating: 5,
    },
    {
      name: 'Sarah Smith',
      location: 'London, UK',
      text: 'Impressed with the durability of their recycled containers. Great prices and fantastic eco-friendly service.',
      rating: 5,
    },
    {
      name: 'Michael Brown',
      location: 'Toronto, Canada',
      text: 'This company truly cares about sustainability. My whole family switched to their products. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      location: 'Sydney, Australia',
      text: 'Beautiful, sustainable products that actually work better than conventional plastic. Supporting their mission!',
      rating: 5,
    },
  ];

  const categories = [
    { name: 'Recycled Containers', image: '♻️' },
    { name: 'Kitchenware', image: '🍴' },
    { name: 'Storage Solutions', image: '📦' },
    { name: 'Eco Accessories', image: '🌍' },
  ];

  const blogPosts = [
    {
      date: 'JANUARY 15, 2026',
      title: 'Benefits of Recycled Plastic Products for Your Home',
      readTime: '5 min read',
    },
    {
      date: 'JANUARY 10, 2026',
      title: 'How Plastic Recycling Helps Save the Environment',
      readTime: '7 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">Plasticprecious</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-gray-900 font-medium">
                Products
              </Link>
              <a href="#categories" className="text-gray-600 hover:text-gray-900 font-medium">
                Categories
              </a>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/cart" className="text-gray-600 hover:text-gray-900 font-medium">
                Cart
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-wide uppercase mb-4 opacity-90">Eco-Friendly Solutions</p>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Recycled Plastic Products</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Sustainable products made from 100% recycled plastic materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition text-lg"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h3 className="text-4xl font-bold mb-2">Best Selling Products</h3>
          <p className="text-gray-600 text-lg">Our most popular recycled plastic solutions, trusted by thousands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Recycled Storage Bins', price: 'D 850', stock: 'Only 8 left' },
            { name: 'Eco Lunch Container Set', price: 'D 1,200', stock: 'In Stock' },
            { name: 'Recycled Water Bottle', price: 'D 750', stock: 'Only 12 left' },
            { name: 'Sustainable Organizers', price: 'D 1,050', stock: 'In Stock' },
          ].map((product, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-green-100 to-indigo-100 h-64 flex items-center justify-center text-6xl">
                📦
              </div>
              <div className="p-4">
                <p className="text-xs text-orange-600 font-semibold mb-2">{product.stock}</p>
                <h4 className="font-semibold mb-2 text-gray-800">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="text-green-600 font-bold text-lg hover:text-green-800 transition"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Shop by Category</h3>
            <p className="text-gray-600 text-lg">
              Quality recycled plastic products for every lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-green-50 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition">
                  {cat.image}
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-lg text-gray-800">{cat.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-800 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4">Join the Sustainability Movement</h3>
          <p className="text-lg mb-8 opacity-95">Get 15% off your first order + exclusive eco-tips delivered to your inbox</p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm mt-4 opacity-75">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">♻️</div>
            <h4 className="font-bold text-lg mb-2">100% Recycled</h4>
            <p className="text-gray-600">Made from recycled plastic materials, zero waste</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h4 className="font-bold text-lg mb-2">Eco-Friendly</h4>
            <p className="text-gray-600">Reduce your carbon footprint with sustainable choices</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h4 className="font-bold text-lg mb-2">Sustainable Shipping</h4>
            <p className="text-gray-600">Carbon-neutral delivery options available</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="font-bold text-lg mb-2">Quality Assured</h4>
            <p className="text-gray-600">Certified durable and long-lasting products</p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-12">From the Blog</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {blogPosts.map((post, i) => (
              <article key={i} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <p className="text-sm text-gray-500 font-semibold mb-2">{post.date}</p>
                <h4 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h4>
                <p className="text-gray-600">{post.readTime}</p>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog" className="text-green-600 font-bold text-lg hover:text-green-800 transition">
              Read More Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-8">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">100K+</p>
              <p className="text-gray-600 font-semibold">Recycled Products Sold</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">500+</p>
              <p className="text-gray-600 font-semibold">Tons of Plastic Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">50+</p>
              <p className="text-gray-600 font-semibold">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">98%</p>
              <p className="text-gray-600 font-semibold">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <p className="font-bold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-lg mb-4">About Us</h5>
              <p className="text-gray-400 text-sm">
                Plasticprecious is a leading recycled plastic products company dedicated to sustainability and eco-friendly solutions worldwide.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Shop</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Support</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Legal</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
