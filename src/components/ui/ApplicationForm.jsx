"use client";

import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { Briefcase, Envelope, Link as LinkIcon, Text, CircleXmark } from "@gravity-ui/icons";

export default function ApplicationForm({ opportunityId, applicantEmail, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      opportunityId: opportunityId,
      applicantEmail: applicantEmail,
      portfolioLink: "",
      motivationMessage: "",
      status: "Pending"
    }
  });

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Briefcase className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Apply for Opportunity</h2>
            <p className="text-xs text-zinc-400">Provide details to submit your application</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
        >
          <CircleXmark className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Opportunity ID (ReadOnly) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">
            Opportunity ID
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 opacity-60">
            <Briefcase className="text-lg shrink-0 text-zinc-500" />
            <input
              type="text"
              readOnly
              className="w-full bg-transparent text-zinc-400 text-sm outline-none cursor-not-allowed"
              {...register("opportunityId")}
            />
          </div>
        </div>

        {/* Applicant Email (ReadOnly) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">
            Applicant Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 opacity-60">
            <Envelope className="text-lg shrink-0 text-zinc-500" />
            <input
              type="email"
              readOnly
              className="w-full bg-transparent text-zinc-400 text-sm outline-none cursor-not-allowed"
              {...register("applicantEmail")}
            />
          </div>
        </div>

        {/* Portfolio Link */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">
            Portfolio Link
          </label>
          <div
            className={`flex items-center gap-3 rounded-xl border ${
              errors.portfolioLink
                ? "border-red-500/60"
                : "border-zinc-700/80 focus-within:border-indigo-500/60"
            } bg-zinc-900/50 px-4 py-3 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)]`}
          >
            <LinkIcon className={`text-lg shrink-0 ${errors.portfolioLink ? "text-red-400" : "text-zinc-500"}`} />
            <input
              type="text"
              placeholder="https://yourportfolio.com"
              className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
              {...register("portfolioLink", {
                required: "Portfolio link is required",
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL (e.g. https://domain.com)",
                },
              })}
            />
          </div>
          {errors.portfolioLink && (
            <p className="text-red-400 text-xs ml-1">{errors.portfolioLink.message}</p>
          )}
        </div>

        {/* Motivation Message */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">
            Motivation Message
          </label>
          <div
            className={`flex items-start gap-3 rounded-xl border ${
              errors.motivationMessage
                ? "border-red-500/60"
                : "border-zinc-700/80 focus-within:border-indigo-500/60"
            } bg-zinc-900/50 px-4 py-3 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)]`}
          >
            <Text className={`text-lg shrink-0 mt-1 ${errors.motivationMessage ? "text-red-400" : "text-zinc-500"}`} />
            <textarea
              placeholder="Tell the founder why you're a great fit for this opportunity..."
              rows={4}
              className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none resize-none"
              {...register("motivationMessage", {
                required: "Motivation message is required",
                minLength: {
                  value: 20,
                  message: "Please provide a more detailed motivation message (at least 20 characters)",
                },
              })}
            />
          </div>
          {errors.motivationMessage && (
            <p className="text-red-400 text-xs ml-1">{errors.motivationMessage.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="flat"
            onClick={onCancel}
            className="w-full sm:w-1/3 text-zinc-300 border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 transition-all duration-300 py-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full sm:w-2/3 text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:opacity-95 transition-all py-6 rounded-xl border-none"
          >
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}
