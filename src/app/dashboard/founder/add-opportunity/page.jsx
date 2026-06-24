"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaCode,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaPlus,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaListAlt,
  FaCrown,
  FaArrowRight
} from 'react-icons/fa';
import { createOpportunity, getOpportunities } from '@/lib/actions/opportunity';
import { useSession } from '@/lib/auth-client';
import { getPremiumStatus } from '@/lib/actions/payments';
import { getPlanById } from '@/lib/api/plans';

const AddOpportunityPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [oppCount, setOppCount] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [freeLimit, setFreeLimit] = useState(3);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      try {
        const [oppsData, premiumData] = await Promise.all([
          getOpportunities(),
          getPremiumStatus(session.user.id),
        ]);

        if (Array.isArray(oppsData)) {
          const mine = oppsData.filter(op => op.founderId === session.user.id);
          setOppCount(mine.length);
        }

        const userIsPremium = premiumData?.isPremium || false;
        setIsPremium(userIsPremium);

        if (userIsPremium) {
          
          setFreeLimit(Infinity);
        } else {
          
          const planId = session.user.plan || "founder_free";
          const planData = await getPlanById(planId);
          if (planData && typeof planData.limit === "number") {
            setFreeLimit(planData.limit);
          } else if (planData && typeof planData.opportunityLimit === "number") {
            setFreeLimit(planData.opportunityLimit);
          }
        }
      } catch (e) {
        // silently fail
      }
    };
    fetchData();
  }, [session]);


  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const onSubmit = async (data) => {
    if (!isPremium && oppCount !== null && oppCount >= freeLimit) {
      toast.error("You have reached the posting limit of your free plan. Please upgrade to post more.");
      return;
    }

    if (skills.length === 0) {
      toast.error("Please add at least one required skill.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        founderId: session?.user?.id,
        title: data.title,
        skills: skills,
        workType: data.workType,
        commitment: data.commitment,
        deadline: data.deadline,
      };

      const res = await createOpportunity(payload);

      if (res && (res.insertedId || res.success)) {
        toast.success("Opportunity posted successfully!");
        reset();
        setSkills([]);
        setOppCount(prev => (prev !== null ? prev + 1 : 1));
        router.push("/dashboard/founder/opportunity");
      } else {
        toast.error(res?.message || "Failed to post opportunity.");
      }
    } catch (err) {
      toast.error("Failed to post opportunity.");
    } finally {
      setLoading(false);
    }
  };

  const isLimitReached = !isPremium && oppCount !== null && oppCount >= freeLimit;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full space-y-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Post Opportunity</h1>
            </div>
            <p className="text-zinc-400 text-sm mt-1">Hire talent by adding a new role and opportunity description.</p>
          </div>
        </div>

        {/* Opportunity Usage Tracker */}
        {oppCount !== null && (
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl px-5 py-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <FaListAlt className="text-indigo-400 size-3" />
                Opportunities Posted
              </span>
              {isPremium ? (
                <span className="text-amber-400 font-semibold">✦ Premium — Unlimited</span>
              ) : (
                <span className="text-zinc-300 font-semibold">
                  {oppCount} / {freeLimit} used &nbsp;·&nbsp;
                  <span className={oppCount >= freeLimit ? 'text-red-400' : 'text-emerald-400'}>
                    {Math.max(0, freeLimit - oppCount)} remaining
                  </span>
                </span>
              )}
            </div>
            {!isPremium && (
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    oppCount >= freeLimit
                      ? 'bg-red-500'
                      : oppCount >= freeLimit - 1
                      ? 'bg-amber-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, (oppCount / freeLimit) * 100)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {isLimitReached ? (
          <div className="relative group bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-3xl backdrop-blur-md shadow-2xl text-center space-y-6 overflow-hidden">
            {/* Ambient theme glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FaCrown className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Post Limit Reached ({oppCount}/{freeLimit})</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                You have used all {freeLimit} free opportunity postings. Upgrade to Premium for unlimited opportunities, priority placement, and team matches!
              </p>
            </div>

            <div className="pt-2 max-w-xs mx-auto">
              <button
                onClick={() => router.push("/plans")}
                className="w-full text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <span>Upgrade to Premium</span>
                <FaArrowRight className="size-3.5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl">
            {/* Role Title */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FaBriefcase className="text-indigo-400" />
                Role Title
              </label>
              <input
                {...register("title", { required: "Role title is required" })}
                type="text"
                placeholder="e.g. Lead Frontend Engineer"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>

            {/* Required Skills (Interactive tag input) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FaCode className="text-indigo-400" />
                Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. React, Node.js, Python"
                  className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-650 hover:bg-zinc-750 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FaPlus className="size-3" />
                  Add
                </button>
              </div>

              {/* Skills Tag List */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-200 border border-zinc-750"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <FaTimes className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Work Type & Commitment Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Work Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-400" />
                  Work Type
                </label>
                <select
                  {...register("workType", { required: "Work type is required" })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Work Type</option>
                  {["Remote", "Hybrid", "On-site"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.workType && <p className="text-xs text-red-400">{errors.workType.message}</p>}
              </div>

              {/* Commitment Level */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                  <FaClock className="text-indigo-400" />
                  Commitment Level
                </label>
                <select
                  {...register("commitment", { required: "Commitment is required" })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Commitment</option>
                  {["Full-time", "Part-time", "Contract", "Internship"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.commitment && <p className="text-xs text-red-400">{errors.commitment.message}</p>}
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-400" />
                Deadline
              </label>
              <input
                {...register("deadline", { required: "Deadline date is required" })}
                type="date"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
              {errors.deadline && <p className="text-xs text-red-400">{errors.deadline.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-4 rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {loading ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <FaCheck className="w-5 h-5" />
                  <span>Post Opportunity</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddOpportunityPage;