'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiShoppingCart, FiLogIn, FiMenu, FiX, FiCheckCircle, FiTrendingUp, FiUsers, FiGlobe } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
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
        setProducts(allProducts.slice(0, 6));
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

            {/* Search Bar (Hidden on Mobile) */}
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
              <a href="#impact" className="text-neutral-700 hover:text-primary-600 transition font-medium">IMPACT</a>
              <Link href="/resources" className="text-neutral-700 hover:text-primary-600 transition font-medium">LEARN</Link>
              <Link href="/enterprise" className="text-neutral-700 hover:text-primary-600 transition font-medium">ENTERPRISE</Link>
            </div>

            {/* Hamburger Menu (Mobile) */}
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
              <a href="#impact" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">IMPACT</a>
              <a href="#testimonials" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">REVIEWS</a>
              <a href="#contact" className="block text-neutral-700 hover:text-primary-600 py-2 px-2">CONTACT</a>
              <Link href="/auth/register" className="block w-full px-2 pt-2">
                <Button size="sm" className="w-full">SIGN UP</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-200 font-semibold mb-4">SUSTAINABLE SOLUTIONS</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Premium Recycled Plastic Products
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                High-quality, sustainably engineered plastic solutions for conscious businesses and consumers. ISO certified, globally trusted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50">
                    BROWSE PRODUCTS
                  </Button>
                </Link>
                <a href="#contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto border-white text-white hover:bg-primary-700">
                    GET CONSULTATION
                  </Button>
                </a>
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

      {/* Trust Metrics */}
      <section className="bg-neutral-50 py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FiUsers className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-4xl font-bold text-neutral-900 mb-2">80+</p>
              <p className="text-neutral-600">Countries Served</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FiTrendingUp className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-4xl font-bold text-neutral-900 mb-2">50K+</p>
              <p className="text-neutral-600">Tons Diverted From Landfills</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FiCheckCircle className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-4xl font-bold text-neutral-900 mb-2">100%</p>
              <p className="text-neutral-600">Recycled Materials</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FiGlobe className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-4xl font-bold text-neutral-900 mb-2">ISO</p>
              <p className="text-neutral-600">Certified Quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Trust Badges */}
      <section className="py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-neutral-900 mb-12">Trusted By Industry Leaders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            <div className="text-center">
              <Badge variant="success" size="base">ISO 9001</Badge>
              <p className="text-xs text-neutral-600 mt-2">Quality Certified</p>
            </div>
            <div className="text-center">
              <Badge variant="success" size="base">ISO 14001</Badge>
              <p className="text-xs text-neutral-600 mt-2">Environmental</p>
            </div>
            <div className="text-center">
              <Badge variant="primary" size="base">RECYCLABLE</Badge>
              <p className="text-xs text-neutral-600 mt-2">Certified</p>
            </div>
            <div className="text-center">
              <Badge variant="primary" size="base">COMPOSTABLE</Badge>
              <p className="text-xs text-neutral-600 mt-2">Material</p>
            </div>
            <div className="text-center">
              <Badge variant="success" size="base">R-PET</Badge>
              <p className="text-xs text-neutral-600 mt-2">Recycled PET</p>
            </div>
            <div className="text-center">
              <Badge variant="primary" size="base">RoHS</Badge>
              <p className="text-xs text-neutral-600 mt-2">Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Industry */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12">Shop By Industry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Apparel', emoji: '👕' },
              { name: 'Jewelry', emoji: '💍' },
              { name: 'Food & Beverage', emoji: '🍱' },
              { name: 'Cosmetics', emoji: '💄' },
              { name: 'E-commerce', emoji: '📦' },
              { name: 'Retail', emoji: '🏪' },
              { name: 'Manufacturing', emoji: '🏭' },
              { name: 'Subscription', emoji: '📬' },
              { name: 'Marketing', emoji: '📢' },
              { name: 'Essential Oils', emoji: '🌿' },
              { name: 'Artisan Goods', emoji: '🎨' },
              { name: 'Sustainable Brands', emoji: '♻️' }
            ].map((industry) => (
              <Link key={industry.name} href={`/products?industry=${industry.name.toLowerCase()}`}>
                <div className="p-6 bg-neutral-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition text-center group cursor-pointer">
                  <p className="text-4xl mb-3 group-hover:scale-110 transition">{industry.emoji}</p>
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-600 transition text-sm">{industry.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases / Categories */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12">Perfect For Every Use Case</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">📦</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Sustainable Packaging</h3>
                <p className="text-neutral-600 mb-4">Eco-friendly shipping and product packaging solutions for e-commerce and retail.</p>
                <Link href="/products?category=packaging">
                  <Button variant="secondary" size="sm">Explore</Button>
                </Link>
              </CardBody>
            </Card>
            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">🏭</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Industrial Solutions</h3>
                <p className="text-neutral-600 mb-4">Durable recycled plastic for manufacturing, construction, and industrial applications.</p>
                <Link href="/products?category=industrial">
                  <Button variant="secondary" size="sm">Explore</Button>
                </Link>
              </CardBody>
            </Card>
            <Card shadow="md">
              <CardBody>
                <p className="text-4xl mb-4">🛍️</p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Consumer Products</h3>
                <p className="text-neutral-600 mb-4">Everyday items made from premium recycled plastic for conscious consumers.</p>
                <Link href="/products?category=consumer">
                  <Button variant="secondary" size="sm">Explore</Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">Featured Products</h2>
              <Link href="/products">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card shadow="md" className="hover:shadow-lg transition-shadow h-full">
                      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center rounded-lg mb-4">
                        <p className="text-6xl">📦</p>
                      </div>
                      <CardBody>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{product.name}</h3>
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold text-primary-600">D {parseFloat(product.price).toLocaleString('en-GM')}</p>
                          <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
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

      {/* How It Works */}
      <section id="impact" className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">How We Make An Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Collect', desc: 'We collect post-consumer plastic waste' },
              { step: '2', title: 'Sort', desc: 'Advanced sorting technology ensures purity' },
              { step: '3', title: 'Process', desc: 'Transform into premium raw materials' },
              { step: '4', title: 'Deliver', desc: 'Ship globally to conscious businesses' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white text-2xl font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', company: 'EcoShop Co', text: 'Plasticprecious has transformed how we package our products. Quality is outstanding and delivery is always on time.' },
              { name: 'Marcus Williams', company: 'GreenTech Industries', text: 'The sustainability credentials are legitimate. We\'ve reduced our carbon footprint by 40% since switching.' },
              { name: 'Elena Rodriguez', company: 'Conscious Brands', text: 'Customer support is exceptional. They helped us find the perfect material solution for our needs.' }
            ].map((testimonial, idx) => (
              <Card key={idx} shadow="sm">
                <CardBody>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
                  </div>
                  <p className="text-neutral-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-bold text-neutral-900">{testimonial.name}</p>
                  <p className="text-sm text-neutral-600">{testimonial.company}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">High-Volume Solutions</h2>
              <p className="text-lg text-neutral-600 mb-6">
                Ship thousands of units per week? Our enterprise solutions offer custom bulk pricing, dedicated support, and optimized logistics.
              </p>
              <div className="space-y-3 mb-8">
                <p className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Custom pricing for bulk orders</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Dedicated account manager</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Priority production scheduling</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Customization options available</span>
                </p>
              </div>
              <Link href="/enterprise">
                <Button size="lg">EXPLORE ENTERPRISE SOLUTIONS</Button>
              </Link>
            </div>
            <Card shadow="lg">
              <CardBody>
                <p className="text-6xl text-center mb-4">📊</p>
                <h3 className="text-xl font-bold text-neutral-900 text-center mb-4">Perfect For:</h3>
                <ul className="space-y-3 text-neutral-700">
                  <li>• Large e-commerce platforms</li>
                  <li>• Manufacturing facilities</li>
                  <li>• Distribution centers</li>
                  <li>• Fortune 500 companies</li>
                  <li>• Logistics providers</li>
                  <li>• Franchises & chains</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Learn & Resources */}
      <section className="py-16 bg-primary-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Learn About Sustainable Packaging</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/resources">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">📚</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Guides & Whitepapers</h3>
                  <p className="text-neutral-600 mb-6">
                    In-depth guides on sustainable packaging, material selection, and eco-friendly best practices.
                  </p>
                  <Button variant="secondary" size="sm">Read More</Button>
                </CardBody>
              </Card>
            </Link>
            <Link href="/case-studies">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">💼</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Case Studies</h3>
                  <p className="text-neutral-600 mb-6">
                    See how industry leaders reduced waste, cut costs, and improved their brand through sustainable packaging.
                  </p>
                  <Button variant="secondary" size="sm">Explore</Button>
                </CardBody>
              </Card>
            </Link>
            <Link href="/blog">
              <Card shadow="md" className="hover:shadow-lg transition h-full">
                <CardBody>
                  <p className="text-5xl mb-4">✍️</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">Blog & Updates</h3>
                  <p className="text-neutral-600 mb-6">
                    Latest trends, regulatory changes, and insights on the circular economy and sustainable practices.
                  </p>
                  <Button variant="secondary" size="sm">Read Blog</Button>
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter + Contact */}
      <section id="contact" className="bg-primary-600 text-white py-16 border-b border-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-primary-100 mb-6">Get the latest on sustainable packaging innovations and exclusive offers.</p>
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
              <p className="text-primary-100 mb-6">Our sustainability consultants help you choose the perfect solution for your business needs.</p>
              <Button size="lg" variant="secondary" className="border-white text-white hover:bg-primary-700 w-full">
                CHAT WITH AN EXPERT
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
              <p className="text-sm">Leading provider of sustainable recycled plastic solutions for global businesses.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/products" className="hover:text-white transition">All Products</a></li>
                <li><a href="#" className="hover:text-white transition">Custom Solutions</a></li>
                <li><a href="#" className="hover:text-white transition">Bulk Orders</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Sales</a></li>
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
            <p>&copy; 2026 Plasticprecious. Committed to a circular future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
