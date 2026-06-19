"use client";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUploadCloud, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useState, useRef } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const Field = ({ icon: Icon, error, children }) => (
  <div className={`flex items-center gap-3 rounded-xl border ${error ? "border-red-500/60" : "border-zinc-700/80 focus-within:border-blue-500/60"} bg-zinc-900/50 px-3.5 py-2.5 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.08)]`}>
    <Icon className={`text-base shrink-0 ${error ? "text-red-400" : "text-zinc-500"}`} />
    {children}
  </div>
);

const Register = () => {
  const [showPw, setShowPw] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm();

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    clearErrors("image");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { setValue("image", data.data.display_url); toast.success("Image uploaded!"); }
      else throw new Error();
    } catch { toast.error("Upload failed"); setPreview(null); setValue("image", ""); }
    finally { setUploading(false); }
  };

  const removeImage = () => { setPreview(null); setValue("image", ""); if (fileRef.current) fileRef.current.value = ""; };

  const onSubmit = async (data) => {
    if (!data.image) { setError("image", { message: "Profile image is required" }); return; }

    const { email, name, image, password, role } = data;
    const { data: res, error } = await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
      image: image,
      role: role,
    });
    if (res) {
      toast.success("Registration successful!");
      redirect("/");
    }
    if (error) {
      toast.error(error.message);
    }
  };

  const inputCls = "w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950 px-4 py-6 overflow-hidden">
      <div className="absolute top-[15%] left-[20%] h-80 w-80 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] h-80 w-80 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-7 sm:p-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Register <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Account</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">Create your account and start building</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-zinc-300 ml-1">Full Name</label>
              <Field icon={FiUser} error={errors.name}>
                <input type="text" placeholder="John Doe" className={inputCls} {...register("name", { required: "Name is required" })} />
              </Field>
              {errors.name && <p className="text-red-400 text-xs ml-1 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
              <Field icon={FiMail} error={errors.email}>
                <input type="email" placeholder="you@example.com" className={inputCls} {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" } })} />
              </Field>
              {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email.message}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-zinc-300 ml-1">Profile Image</label>
              <input type="file" accept="image/*" ref={fileRef} onChange={uploadImage} className="hidden" />
              <input type="hidden" {...register("image")} />
              {preview ? (
                <div className="flex items-center gap-3 rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-3.5 py-2.5">
                  <Image src={preview} alt="Preview" width={40} height={40} className="w-10 h-10 rounded-lg object-cover border border-zinc-700/50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate">Image uploaded</p>
                    <p className="text-xs text-green-400">{uploading ? "Uploading..." : "Ready"}</p>
                  </div>
                  <button type="button" onClick={removeImage} className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-all cursor-pointer"><FiX className="text-base" /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className={`w-full flex items-center gap-3 rounded-xl border border-dashed ${errors.image ? "border-red-500/60" : "border-zinc-700/80 hover:border-blue-500/40"} bg-zinc-900/50 px-3.5 py-3 transition-all cursor-pointer group`}>
                  <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center group-hover:bg-blue-950/50 transition-colors shrink-0">
                    <FiUploadCloud className={`text-base ${errors.image ? "text-red-400" : "text-zinc-500 group-hover:text-blue-400"} transition-colors`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">Click to upload</p>
                    <p className="text-[11px] text-zinc-600">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </button>
              )}
              {errors.image && <p className="text-red-400 text-xs ml-1 mt-1">{errors.image.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <Field icon={FiLock} error={errors.password}>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" className={inputCls}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                    validate: {
                      upper: (v) => /[A-Z]/.test(v) || "Need one uppercase letter",
                      lower: (v) => /[a-z]/.test(v) || "Need one lowercase letter",
                    },
                  })} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 cursor-pointer">
                  {showPw ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </Field>
              {errors.password ? <p className="text-red-400 text-xs ml-1 mt-1">{errors.password.message}</p>
                : <p className="text-[11px] text-zinc-600 ml-1 mt-1">Min 6 chars • One uppercase • One lowercase</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-zinc-300 ml-1">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {[{ value: "founder", label: "Founder", accent: "peer-checked:border-blue-500/60 peer-checked:bg-blue-950/20" },
                { value: "collaborator", label: "Collaborator", accent: "peer-checked:border-indigo-500/60 peer-checked:bg-indigo-950/20" }
                ].map((r) => (
                  <label key={r.value} className="relative flex items-center justify-center rounded-xl cursor-pointer">
                    <input type="radio" value={r.value} className="peer sr-only" {...register("role", { required: "Select a role" })} />
                    <div className={`absolute inset-0 rounded-xl border border-zinc-700/80 bg-zinc-900/50 ${r.accent} transition-all duration-300`} />
                    <span className="relative text-sm font-medium text-zinc-400 peer-checked:text-white py-3 transition-colors">{r.label}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-red-400 text-xs ml-1 mt-1">{errors.role.message}</p>}
            </div>

            <Button type="submit" isLoading={isSubmitting || uploading} isDisabled={uploading}
              className="w-full text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 py-6 rounded-xl border-none">
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
            <div className="relative flex justify-center"><span className="bg-zinc-950 px-3 text-sm text-zinc-500">OR</span></div>
          </div>

          <Button variant="bordered" onPress={() => { toast.success("Redirecting to Google..."); }}
            className="w-full border-zinc-700/80 border text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/40 transition-all duration-300 py-6 rounded-xl gap-3">
            <FcGoogle /> Continue with Google
          </Button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;