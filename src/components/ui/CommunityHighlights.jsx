"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiClock, FiZap } from "react-icons/fi";

const highlights = [
  {
    title: "Weekly Founder Matchmaking",
    description: "Join our signature speed-matching event to meet potential co-founders and team members.",
    tag: "Live Event",
    time: "Every Friday at 5:00 PM EST",
    icon: FiUsers,
    accent: "text-blue-400 border-blue-500/20 bg-blue-950/30",
  },
  {
    title: "Pitch Forge Hackathon v2",
    description: "Submit your idea, form a team in 48 hours, and win up to $10,000 in cloud credits.",
    tag: "Competition",
    time: "Registration opens in 3 days",
    icon: FiZap,
    accent: "text-indigo-400 border-indigo-500/20 bg-indigo-950/30",
  },
];

export default function CommunityHighlights() {
  return (
    <section className="relative py-20 bg-zinc-950 text-white overflow-hidden border-t border-zinc-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 text-xs font-semibold text-purple-400 mb-4">
            {"What's Happening"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Community{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Highlights
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            Stay tuned to the latest community meetups, hackathons, and matching opportunities inside StartupForge.
          </p>
        </div>

        {/* Timeline Line container */}
        <div className="relative border-l border-zinc-800 ml-4 sm:ml-6 space-y-12">
          {highlights.map((highlight, i) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-zinc-400">
                  <Icon className="text-sm" />
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md hover:border-zinc-700/50 transition-all duration-300">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                    <h3 className="text-lg font-bold text-white">{highlight.title}</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${highlight.accent}`}>
                      {highlight.tag}
                    </span>
                  </div>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {highlight.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <FiClock />
                    <span>{highlight.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}