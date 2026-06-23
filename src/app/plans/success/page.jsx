"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaCrown, FaArrowRight } from "react-icons/fa";

const SuccessPageContent = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative z-10 text-center">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <FaCheckCircle className="w-8 h-8 text-white" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-amber-400">
            <FaCrown className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Premium Activated</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Subscription Successful!</h1>
          <p className="text-zinc-400 text-sm leading-relaxed px-4">
            Thank you for subscribing to the Premium Founder Plan. Your account features have been successfully upgraded.
          </p>
        </div>

        {/* Plan Summary Card */}
        <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl text-left text-xs text-zinc-400 space-y-2.5">
          <div className="flex justify-between border-b border-zinc-850/60 pb-2">
            <span>Selected Plan:</span>
            <span className="text-zinc-200 font-semibold">Premium Founder</span>
          </div>
          <div className="flex justify-between border-b border-zinc-850/60 pb-2">
            <span>Billing Period:</span>
            <span className="text-zinc-300">Yearly</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="text-emerald-400 font-bold">$49.99 / year</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            onClick={() => router.push("/dashboard/founder")}
            className="w-full text-white font-semibold py-3.5 px-6 rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <span>Go to Dashboard</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;