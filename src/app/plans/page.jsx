"use client";

import React from "react";
import { FaCrown, FaCheck, FaArrowRight } from "react-icons/fa";

const PricingPlansPage = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-12 px-4">

            {/* Background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative z-10 text-center">

                {/* Crown Icon */}
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <FaCrown className="w-6 h-6 text-white" />
                </div>

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Premium Founder Plan</h1>
                    <p className="text-zinc-400 text-sm">Post unlimited opportunities and find core team members.</p>
                </div>

                {/* Pricing */}
                <div className="py-2">
                    <span className="text-4xl font-extrabold text-white">$49.99</span>
                    <span className="text-zinc-500 text-sm"> / month</span>
                </div>

                {/* Features List */}
                <ul className="text-left space-y-3 text-sm text-zinc-300 bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl">
                    {[
                        "Post unlimited opportunity roles",
                        "Get priority list placement",
                        "View full applicant profiles & skills",
                        "Premium badge on your profile"
                    ].map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <FaCheck className="text-indigo-400 shrink-0 mt-1 size-3.5" />
                            <span>{feat}</span>
                        </li>
                    ))}
                </ul>

                {/* Checkout Redirect Form */}
                <form action="/api/checkout_sessions" method="POST" className="pt-2">
                <section>
                    <button
                        type="submit" role="link"
                        className="w-full text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                        <span>Checkout</span>
                        <FaArrowRight className="size-3.5" />
                    </button>
                </section>
                </form>

            </div>
        </div>
    );
};

export default PricingPlansPage;
