"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiCode, 
  FiFileText, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiUploadCloud 
} from "react-icons/fi";
import Image from "next/image";
import { getUserProfile, updateUserProfile } from "@/lib/actions/profile";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "987d1b70f616d233ce02245b8a41d087";

const FounderProfilePage = () => {
  const { data: session, isPending: sessionPending } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      const res = await getUserProfile(session.user.id);
      if (res.success) {
        setProfile(res.user);
        setName(res.user.name);
        setBio(res.user.bio);
        setSkills(res.user.skills);
        setImage(res.user.image);
        setPreview(res.user.image);
      } else {
        toast.error("Failed to load profile details.");
      }
      setLoading(false);
    };

    if (!sessionPending) {
      fetchProfile();
    }
  }, [session, sessionPending]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.data.display_url);
        toast.success("Image uploaded!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Image upload failed");
      setPreview(image);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserProfile(session.user.id, {
        name,
        image,
        skills,
        bio,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        setProfile({
          ...profile,
          name,
          image,
          skills,
          bio,
        });
        setIsEditing(false);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred while saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white p-4">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-zinc-400">Please log in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Founder Profile
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your personal startup identity, domain expertise, and founder bio.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiEdit2 className="size-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* View / Edit Mode */}
        {!isEditing ? (
          <div className="bg-zinc-900/40 border border-zinc-800/85 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-8">
            {/* Card Top: Avatar, Name, Email, Role */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-800/60">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-lg shrink-0">
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-3xl font-bold">
                    {profile?.name ? profile.name[0].toUpperCase() : <FiUser />}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left space-y-1.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Founder
                </span>
                <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                <p className="text-zinc-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                  <FiMail className="text-blue-400" />
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <FiFileText className="text-blue-400" />
                Bio / Vision
              </h3>
              <div className="bg-zinc-950/50 border border-zinc-800/60 p-4 rounded-2xl text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {profile?.bio || (
                  <span className="text-zinc-600 italic">No bio added yet. Click &quot;Edit Profile&quot; to write about your founder journey!</span>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <FiCode className="text-blue-400" />
                Skills &amp; Interests
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-855 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 italic text-sm">No skills added yet.</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-zinc-900/40 border border-zinc-800/85 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
            
            {/* Edit Avatar */}
            <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-zinc-800/60">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-lg shrink-0 bg-zinc-950">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-3xl font-bold">
                    <FiUser />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300">Profile Picture</h3>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiUploadCloud className="size-4" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
                <p className="text-[11px] text-zinc-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FiUser className="text-blue-400" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Bio Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FiFileText className="text-blue-400" />
                Bio / Vision
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your entrepreneurial journey, business vision, and what projects you are building..."
                rows={4}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Skills Tag Input */}
            <div className="space-y-2.5">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <FiCode className="text-blue-400" />
                Skills &amp; Interests
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. Fundraising, Product Strategy, Growth Marketing"
                  className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-650 hover:bg-zinc-750 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FiPlus className="size-4" />
                  Add
                </button>
              </div>

              {/* Skills Tags List */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-200 border border-zinc-750"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <FiX className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Save / Cancel buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/60">
              <button
                type="button"
                onClick={() => {
                  setName(profile?.name || "");
                  setBio(profile?.bio || "");
                  setSkills(profile?.skills || []);
                  setImage(profile?.image || "");
                  setPreview(profile?.image || null);
                  setIsEditing(false);
                }}
                disabled={saving}
                className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <FiX className="size-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
              >
                {saving ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <FiSave className="size-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default FounderProfilePage;