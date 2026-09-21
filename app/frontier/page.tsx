"use client";

import { useEffect, useState } from 'react';

export default function FrontierHomepage() {
  const [containerQuery, setContainerQuery] = useState(false);

  useEffect(() => {
    // Detect if browser supports container queries
    if (typeof CSS !== 'undefined' && CSS.supports('container-type: inline-size')) {
      setContainerQuery(true);
    }
  }, []);

  return (
    <main className="frontier-homepage">
      <style>{`
        .frontier-container {
          container-type: inline-size;
          container-name: frontier;
        }
        
        @container frontier (min-width: 400px) {
          .frontier-card { grid-column: span 2; }
        }
        
        @container frontier (min-width: 800px) {
          .frontier-card { grid-column: span 4; }
        }
        
        .frontier-grid {
          display: grid;
          gap: clamp(1rem, var(--gap, 1rem), 2rem);
          grid-template-columns: repeat(
            auto-fit,
            minmax(clamp(250px, 50vw, 400px), 1fr)
          );
        }
        
        .frontier-item {
          animation: slideInUp calc(0.3s * (var(--index, 1))) ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .frontier-card {
          border-radius: clamp(8px, 1vw, 16px);
          border: 2px solid rgba(94, 234, 212, 0.3);
          backdrop-filter: blur(10px);
          background: rgba(11, 15, 20, 0.5);
          padding: clamp(1rem, 3vw, 2rem);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .frontier-card:hover {
          border-color: rgba(94, 234, 212, 0.8);
          background: rgba(11, 15, 20, 0.8);
          transform: translateY(-4px);
        }
        
        .frontier-accent {
          color: hsl(175, 100%, 50%);
        }
      `}</style>

      <section className="frontier-container py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-6xl font-bold mb-4">
              <span className="frontier-accent">Frontier Design</span> meets AI Optimization
            </h1>
            <p className="text-xl text-slate-400 mb-6">
              Container queries, generative layouts, SMIL animations, and autonomous agents working together.
            </p>
            <div className="flex gap-4">
              <button className="frontier-card px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30">
                Explore Features →
              </button>
              <a href="/agents" className="frontier-card px-6 py-3">
                View Agents ↗
              </a>
            </div>
          </div>

          <div className="frontier-grid">
            {[
              { title: 'Container Queries', desc: 'Components adapt to parent size, not viewport' },
              { title: 'CSS Functions', desc: 'random(), cos(), sin() for generative layouts' },
              { title: 'SMIL Animations', desc: 'SVG animations without JavaScript' },
              { title: 'Intent-Driven UI', desc: 'Gesture and voice-first interactions' },
              { title: 'WebGL/3D', desc: 'Immersive experiences with Three.js' },
              { title: 'AI Compliance', desc: 'Transparency badges for AI assets' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="frontier-card frontier-item" 
                style={{ '--index': idx + 1 } as React.CSSProperties}
              >
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 frontier-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">AI Agents Running</h2>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm">Active</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-900/50 rounded">
                <h3 className="font-semibold mb-2">🎨 Design Evolution Agent</h3>
                <p className="text-sm text-slate-400">Autonomous design self-optimization</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded">
                <h3 className="font-semibold mb-2">⚡ Performance Tuning Agent</h3>
                <p className="text-sm text-slate-400">Real-time metric optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
