"use client";

import React, { useState } from 'react';
import { FaTrash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { deleteStartup } from '@/lib/actions/startup';

const DeleteStartupIdea = ({ isOpen, onClose, startup, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !startup) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteStartup(startup._id || startup.id);
      if (res && (res.deletedCount > 0 || res.success)) {
        toast.success("Startup deleted successfully!");
        onDeleted();
        onClose();
      } else {
        toast.error(res?.message || "Failed to delete startup.");
      }
    } catch (err) {
      toast.error("Failed to delete startup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl transition-all duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <FaTrash className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Startup</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Are you sure you want to delete <span className="font-semibold text-white">"{startup.name}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all text-sm font-semibold shadow-lg shadow-rose-600/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? <FaSpinner className="size-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStartupIdea;
