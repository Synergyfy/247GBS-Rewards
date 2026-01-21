'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp, CheckCircle, Sun, Leaf, Snowflake, Flower2, Gift, Percent, Users, Star, Play, X } from 'lucide-react';

// --- Seasonal Data ---
const seasons = [
  {
    id: 'summer',
    name: 'Summer',
    icon: Sun,
    headline: 'Summer Sales, Sorted.',
    subline: 'Keep your customers cool with hot rewards.',
    description: 'During the sunny season, boost foot traffic with refreshing cashback offers, cold beverage promos, and loyalty points that make every visit worth it.',
    dateRange: '21 Jun – 22 Sep',
    colorPrimary: 'from-orange-500 to-yellow-400',
    colorBg: 'from-amber-100/50 to-orange-100/40',
    colorAccent: 'bg-orange-500',
    colorText: 'text-orange-600',
    colorBgLight: 'bg-orange-50',
    colorBorder: 'border-orange-100',
    phoneBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    phoneStats: { title: 'Summer Revenue', value: '£18.2k', growth: '+34%', users: '1,204' },
    phoneNotif: 'Ice Cream Promo Active!',
    btnTextColor: 'text-white'
  },
  {
    id: 'autumn',
    name: 'Autumn',
    icon: Leaf,
    headline: 'Fall into Savings.',
    subline: 'Harvest season = harvest customers.',
    description: 'Autumn brings cozy vibes. Use our campaign tools for pumpkin spice promos, back-to-school deals, and loyalty rewards that keep customers coming back for more.',
    dateRange: '23 Sep – 20 Dec',
    colorPrimary: 'from-orange-600 to-red-500',
    colorBg: 'from-orange-100/50 to-red-100/40',
    colorAccent: 'bg-red-500',
    colorText: 'text-red-600',
    colorBgLight: 'bg-red-50',
    colorBorder: 'border-red-100',
    phoneBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    phoneStats: { title: 'Fall Revenue', value: '£21.5k', growth: '+42%', users: '1,587' },
    phoneNotif: 'Autumn VIP Unlocked!',
    btnTextColor: 'text-white'
  },
  {
    id: 'winter',
    name: 'Winter',
    icon: Snowflake,
    headline: 'Win Big This Winter.',
    subline: 'Make every holiday count.',
    description: 'The festive season is your biggest opportunity. Launch gift card campaigns, holiday sales, and New Year loyalty bonuses that maximize end-of-year revenue.',
    dateRange: '21 Dec – 19 Mar',
    colorPrimary: 'from-blue-500 to-cyan-400',
    colorBg: 'from-blue-100/50 to-cyan-100/40',
    colorAccent: 'bg-blue-500',
    colorText: 'text-blue-600',
    colorBgLight: 'bg-blue-50',
    colorBorder: 'border-blue-100',
    phoneBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    phoneStats: { title: 'Holiday Revenue', value: '£45.8k', growth: '+67%', users: '2,341' },
    phoneNotif: 'Holiday Gift Card Sent!',
    btnTextColor: 'text-white'
  },
  {
    id: 'spring',
    name: 'Spring',
    icon: Flower2,
    headline: 'Spring into Growth.',
    subline: 'New season, new customers.',
    description: 'Spring cleaning for your business! Fresh marketing campaigns, renewal offers, and blooming rewards programs to attract new customers and re-engage old ones.',
    dateRange: '20 Mar – 20 Jun',
    colorPrimary: 'from-green-500 to-emerald-400',
    colorBg: 'from-green-100/50 to-emerald-100/40',
    colorAccent: 'bg-green-500',
    colorText: 'text-green-600',
    colorBgLight: 'bg-green-50',
    colorBorder: 'border-green-100',
    phoneBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    phoneStats: { title: 'Spring Revenue', value: '£16.3k', growth: '+28%', users: '984' },
    phoneNotif: 'Spring Promo Live!',
    btnTextColor: 'text-black'
  },
];

// --- Floating Particles Component ---
const FloatingParticles = ({ season }: { season: typeof seasons[0] }) => {
  const Icon = season.icon;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100, x: Math.random() * 400 - 200, rotate: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: -200, x: Math.random() * 100 - 50, rotate: 360 }}
          transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
          className="absolute bottom-0"
          style={{ left: `${10 + (i * 12)}%` }}
        >
          <Icon className={`w-6 h-6 ${season.colorText} opacity-40`} />
        </motion.div>
      ))}
    </div>
  );
};


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-rotate seasons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % seasons.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentSeason = seasons[currentIndex];

  return (
    <section ref={containerRef} className="relative min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
      {/* Animated background gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSeason.id + '-bg'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${currentSeason.colorBg} z-0`}
        />
      </AnimatePresence>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r ${currentSeason.colorPrimary} rounded-full blur-[150px]`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l ${currentSeason.colorPrimary} rounded-full blur-[150px]`}
        />
      </div>

      <FloatingParticles season={currentSeason} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMjIgNnYySDJ2LTJoMTJ6bTAtNHYtMkgydjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-100 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <motion.div style={{ y, opacity }} className="text-left">
            {/* Season Navigation Pills */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mb-8 flex-wrap"
            >
              {seasons.map((season, index) => (
                <button
                  key={season.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${index === currentIndex
                    ? `${season.colorBgLight} ${season.colorText} ${season.colorBorder} border-2 scale-105`
                    : 'bg-white/70 text-slate-500 border border-slate-200/50 hover:bg-white'
                    }`}
                >
                  <season.icon className="w-4 h-4" />
                  {season.name}
                </button>
              ))}
            </motion.div>

            {/* Main headline - Animated */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSeason.id + '-headline'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.1]">
                  <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${currentSeason.colorPrimary}`}>
                    {currentSeason.headline}
                  </span>
                </motion.h1>
                <p className={`text-xl sm:text-2xl font-bold ${currentSeason.colorText} mb-6`}>
                  {currentSeason.subline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Subheadline - Animated */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentSeason.id + '-desc'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                className="text-lg sm:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium"
              >
                {currentSeason.description}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <button
                onClick={() => setShowVideo(true)}
                className={`group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg ${currentSeason.colorAccent} ${currentSeason.btnTextColor} shadow-xl shadow-${currentSeason.id === 'winter' ? 'blue' : currentSeason.id === 'summer' ? 'orange' : currentSeason.id === 'autumn' ? 'red' : 'green'}-500/20 hover:brightness-110 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95`}
              >
                Start Growing Now
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </button>
            </motion.div>

            {/* Mini Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 text-sm font-semibold text-slate-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${currentSeason.colorText}`} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${currentSeason.colorText}`} />
                <span>14-day free trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative lg:h-[750px] flex items-center justify-center pointer-events-none"
          >
            {/* Blob Background */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSeason.id + '-blob'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-tr ${currentSeason.colorBg} rounded-full blur-3xl`}
              />
            </AnimatePresence>

            {/* CSS Phone Mockup */}
            <div className="relative z-10 w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-slate-900 rounded-[3rem] p-3 sm:p-4 shadow-2xl shadow-slate-900/30 border-[6px] border-slate-800 ring-1 ring-slate-700">
              {/* Screen Content */}
              <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden relative flex flex-col">
                {/* Status Bar */}
                <div className="absolute top-0 w-full h-6 z-20 flex justify-between px-6 items-center text-[10px] font-bold text-slate-800">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-slate-900 rounded-full opacity-20" />
                    <div className="w-3 h-3 bg-slate-900 rounded-full opacity-20" />
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-xl z-20" />

                {/* App UI - Animated */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSeason.id + '-phone'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 bg-white overflow-hidden relative"
                  >
                    {/* Header */}
                    <div className={`${currentSeason.phoneBg} h-40 rounded-b-[2rem] p-4 pt-8 relative overflow-hidden`}>
                      <div className={`absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center">
                          <currentSeason.icon className="w-4 h-4 text-slate-900" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-black/10 backdrop-blur-md" />
                      </div>
                      <h3 className="text-lg font-extrabold leading-tight text-slate-900">Happy {currentSeason.name}!</h3>
                      <p className="text-slate-800 text-[11px] font-bold mt-0.5">{currentSeason.dateRange}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="px-5 -mt-6 relative z-10 grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl shadow-lg shadow-slate-200/50 flex flex-col gap-1.5">
                        <div className={`w-7 h-7 rounded-lg ${currentSeason.colorBgLight} flex items-center justify-center ${currentSeason.colorText}`}>
                          <TrendingUp size={14} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{currentSeason.phoneStats.title}</span>
                        <span className="text-lg font-black text-slate-900">{currentSeason.phoneStats.value}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-lg shadow-slate-200/50 flex flex-col gap-1.5">
                        <div className={`w-7 h-7 rounded-lg ${currentSeason.colorBgLight} flex items-center justify-center ${currentSeason.colorText}`}>
                          <Users size={14} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">Active Users</span>
                        <span className="text-lg font-black text-slate-900">{currentSeason.phoneStats.users}</span>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="px-5 mt-4">
                      <div className={`${currentSeason.colorBgLight} rounded-xl p-4 border ${currentSeason.colorBorder}`}>
                        <div className="flex justify-between items-end h-20 gap-1.5">
                          {[35, 55, 45, 70, 50, 85, 65].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: '0%' }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, delay: 0.3 + (i * 0.08) }}
                              className={`w-full ${currentSeason.colorAccent} rounded-t-sm opacity-80`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-bold uppercase">
                          <span>Mon</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Notification */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute bottom-16 right-4 bg-white p-3 rounded-xl shadow-xl ${currentSeason.colorBorder} border z-20 max-w-[130px]`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-6 h-6 rounded-lg ${currentSeason.colorBgLight} flex items-center justify-center ${currentSeason.colorText}`}>
                          <Sparkles size={12} />
                        </div>
                        <div className={`text-[10px] font-bold ${currentSeason.colorText}`}>{currentSeason.phoneNotif}</div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full ${currentSeason.colorAccent} rounded-full`}
                        />
                      </div>
                    </motion.div>

                    {/* Growth Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                      className={`absolute bottom-16 left-4 ${currentSeason.colorAccent} text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {currentSeason.phoneStats.growth}
                    </motion.div>

                  </motion.div>
                </AnimatePresence>

                {/* Bottom Bar */}
                <div className="h-1 bg-slate-900 mx-auto w-1/3 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2" />
              </div>

              {/* Physical Buttons */}
              <div className="absolute top-20 -left-[2px] w-[2px] h-7 bg-slate-700 rounded-l-md" />
              <div className="absolute top-32 -left-[2px] w-[2px] h-12 bg-slate-700 rounded-l-md" />
              <div className="absolute top-32 -right-[2px] w-[2px] h-12 bg-slate-700 rounded-r-md" />
            </div>
          </motion.div>

        </div>
      </div>
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:rotate-90"
              >
                <X size={24} />
              </button>

              {/* YouTube Embed */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/P1rPiSxYagM?autoplay=1&rel=0&showinfo=0"
                title="247GBS Platform Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
