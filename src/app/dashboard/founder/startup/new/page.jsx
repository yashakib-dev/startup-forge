"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Check } from '@gravity-ui/icons';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createStartup } from '@/lib/actions/startup';

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const CreateNewStartupPage = () => {
    const router = useRouter();
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, setError, clearErrors, reset, formState: { errors } } = useForm();

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
            const payload = {
                name: data.name,
                email: data.email,
                industry: data.industry,
                fundingStage: data.fundingStage,
                logo: data.logo,
                description: data.description
            };

            const res = await createStartup(payload);

            if (res && res.insertedId) {
                toast.success("Startup created successfully!");
                reset();
                setPreview(null);
                router.push("/dashboard/founder/startup");
            } else {
                toast.error(res?.message || "Failed to create startup.");
            }
        } catch (err) {
            toast.error("Failed to create startup.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto w-full space-y-8">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-all cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Launch Startup</h1>
                        <p className="text-zinc-400 text-sm mt-1">Get started by filling out your project's basic information.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Startup Name</label>
                            <input {...register("name", { required: "Name is required" })} type="text" placeholder="Enter your startup name" className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Founder Email</label>
                            <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} type="email" placeholder="Enter your email address" className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Industry</label>
                            <input {...register("industry", { required: "Industry is required" })} type="text" placeholder="e.g. SaaS, Fintech, AI" className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                            {errors.industry && <p className="text-xs text-red-400">{errors.industry.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Funding Stage</label>
                            <select {...register("fundingStage", { required: "Stage is required" })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all">
                                <option value="">Select Stage</option>
                                {["Bootstrapped", "Pre-Seed", "Seed", "Series A", "Series B", "Series C+"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.fundingStage && <p className="text-xs text-red-400">{errors.fundingStage.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
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
                            <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-4 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-400 hover:border-indigo-500/50 transition-all cursor-pointer">Click to upload logo</button>
                        )}
                        {errors.logo && <p className="text-xs text-red-400">{errors.logo.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400">Description</label>
                        <textarea {...register("description", { required: "Description is required" })} rows={3} placeholder="Describe your startup's core vision, product, and target market..." className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                    </div>

                    <button type="submit" disabled={loading || uploading} className="w-full  text-white font-semibold py-3 px-4 rounded-xl hover:opacity-95 transition-all shadow-lg hover:shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-5 h-5" /><span>Create Startup</span></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewStartupPage;