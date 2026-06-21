import React from "react";

const StatCard = ({ title, value, icon: Icon, description, trend, trendColor }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] group">
      {/* Ambient background glow behind icon on hover */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-600/5 blur-xl transition-all duration-500 group-hover:bg-blue-600/15 group-hover:scale-150 pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-300">
          {Icon && <Icon className="size-6" />}
        </div>
      </div>
      
      {description && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold ${trendColor || "text-emerald-400"}`}>
              {trend}
            </span>
          )}
          <span className="text-zinc-500">{description}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;