'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image?: string;
}

const founders: TeamMember[] = [
  {
    name: 'Baai E Jaabang',
    role: 'Co-Founder',
    description: 'Co-founder of Precious Plastic Gambia and Executive Director of the Trust Agency for Rural Development, Baai is deeply committed to environmental enhancement. He works passionately to create a greener, healthier Gambia, driving sustainable development and community-led solutions to eliminate plastic waste pollution.',
    image: '/team/baai.png'
  },
  {
    name: 'Alieu Sowe',
    role: 'Co-Founder',
    description: 'Co-founder of Precious Plastic Gambia and Founder & CEO of Plastic Recycling Gambia LTD, Alieu brings entrepreneurial leadership to the circular economy. Driven by a passion for environmental protection, he works to advance sustainable waste management solutions and build a cleaner Gambia free from plastic pollution diverting tons of discarded plastics from waste to wealth.',
    image: '/team/alieu.png'
  },
  {
    name: 'Rebecca Talbot',
    role: 'Co-Founder',
    description: 'Co-founder of Precious Plastic Gambia and Founder of Growing Green Communities, Rebecca is dedicated to environmental enhancement and grassroots sustainability. She works passionately to empower communities, eliminate plastic waste, and cultivate a greener, healthier environment across The Gambia and beyond.',
    image: '/team/rebecca.png'
  },
  {
    name: 'Babucarr E Camara',
    role: 'Co-Founder & Operations Manager',
    description: 'Co-founder and Operations Manager at Precious Plastic Gambia, Babucarr leads strategic operations to turn plastic waste into value. Passionate about environmental enhancement, he combines operational leadership with a strong vision for a cleaner, healthier Gambia free from plastic pollution.'
  }
];

const staff: TeamMember[] = [
  {
    name: 'Omar Manjang',
    role: 'Machine Operator & Furniture Builder',
    description: 'Driven by a deep passion for environmental protection and recycling, Omar operates plastic recycling machinery to transform waste into durable furniture and handcrafted jewelry. In his role, he crafts sustainable products and supports production workflow to advance Precious Plastic Gambia\'s circular economy mission.'
  },
  {
    name: 'Mariama M Jabang',
    role: 'Operations & Store Associate',
    description: 'Passionate about Precious Plastic Gambia\'s mission, Mariama brings her best every day to ensure team objectives are met. She operates the shredder and injection machine to make handcrafted jewelry, while managing sales records and keeping the shop organized.'
  },
  {
    name: 'Ramatoulie Manneh',
    role: 'Machine Operator & Artisan',
    description: 'Dedicated and reliable, Ramatoulie brings strong punctuality and a genuine passion for her work every day. Operating plastic recycling machinery, she plays a vital role in transforming waste into beautifully crafted jewelry and durable furniture, helping advance Precious Plastic Gambia\'s commitment to environmental sustainability.'
  },
  {
    name: 'Bakary Saidy',
    role: 'Support Staff',
    description: 'Always ready to step in where needed, Bakary supports core operations by running recycling machinery, building durable furniture, and crafting jewelry. He also operates mobility equipment to assist with plastic collection efforts, driving Precious Plastic Gambia\'s sustainability goals forward.'
  },
  {
    name: 'Sheriffo Manneh',
    role: 'Support Staff',
    description: 'A versatile team player, Sheriffo provides crucial operational support through machine operation, furniture fabrication, and jewelry making. He actively assists with plastic collection transport, ensuring smooth daily workflows and contributing to Precious Plastic Gambia\'s circular economy mission.'
  }
];

interface ApiTeamMember {
  id: number;
  name: string;
  role: string;
  category?: 'founder' | 'staff' | 'volunteer';
  description: string;
  image?: string | null;
  image_url?: string;
}

// Public content: a plain instance so a stale login never redirects visitors
const publicApi = axios.create();

const categoryOf = (m: ApiTeamMember) => {
  if (m.category) return m.category;
  const role = m.role.toLowerCase();
  return role.includes('founder') ? 'founder' : role.includes('volunteer') ? 'volunteer' : 'staff';
};

export default function TeamPage() {
  // Starts with the built-in list; replaced by the team managed in Admin > Content > Team
  const [groups, setGroups] = useState<Record<'founder' | 'staff' | 'volunteer', TeamMember[]>>({
    founder: founders,
    staff,
    volunteer: [],
  });

  useEffect(() => {
    publicApi.get(`${API_BASE_URL}/team-members/`, { params: { page_size: 200 } })
      .then(res => {
        const list: ApiTeamMember[] = res.data.results || res.data;
        if (!Array.isArray(list) || list.length === 0) return;
        const next: Record<'founder' | 'staff' | 'volunteer', TeamMember[]> = { founder: [], staff: [], volunteer: [] };
        list.forEach(m => {
          next[categoryOf(m)].push({ name: m.name, role: m.role, description: m.description, image: m.image || m.image_url || undefined });
        });
        setGroups(next);
      })
      .catch(() => { /* keep the built-in list */ });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-black text-slate-900 mb-4">Our Team</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the dedicated team driving the circular economy movement in The Gambia. Together, we're transforming plastic waste into opportunity and building a sustainable future.
            </p>
          </div>

          {/* Founders Section */}
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Founders</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {groups.founder.map((member, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-400 transition-all duration-300">
                  {/* Image */}
                  {member.image && (
                    <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-50">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-8">
                    {/* Role Badge */}
                    <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                      {member.role}
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{member.name}</h3>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Section */}
          <div>
            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Team</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.staff.map((member, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-emerald-400 transition-all duration-300">
                  {member.image && (
                    <div className="w-20 h-20 mb-5 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {/* Role Badge */}
                  <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                    {member.role}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-black text-slate-900 mb-3">{member.name}</h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteers Section */}
          {groups.volunteer.length > 0 && (
            <div className="mt-20">
              <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-2">Volunteers</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <p className="m-0 mt-4 text-slate-600">The people who give their time to cleanups, workshops and our community.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groups.volunteer.map((member, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl font-black text-emerald-700">
                      {member.image ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> : member.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{member.name}</h3>
                    <p className="m-0 text-sm text-emerald-700 font-semibold">{member.role}</p>
                    {member.description && <p className="m-0 mt-2 text-xs text-slate-600 line-clamp-3">{member.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-black mb-4">Join Our Mission</h2>
            <p className="mb-8 max-w-2xl mx-auto opacity-90">
              We're building a community of passionate individuals committed to transforming plastic waste into value. If you share our vision, we'd love to have you on the team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/get-involved#volunteer-form" className="inline-block px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-slate-100 transition">
                Apply to Volunteer
              </Link>
              <Link href="/contact" className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
