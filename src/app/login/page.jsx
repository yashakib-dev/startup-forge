"use client";

import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {

      const { email, password } = data;
      const { data: res, error } = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: true,
        callbackURL: "/",
      });
      if (error) {
        console.log(error);
        
        toast.error(error.message);
      }
      if (res) {
        toast.success("Login successful")
      }

    } catch (error) {
      toast.error("Login failed!");
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[15%] left-[20%] h-80 w-80 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] h-80 w-80 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center my-6 mb-8">

            <h1 className="text-3xl font-extrabold text-white">
              Welcome{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Sign in to your StartupForge account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Email
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border ${errors.email
                  ? "border-red-500/60"
                  : "border-zinc-700/80 focus-within:border-blue-500/60"
                  } bg-zinc-900/50 px-4 py-3 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]`}
              >
                <FiMail
                  className={`text-lg shrink-0 ${errors.email ? "text-red-400" : "text-zinc-500"
                    }`}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Password
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border ${errors.password
                  ? "border-red-500/60"
                  : "border-zinc-700/80 focus-within:border-blue-500/60"
                  } bg-zinc-900/50 px-4 py-3 transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]`}
              >
                <FiLock
                  className={`text-lg shrink-0 ${errors.password ? "text-red-400" : "text-zinc-500"
                    }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasUppercase: (v) =>
                        /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                      hasLowercase: (v) =>
                        /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href=""
                className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 py-6 rounded-xl border-none"
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-zinc-950 px-3 text-sm text-zinc-500">
                OR
              </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            variant="bordered"
            onPress={handleGoogleLogin}
            className="w-full border-zinc-700/80 border text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/40 transition-all duration-300 py-6 rounded-xl gap-3"
          >
            <FcGoogle />
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="mt-7 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;