'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  const products = [
    { name: 'Recycled Storage Bins', price: 'D 850', stock: 'Only 8 left', badge: 'In Stock' },
    { name: 'Eco Lunch Container Set', price: 'D 1,200', stock: 'In Stock', badge: 'Popular' },
    { name: 'Recycled Water Bottle', price: 'D 750', stock: 'Only 12 left', badge: 'Limited' },
    { name: 'Sustainable Organizers', price: 'D 1,050', stock: 'In Stock', badge: 'Best Seller' },
  ];

  const categories = [
    { name: 'Recycled Containers', icon: '♻️', description: 'Durable storage solutions' },
    { name: 'Kitchenware', icon: '🍴', description: 'Eco-friendly kitchen tools' },
    { name: 'Storage Solutions', icon: '📦', description: 'Organize sustainably' },
    { name: 'Eco Accessories', icon: '🌍', description: 'Planet-friendly items' },
  ];

  const features = [
    { icon: '♻️', title: '100% Recycled', description: 'Made from recycled plastic, zero waste' },
    { icon: '🌍', title: 'Eco-Friendly', description: 'Reduce your carbon footprint' },
    { icon: '🚚', title: 'Sustainable Shipping', description: 'Carbon-neutral delivery' },
    { icon: '✅', title: 'Quality Assured', description: 'Certified durable products' },
  ];

  const stats = [
    { value: '100K+', label: 'Products Sold' },
    { value: '500+', label: 'Tons Saved' },
    { value: '50+', label: 'Countries' },
    { value: '98%', label: 'Satisfaction' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition">
              Plasticprecious
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/products" className="text-neutral-600 hover:text-neutral-900 transition font-medium">
                Products
              </Link>
              <a href="#categories" className="text-neutral-600 hover:text-neutral-900 transition font-medium">
                Categories
              </a>
              <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition font-medium">
                Contact
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  Cart
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100/20 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="primary" size="base" className="mb-6 inline-block">
              🌱 Sustainable Living Starts Here
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Premium Recycled Plastic Products
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Beautifully designed, sustainably made products that prove eco-friendly doesn't mean compromising on quality or style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16">
          <Badge variant="info" size="sm" className="mb-4">
            Most Popular
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Best Selling Products</h2>
          <p className="text-xl text-neutral-600">Our most loved recycled solutions, trusted by thousands worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, i) => (
            <Card key={i} hover shadow="base">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-48 flex items-center justify-center text-5xl rounded-t-lg">
                📦
              </div>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="primary" size="sm">
                      {product.badge}
                    </Badge>
                  </div>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">{product.name}</h3>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-primary-600">{product.price}</span>
                  <Button size="sm" variant="primary">
                    Add
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button variant="ghost" size="lg">
              View All Products →
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-normal">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16">
          <Badge variant="success" size="sm" className="mb-4">
            Shop by Category
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Find What You Need</h2>
          <p className="text-xl text-neutral-600">Quality recycled products for every lifestyle and purpose.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={`/products?category=${cat.name}`}>
              <Card hover interactive shadow="sm">
                <div className="bg-gradient-to-br from-neutral-100 to-primary-50 h-40 flex items-center justify-center text-5xl rounded-t-lg group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <CardBody>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-neutral-600">{cat.description}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</p>
                <p className="text-primary-100 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card shadow="lg">
          <CardBody className="text-center py-12">
            <Badge variant="primary" size="base" className="mb-6 inline-block">
              💌 Get Exclusive Offers
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-xl mx-auto">
              Get 15% off your first order + exclusive sustainability tips delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900"
                required
              />
              <Button type="submit" isLoading={subscribed}>
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-sm text-neutral-500 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <Badge variant="success" size="sm" className="mb-4">
              Customer Love
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} shadow="sm">
                <CardBody>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <span key={j} className="text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.location}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">About</h5>
              <p className="text-sm leading-relaxed">
                Leading recycled plastic products company dedicated to sustainability and eco-friendly solutions worldwide.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Shop</h5>
              <ul className="text-sm space-y-2">
                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
                <li><Link href="/products" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Best Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Support</h5>
              <ul className="text-sm space-y-2">
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Legal</h5>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
