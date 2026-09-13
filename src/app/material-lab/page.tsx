'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PlasticType = 'hdpe' | 'pp' | 'ldpe' | 'ghost-net';

interface PlasticInfo {
  name: string;
  code: string;
  description: string;
  sources: string[];
  colorOptions: string[];
  durability: number;
  applications: string[];
  icon: string;
}

const plasticTypes: Record<PlasticType, PlasticInfo> = {
  hdpe: {
    name: 'High-Density Polyethylene',
    code: 'HDPE (#2)',
    description: 'Durable plastic found in milk bottles, detergent containers, and plastic bags.',
    sources: ['Milk bottles', 'Detergent containers', 'Plastic bags', 'Food storage'],
    colorOptions: ['Ocean Blue', 'Milky White', 'Forest Green'],
    durability: 85,
    applications: ['School Desks', 'Outdoor Furniture', 'Structural Blocks'],
    icon: '🥛'
  },
  pp: {
    name: 'Polypropylene',
    code: 'PP (#5)',
    description: 'Lightweight plastic commonly used in food containers, bottle caps.',
    sources: ['Bottle caps', 'Food containers', 'Automotive parts'],
    colorOptions: ['Terra Cotta', 'Sand Beige', 'Deep Maroon'],
    durability: 80,
    applications: ['Coasters', 'Accessories', 'Light Fixtures'],
    icon: '🍲'
  },
  ldpe: {
    name: 'Low-Density Polyethylene',
    code: 'LDPE (#4)',
    description: 'Flexible plastic used in plastic wrap, squeeze bottles.',
    sources: ['Plastic wrap', 'Squeeze bottles', 'Produce bags'],
    colorOptions: ['Clear Crystal', 'Soft Gray', 'Pearl White'],
    durability: 70,
    applications: ['Decorative Items', 'Flexible Sheets'],
    icon: '🎁'
  },
  'ghost-net': {
    name: 'Reclaimed Fishing Nets',
    code: 'Ghost Nets',
    description: 'Ocean-recovered fishing nets transformed into premium products.',
    sources: ['Abandoned fishing nets', 'Discarded trawl lines', 'Coastal recovery'],
    colorOptions: ['Ocean Blue', 'Weathered Gray', 'Midnight Black'],
    durability: 95,
    applications: ['Premium Keychains', 'Marine Accessories'],
    icon: '🌊'
  }
};

export default function MaterialLabPage() {
  const [selectedType, setSelectedType] = useState<PlasticType>('hdpe');
  const [selectedColor, setSelectedColor] = useState(0);
  const plastic = plasticTypes[selectedType];

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl font-black mb-4 text-center">Material Lab</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-center">
            Explore plastic types, color blends, and durability ratings
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Material Selector</h2>
              <div className="space-y-4 mb-12">
                {(Object.entries(plasticTypes) as [PlasticType, PlasticInfo][]).map(([type, info]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setSelectedColor(0);
                    }}
                    className={`w-full p-6 rounded-xl text-left transition border-2 ${
                      selectedType === type
                        ? 'bg-emerald-50 border-emerald-400 shadow-lg'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{info.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{info.name}</p>
                        <p className="text-sm text-slate-600 font-mono mt-1">{info.code}</p>
                        <p className="text-sm text-slate-600 mt-2">{info.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 border-2 border-emerald-200">
                <h3 className="text-2xl font-black text-slate-900 mb-6">{plastic.icon} {plastic.name}</h3>
                <div className="mb-8">
                  <p className="text-sm font-bold text-slate-600 uppercase mb-4">Colors</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {plastic.colorOptions.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`p-3 rounded-lg font-semibold text-xs transition border-2 ${
                          selectedColor === idx
                            ? 'border-slate-900 bg-white'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        {color.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  <div className="h-20 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center">
                    <p className="text-white font-bold">{plastic.colorOptions[selectedColor]}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-bold text-slate-600 uppercase mb-3">Durability</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-200 rounded-full">
                      <div className="h-full bg-emerald-600" style={{ width: `${plastic.durability}%` }} />
                    </div>
                    <p className="text-2xl font-black text-emerald-600">{plastic.durability}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-600 uppercase mb-3">Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {plastic.applications.map((app) => (
                      <span key={app} className="px-3 py-1 bg-white rounded-full text-xs font-semibold border">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                Shop Products
              </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
