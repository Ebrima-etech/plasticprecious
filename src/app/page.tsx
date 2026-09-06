'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiShoppingCart, FiLogIn, FiMenu, FiX, FiCheckCircle, FiTrendingUp, FiUsers, FiGlobe, FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { API_BASE_URL } from '@/config/api';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  stock: number;
  image?: string;
  is_active: boolean;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        const allProducts = response.data.results || response.data || [];
        setProducts(allProducts.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <Link href="/" className="text-lg sm:text-2xl font-bold text-primary-600 whitespace-nowrap">
              PLASTICPRECIOUS
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition font-medium">SHOP</Link>
              <Link href="/industry" className="text-neutral-700 hover:text-primary-600 transition font-medium">BY INDUSTRY</Link>
              <Link href="/resources" className="text-neutral-700 hover:text-primary-600 transition font-medium">LEARN</Link>
              <Link href="/enterprise" className="text-neutral-700 hover:text-primary-600 transition font-medium">ENTERPRISE</Link>
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-3 items-center">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <FiShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  <FiLogIn className="w-4 h-4 mr-1" />
                  LOGIN
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">SIGN UP</Button>
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex gap-2 items-center">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <FiShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  <FiLogIn className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 py-4 space-y-2">
              <Link href="/products" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">SHOP</Link>
              <Link href="/industry" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">BY INDUSTRY</Link>
              <Link href="/enterprise" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">ENTERPRISE</Link>
              <Link href="/resources" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">LEARN</Link>
              <Link href="/auth/register" className="block w-full px-2 pt-2">
                <Button size="sm" className="w-full">SIGN UP</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* HERO: Dual-Path CTA (EcoEnclose Pattern) */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-200 font-semibold mb-4">PREMIUM RECYCLED PLASTIC</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Sustainable Plastic, Solved
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Eco-friendly recycled plastic products designed to match your brand, your business, and your budget without compromise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/enterprise">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50">
                    WORK WITH US
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto border-white text-white hover:bg-primary-700">
                    SHOP NOW
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary-100/20 to-primary-50/10 rounded-2xl p-12 backdrop-blur">
                <div className="text-9xl text-center opacity-30">♻️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subheader: Dual Paths */}
      <section className="bg-neutral-50 py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900 mb-2">Custom Bulk Orders</p>
              <p className="text-neutral-600">For large businesses and complex programs with custom specifications</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900 mb-2">Ready-to-Buy Options</p>
              <p className="text-neutral-600">Customizable, in-stock solutions for quick fulfillment and testing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Value Props (EcoEnclose: 4 Core Benefits) */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">What You Get With Plasticprecious</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card shadow="md">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Your Values, On Display</h3>
                    <p className="text-neutral-600">Sustainability showing up at your most critical customer interaction point</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Vetted, Tested, Scrutinized</h3>
                    <p className="text-neutral-600">Full spectrum of options to match your specific business needs and certifications</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Worry-Free Compliance</h3>
                    <p className="text-neutral-600">We stay ahead of regulatory issues so you can focus on your business</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">On-Time & Error-Free</h3>
                    <p className="text-neutral-600">Dedicated project management and quality assurance at every step</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* "Our Best Sellers" - Product Showcase */}
      {products.length > 0 && (
        <section className="py-16 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Our Best Sellers</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our most popular sustainable packaging options for brands at every scale, from ready-to-ship to custom solutions.
              </p>
            </div>
            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card shadow="md" className="hover:shadow-lg transition-shadow h-full">
                      <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center rounded-t-lg">
                        <p className="text-5xl">📦</p>
                      </div>
                      <CardBody>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-end">
                          <p className="text-xl font-bold text-primary-600">D {parseFloat(product.price).toLocaleString('en-GM')}</p>
                          <Badge variant={product.stock > 0 ? 'success' : 'error'} size="sm">
                            {product.stock > 0 ? 'Stock' : 'Out'}
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* "See & Feel the Difference" - Experiential CTA */}
      <section className="bg-primary-50 py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">See – and Feel – the Difference</h2>
              <p className="text-lg text-neutral-700 mb-8">
                Explore materials, textures, and quality firsthand with a curated sample kit of our most popular sustainable products.
              </p>
              <Button size="lg" className="group">
                REQUEST FREE SAMPLES
                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <p className="text-6xl mb-4">✨</p>
              <p className="text-neutral-600">
                Feel premium recycled materials, see print quality, and experience the unboxing experience your customers will get
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-neutral-50 py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Our Collective 2026 Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">50K+</p>
              <p className="text-neutral-600">Tons of Plastic Diverted</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">80+</p>
              <p className="text-neutral-600">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">100%</p>
              <p className="text-neutral-600">Recycled Materials</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">40%</p>
              <p className="text-neutral-600">Avg Carbon Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">10M+</p>
              <p className="text-neutral-600">Products Shipped</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">99.2%</p>
              <p className="text-neutral-600">On-Time Delivery Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">What Our Partners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card shadow="md">
              <CardBody>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
                </div>
                <p className="text-neutral-700 mb-6">
                  "Plasticprecious transformed our packaging. The quality is exceptional, and our customers notice the sustainability commitment immediately."
                </p>
                <div>
                  <p className="font-bold text-neutral-900">Sarah Chen</p>
                  <p className="text-sm text-neutral-600">Founder, EcoShop Co</p>
                </div>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
                </div>
                <p className="text-neutral-700 mb-6">
                  "We've reduced our carbon footprint by 40% and improved customer loyalty. The compliance support has been invaluable."
                </p>
                <div>
                  <p className="font-bold text-neutral-900">Marcus Williams</p>
                  <p className="text-sm text-neutral-600">CEO, GreenTech Industries</p>
                </div>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
                </div>
                <p className="text-neutral-700 mb-6">
                  "The dedicated support team treated our needs like they were their own. From design to delivery, everything was seamless."
                </p>
                <div>
                  <p className="font-bold text-neutral-900">Elena Rodriguez</p>
                  <p className="text-sm text-neutral-600">Owner, Conscious Brands</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Content Hub */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3 text-center">Learn About Sustainable Packaging</h2>
          <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
            Industry guides, compliance resources, and expert perspectives to help you make informed packaging decisions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/resources/guides">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">📚</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Guides & Whitepapers</h3>
                  <p className="text-neutral-600 mb-6">
                    In-depth guides on sustainable materials, eco-packaging best practices, and material selection
                  </p>
                  <Button variant="secondary" size="sm">Read More</Button>
                </CardBody>
              </Card>
            </Link>

            <Link href="/resources/compliance">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">⚖️</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Compliance Hub</h3>
                  <p className="text-neutral-600 mb-6">
                    Navigate packaging regulations, EPR requirements, and retailer guidelines with our compliance resources
                  </p>
                  <Button variant="secondary" size="sm">Explore</Button>
                </CardBody>
              </Card>
            </Link>

            <Link href="/blog">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">✍️</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Blog & Case Studies</h3>
                  <p className="text-neutral-600 mb-6">
                    Real-world success stories, industry trends, and circular economy insights from our partners
                  </p>
                  <Button variant="secondary" size="sm">Read Blog</Button>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* "Your Partner in Sustainable Packaging" - Trust Section */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Your Partner in Sustainable Packaging</h2>
            <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
              Choosing the right recycled plastic supplier shouldn't feel complicated. Plasticprecious offers the industry's most comprehensive suite of sustainable solutions, each evaluated through our rigorous quality framework. Whether you're exploring recycled content options or next-generation materials, we give you clarity on what's truly sustainable, durable, and responsibly made.
            </p>
            <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
              If you're navigating regulatory requirements or new packaging standards, our Compliance Guides and EPR Resources simplify what you need to know. When you're ready, our team will help match you with the perfect solution – no guesswork, no overwhelm.
            </p>
            <Button size="lg">START YOUR JOURNEY TODAY</Button>
          </div>
        </div>
      </section>

      {/* Multi-Step CTA Path */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Get Started With Plasticprecious</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">💬</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Start a Quote</h3>
                <p className="text-neutral-600 mb-6">Tell us about your volumes, timeline, and needs. Get a customized quote with clear specs and pricing.</p>
                <Button variant="secondary">Request Quote</Button>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">🛍️</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Shop Now</h3>
                <p className="text-neutral-600 mb-6">Browse ready-to-buy, in-stock solutions for quick fulfillment, testing, or immediate needs.</p>
                <Button variant="secondary">Browse Products</Button>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">📦</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Request Samples</h3>
                <p className="text-neutral-600 mb-6">Feel the quality and textures firsthand. Receive a curated kit matched to your industry.</p>
                <Button variant="secondary">Get Free Samples</Button>
              </CardBody>
            </Card>

            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">📖</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Download Catalog</h3>
                <p className="text-neutral-600 mb-6">Explore full specs, certifications, sustainability data, and detailed product information at your pace.</p>
                <Button variant="secondary">Get Catalog</Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter + Contact CTA */}
      <section id="contact" className="bg-primary-600 text-white py-16 border-b border-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-primary-100 mb-6">Get the latest on sustainable packaging innovations, regulatory updates, and exclusive offers.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="px-4 py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  required
                />
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 w-full">
                  {subscribed ? '✓ Subscribed!' : 'SUBSCRIBE'}
                </Button>
              </form>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Need Expert Guidance?</h2>
              <p className="text-primary-100 mb-6">Our sustainability consultants help you navigate material selection, compliance, and sourcing decisions.</p>
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-primary-700 w-full">
                SCHEDULE CONSULTATION
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">About</h3>
              <p className="text-sm">Leading provider of premium recycled plastic solutions for sustainable businesses worldwide.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Shop & Customize</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/products" className="hover:text-white transition">All Products</a></li>
                <li><a href="/industry" className="hover:text-white transition">Shop By Industry</a></li>
                <li><a href="/enterprise" className="hover:text-white transition">Custom Solutions</a></li>
                <li><a href="#" className="hover:text-white transition">Bulk Orders</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Learn & Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/resources" className="hover:text-white transition">Resources & Guides</a></li>
                <li><a href="/blog" className="hover:text-white transition">Blog & Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance Hub</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Certifications</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p>&copy; 2026 Plasticprecious. Committed to a circular plastic future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
