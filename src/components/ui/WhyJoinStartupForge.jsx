"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiBriefcase } from "react-icons/fi";

const features = [
  {
    icon: FiUsers,
    title: "Vetted Community",
    description: "Connect with high-caliber developers, designers, and marketers who are passionate about building real products.",
    color: "border-blue-500 bg-blue-500/5",
  },
  {
    icon: FiBriefcase,
    title: "Curated Opportunities",
    description: "Find co-founders, early-stage partnerships, and roles that match your precise skills and professional goals.",
    color: "border-indigo-500 bg-indigo-500/5",
  },
  {
    icon: FiTrendingUp,
    title: "Seamless Growth",
    description: "Accelerate your idea with collaborative tools, deal flows, and instant connections to active accelerators.",
    color: "border-purple-500 bg-purple-500/5",
  },
];

export default function WhyJoinStartupForge() {
  return (
    <section className="relative py-20 bg-zinc-950 text-white overflow-hidden border-t border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Forge Your Success with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Elite Partners
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            StartupForge is engineered for builders. We bypass the noise of standard social platforms to connect you with serious collaborators ready to ship code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`flex flex-col gap-4 p-6 rounded-2xl border-l-4 ${feature.color} bg-zinc-900/20 border border-y-zinc-900 border-r-zinc-900 hover:border-zinc-800 transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-850 flex items-center justify-center text-indigo-400 border border-zinc-700/30">
                  <Icon className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}