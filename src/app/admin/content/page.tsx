'use client';

import Link from 'next/link';
import { HiOutlineDocumentText, HiOutlinePencilSquare, HiOutlineStar, HiOutlineAdjustmentsHorizontal, HiOutlineMagnifyingGlass, HiOutlineEnvelope } from 'react-icons/hi2';

interface ContentSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  status: 'ready' | 'coming-soon';
  count?: number;
}

export default function AdminContentPage() {
  const contentSections: ContentSection[] = [
    {
      id: 'pages',
      title: 'Pages',
      description: 'Manage static pages like About, Contact, FAQ',
      icon: HiOutlineDocumentText,
      link: '#',
      status: 'coming-soon',
      count: 3,
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Create and manage blog posts',
      icon: HiOutlinePencilSquare,
      link: '#',
      status: 'coming-soon',
      count: 0,
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Customer testimonials and reviews',
      icon: HiOutlineStar,
      link: '#',
      status: 'coming-soon',
      count: 5,
    },
    {
      id: 'banners',
      title: 'Banners & Promotions',
      description: 'Marketing banners and promotional content',
      icon: HiOutlineAdjustmentsHorizontal,
      link: '#',
      status: 'coming-soon',
      count: 2,
    },
    {
      id: 'seo',
      title: 'SEO Settings',
      description: 'Meta tags, sitemap, robots.txt',
      icon: HiOutlineMagnifyingGlass,
      link: '#',
      status: 'coming-soon',
    },
    {
      id: 'emails',
      title: 'Email Templates',
      description: 'Order confirmation, shipping, etc.',
      icon: HiOutlineEnvelope,
      link: '#',
      status: 'coming-soon',
      count: 8,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage pages, blog, testimonials, and more</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => (
          <Link key={section.id} href={section.link}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <section.icon className="w-8 h-8 text-gray-600" />
                {section.status === 'coming-soon' && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    Soon
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>

              {section.count !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Items</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {section.count}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Coming Soon</h3>
        <p className="text-sm text-blue-800">
          Most content management features are under development. We're working hard to bring you a complete content management system.
        </p>
      </div>
    </div>
  );
}
