'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blog/`);
      setPosts(response.data.results || response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .grid-pattern {
          background-image:
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
      <Navbar showNavLinks={true} />
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            📝 BLOG
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">Latest Insights</h1>
          <p className="text-xl max-w-2xl text-emerald-50">Stories and updates from our community</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300">
                  {post.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                  <div className="flex flex-col flex-grow px-6 py-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-emerald-600 font-bold uppercase">{post.category}</span>
                      <span className="text-xs text-slate-500">{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-xl mb-3 group-hover:text-emerald-600 transition">{post.title}</h3>
                    <p className="text-slate-600 text-sm flex-grow mb-4">{post.excerpt}</p>
                    <p className="text-xs text-slate-500">By {post.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600">No blog posts yet</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
