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
      <Navbar />
      {/* Header */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-4 text-xl">Latest news and insights</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-blue-600 font-semibold">{post.category}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <p className="text-sm text-gray-500">By {post.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No blog posts yet</p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
