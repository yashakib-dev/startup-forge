"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaSpinner, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updateStartup } from '@/lib/actions/startup';

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const UpdateStartupIdea = ({ isOpen, onClose, startup, onUpdated }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, setError, clearErrors, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (startup) {
      reset({
        name: startup.name || '',
        email: startup.email || '',
        industry: startup.industry || '',
        fundingStage: startup.fundingStage || '',
        logo: startup.logo || '',
        description: startup.description || '',
      });
      setPreview(startup.logo || null);
    }
  }, [startup, reset]);

  if (!isOpen || !startup) return null;

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid image file");

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    clearErrors("logo");

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setValue("logo", data.data.display_url);
        toast.success("Logo uploaded!");
      } else throw new Error();
    } catch {
      toast.error("Logo upload failed");
      setPreview(null);
      setValue("logo", "");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.logo) {
      setError("logo", { message: "Startup logo is required" });
      return;
    }
    setLoading(true);
    try {
      const res = await updateStartup(startup._id || startup.id, data);
      if (res && (res.modifiedCount > 0 || res.success)) {
        toast.success("Startup updated successfully!");
        onUpdated();
        onClose();
      } else {
        toast.error(res?.message || "Failed to update startup.");
      }
    } catch (err) {
      toast.error("Failed to update startup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FaEdit className="text-blue-500 size-5" />
            <h3 className="text-lg font-bold text-white">Update Startup Idea</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all cursor-pointer">
            <FaTimes className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Startup Name</label>
              <input {...register("name", { required: "Name is required" })} type="text" placeholder="Enter your startup name" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" />
              {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Founder Email</label>
              <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} type="email" placeholder="Enter your email address" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" />
              {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Industry</label>
              <input {...register("industry", { required: "Industry is required" })} type="text" placeholder="e.g. SaaS, Fintech, AI" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all" />
              {errors.industry && <p className="text-[11px] text-red-400">{errors.industry.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Funding Stage</label>
              <select {...register("fundingStage", { required: "Stage is required" })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all">
                <option value="">Select Stage</option>
                {["Bootstrapped", "Pre-Seed", "Seed", "Series A", "Series B", "Series C+"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.fundingStage && <p className="text-[11px] text-red-400">{errors.fundingStage.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Logo</label>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleLogoUpload} className="hidden" />
            <input type="hidden" {...register("logo")} />
            {preview ? (
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-2">
                <img src={preview} alt="Logo Preview" className="w-10 h-10 rounded-lg object-cover border border-zinc-800" />
                <div className="flex-1 min-w-0"><p className="text-xs text-zinc-400 truncate">{uploading ? "Uploading logo..." : "Upload successful"}</p></div>
                <button type="button" onClick={() => { setPreview(null); setValue("logo", ""); }} className="text-xs text-red-400 hover:underline px-2 py-1 cursor-pointer">Remove</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-3 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-400 hover:border-blue-500/50 transition-all cursor-pointer">Click to upload logo</button>
            )}
            {errors.logo && <p className="text-[11px] text-red-400">{errors.logo.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Description</label>
            <textarea {...register("description", { required: "Description is required" })} rows={3} placeholder="Describe your startup..." className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none" />
            {errors.description && <p className="text-[11px] text-red-400">{errors.description.message}</p>}
          </div>

          <button type="submit" disabled={loading || uploading} className="w-full text-white font-semibold py-2.5 px-4 rounded-xl hover:opacity-95 transition-all shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600">
            {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStartupIdea;
