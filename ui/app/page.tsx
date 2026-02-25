'use client';

import { useState, useEffect, useRef } from 'react';
import { Database, Zap, Shield, Terminal, GitBranch, Clock } from 'lucide-react';

// ─── Animated background: slow-drifting dot grid ───────────────────────────
function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const spacing = 32;
      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;
      const cx = W * 0.5;
      const cy = H * 0.36;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxD = Math.sqrt(cx * cx + (H * 0.6) * (H * 0.6));
          const norm = 1 - Math.min(dist / maxD, 1);

          // subtle pulse per dot
          const pulse = Math.sin(t * 0.6 + i * 0.4 + j * 0.5) * 0.06;
          const alpha = Math.max(0, norm * 0.45 + pulse);
          const r = norm > 0.5 ? 1.3 : 0.85;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 160, 255, ${alpha})`;
          ctx.fill();
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animId);
      render();
    });
    observer.observe(canvas);
    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Feature card ────────────────────────────────────────────────────────────
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white mb-1">{title}</p>
        <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function WaitlistPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) { setStatus('error'); return; }
    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch('https://sparkdb-waitlist-backend.onrender.com/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: fullName, email }),
      });
      if (res.ok || res.status === 200) {
        setStatus('success');
        setFullName('');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col">
      {/* Font: DM Mono for logo — sharp, technical, not generic */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&family=Outfit:wght@600;700&display=swap');`}</style>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#070708]/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
              <Database className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '-0.04em' }}>
              Spark<span style={{ color: '#60a5fa' }}>DB</span>
            </span>
          </div>

        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <Background />

        {/* edge fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 55% at 50% 38%, transparent 0%, #070708 72%)',
            zIndex: 1,
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20 flex flex-col items-center text-center">

          {/* pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs text-neutral-400 mb-7 sm:mb-9">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />
            Early access — limited spots
          </div>

          {/* headline */}
          <h1 className="text-[32px] sm:text-[46px] md:text-[54px] font-bold tracking-tight leading-[1.12] mb-5 sm:mb-6">
            Any database,<br />
            <span className="text-blue-400">running in seconds.</span>
          </h1>

          <p className="text-[15px] sm:text-base text-neutral-400 max-w-sm sm:max-w-md leading-relaxed mb-3">
            Spark DB provisions Postgres, MySQL, MongoDB, Redis and more — instantly. No Docker, no cluster config, no overhead.
          </p>
          <p className="text-sm text-neutral-600 max-w-xs leading-relaxed mb-10 sm:mb-12">
            Pick your engine. Hit deploy. Get a connection string. Done.
          </p>

          {/* ── Waitlist Form ── */}
          <div id="waitlist" className="w-full max-w-[360px] sm:max-w-[400px]">
            {status === 'success' ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-6 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-600/15 border border-blue-600/25 flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-white mb-1.5">You're on the list.</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  We'll email you when your spot opens up. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-0.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    autoComplete="name"
                    onChange={(e) => { setFullName(e.target.value); setStatus('idle'); }}
                    placeholder="John Doe"
                    className="w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/[0.09] hover:border-white/[0.16] focus:border-blue-500 text-[15px] text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-0.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/[0.09] hover:border-white/[0.16] focus:border-blue-500 text-[15px] text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-400 ml-0.5">
                    Please fill in all fields and try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full h-11 mt-1 rounded-lg text-[15px] font-medium text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    background: loading ? '#1d4ed8' : '#2563eb',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {/* subtle inner highlight */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20 rounded-t-lg"
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span className="text-white/80">Submitting…</span>
                      </>
                    ) : (
                      'Request early access'
                    )}
                  </span>
                </button>

                <p className="text-xs text-neutral-600 text-center">
                  No spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── What is Spark DB ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-5">
            What is Spark DB
          </p>
          <p className="text-[15px] sm:text-base text-neutral-300 leading-[1.75] mb-4">
            Setting up a database takes too long. Configuring a MongoDB Atlas cluster, writing docker-compose files, waiting on provisioning — the overhead costs you hours every week.
          </p>
          <p className="text-[15px] sm:text-base text-neutral-400 leading-[1.75]">
            Spark DB removes all of that. Pick your engine — Postgres, MySQL, MongoDB, Redis — hit deploy, and get a live connection string in under 10 seconds. Fully managed, isolated, and secure. You stay focused on the product.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-10">
            What you get
          </p>
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-9">
            <Feature
              icon={<Zap className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="Instant provisioning"
              desc="Postgres, MySQL, MongoDB, Redis — live in seconds. No config files, no cloud wizards, no waiting."
            />
            <Feature
              icon={<Terminal className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="Built for developers"
              desc="Get a connection string immediately. Works with any ORM, framework, or language you already use."
            />
            <Feature
              icon={<Shield className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="Secure by default"
              desc="TLS everywhere. Isolated environments per project. Access credentials only you control."
            />
            <Feature
              icon={<GitBranch className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="Multiple engines"
              desc="Run Postgres, MySQL, and MongoDB side by side in the same project. No lock-in."
            />
            <Feature
              icon={<Clock className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="One dashboard"
              desc="View connections, monitor usage, scale, or tear down — all from a single clean place."
            />
            <Feature
              icon={<Database className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />}
              title="No Docker needed"
              desc="Stop maintaining docker-compose files for local dev. Spark DB works the same everywhere."
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-[15px] font-semibold text-white mb-1.5">Ready to try it?</p>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              We're opening Spark DB in batches. Join the list and we'll reach out when your spot is ready.
            </p>
          </div>
          <a
            href="#waitlist"
            className="relative shrink-0 inline-flex items-center justify-center h-11 px-5 rounded-lg text-[15px] font-medium text-white transition-all duration-150 overflow-hidden"
            style={{
              background: '#2563eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20 rounded-t-lg" />
            Join the waitlist →
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600/20 flex items-center justify-center">
              <Database className="w-3 h-3 text-blue-500" strokeWidth={2} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '-0.03em', color: '#525252' }}>
              Spark<span style={{ color: '#3b82f6' }}>DB</span>
            </span>
          </div>
          <p className="text-xs text-neutral-700">Spark DB</p>
        </div>
      </footer>

    </div>
  );
}