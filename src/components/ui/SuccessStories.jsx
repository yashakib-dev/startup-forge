"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

const stories = [
  {
    name: "Sarah Chen",
    role: "Co-Founder, NovaMed AI",
    metric: "$4.2M Raised",
    quote: "StartupForge connected me with an investor who truly understood our vision. We closed our seed round in three months.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Marcus Thompson",
    role: "Founder, FinFlow",
    metric: "10k Active Users",
    quote: "The Browse Opportunities section is a goldmine. I found three incredible advisors and our lead investor within weeks.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    name: "Priya Patel",
    role: "CEO, EduVerse",
    metric: "300% Growth",
    quote: "As a solo founder, StartupForge gave me confidence and community. We grew from an idea to a team of six quickly.",
    gradient: "from-purple-500 to-pink-600",
  },
];

export default function SuccessStories() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + stories.length) % stories.length);
  const next = () => setIndex((i) => (i + 1) % stories.length);

  return (
    <section className="relative py-20 bg-zinc-950 text-white overflow-hidden border-t border-zinc-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-4">
            Milestones Reached
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Success{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            Real stories from founders who connected, raised capital, and built thriving startups through StartupForge.
          </p>
        </div>

        <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-md p-8 sm:p-12 min-h-[300px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FaQuoteLeft className="text-indigo-500/20 text-4xl" />
              <p className="text-zinc-200 text-lg sm:text-xl md:text-2xl leading-relaxed font-medium">
                {stories[index].quote}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stories[index].gradient} flex items-center justify-center font-bold text-white`}>
                    {stories[index].name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{stories[index].name}</h4>
                    <p className="text-zinc-500 text-xs">{stories[index].role}</p>
                  </div>
                </div>
                <div>
                  <span className="inline-block text-xs font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl">
                    {stories[index].metric}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-8 bg-indigo-500" : "w-2 bg-zinc-800"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-3 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}