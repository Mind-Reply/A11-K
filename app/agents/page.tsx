import React, { useState, useEffect } from 'react';
import DesignEvolutionAgent from '@/agents/design-evolution.agent';
import PerformanceTuningAgent from '@/agents/performance-tuning.agent';

export default function AgentCapabilities() {
  const [designEval, setDesignEval] = useState<any[]>([]);
  const [perfMetrics, setPerfMetrics] = useState<any[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runAgents = async () => {
      try {
        // Agent 1: Design Evolution
        const designAgent = new DesignEvolutionAgent();
        const eval = await designAgent.evaluate(document.body);
        setDesignEval(eval);

        // Agent 2: Performance Tuning
        const perfAgent = new PerformanceTuningAgent();
        const metrics = await perfAgent.analyze();
        setPerfMetrics(metrics);
        
        const impr = await perfAgent.optimize(metrics);
        setImprovements(impr);

        setLoading(false);
      } catch (error) {
        console.error('Agent execution error:', error);
        setLoading(false);
      }
    };

    runAgents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
            AI Agent Optimization Showcase
          </h1>
          <p className="text-slate-400 text-lg">
            Frontier 2026 Design + Performance Automation
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 mt-4">Agents analyzing...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent 1: Design Evolution */}
            <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/50 transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🎨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">Design Evolution Agent</h2>
                  <p className="text-slate-500 text-sm">Autonomous design optimization</p>
                </div>
              </div>

              <div className="space-y-3">
                {designEval.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-cyan-300">{item.metric}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.score === 1 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.score === 1 ? '✓ Active' : '◐ Pending'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{item.suggestion}</p>
                    <span className="inline-block text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      Frontier: {item.frontier ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-500">
                  <strong>Capability:</strong> Evaluates container queries, SMIL animations, intent-driven UI, modern CSS functions, WebGL integration, and AI compliance labeling.
                </p>
              </div>
            </div>

            {/* Agent 2: Performance Tuning */}
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-300">Performance Tuning Agent</h2>
                  <p className="text-slate-500 text-sm">Real-time metric optimization</p>
                </div>
              </div>

              <div className="space-y-3">
                {perfMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-purple-300">{metric.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        metric.priority === 'critical' 
                          ? 'bg-red-500/20 text-red-400'
                          : metric.priority === 'high'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {metric.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-2 text-xs">
                      <span className="text-slate-400">Current: <strong className="text-slate-300">{metric.current.toFixed(1)}</strong></span>
                      <span className="text-slate-500">→</span>
                      <span className="text-slate-400">Target: <strong className="text-slate-300">{metric.target}</strong></span>
                    </div>
                    <p className="text-slate-400 text-sm">{metric.frontier_technique}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-500">
                  <strong>Capability:</strong> Tracks Core Web Vitals (FCP, CLS, TTI), bundle size, image optimization, and cache efficiency with frontier-powered recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Improvements Section */}
        {improvements.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-cyan-300 mb-6">Recommended Optimizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvements.map((imp, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-300">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm">{imp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm mb-4">
            <strong>Agents powered by:</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Container Queries',
              'SMIL Animations',
              'Intent-Driven UI',
              'CSS Functions (random, cos, sin)',
              'WebGL/3D',
              'AI Compliance Labeling',
              'Core Web Vitals',
              'Service Workers',
              'Generative Layouts'
            ].map((tech, idx) => (
              <span key={idx} className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-600">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
