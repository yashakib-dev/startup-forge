"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOpportunityById } from "@/lib/actions/opportunity";
import { createApplication } from "@/lib/actions/application";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, Briefcase, Tag, Calendar, PersonGear, Rocket } from "@gravity-ui/icons";
import { Spinner, Button } from "@heroui/react";
import ApplicationForm from "@/components/ui/ApplicationForm";
import { getPlanById } from "@/lib/api/plans";
const OpportunityDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [applying, setApplying] = useState(false);
    const [appliedSuccess, setAppliedSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            if (session?.user?.plan) {
                const planData = await getPlanById(session.user.plan);
                setPlan(planData);
            } else {
                const planData = await getPlanById("founder_free");
                setPlan(planData);
            }
        };
        fetchPlan();
    }, [session]);

    useEffect(() => {
        if (!id) return;
        getOpportunityById(id).then((data) => {
            if (!data || data.error) setNotFound(true);
            else setOpportunity(data);
            setLoading(false);
        });
    }, [id]);

    const handleApplyClick = () => {
        if (!session?.user) {
            router.push("/login");
            return;
        }
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        setApplying(true);
        setErrorMsg("");

        const appData = {
            opportunityId: opportunity?._id || id,
            opportunityTitle: opportunity?.title,
            startupId: opportunity?.startupId,
            startupName: opportunity?.startupName,
            applicantId: session?.user?.id,
            applicantName: session?.user?.name,
            applicantEmail: session?.user?.email,
            portfolioLink: formData.portfolioLink,
            motivationMessage: formData.motivationMessage,
            status: formData.status || "Pending",
            appliedAt: new Date().toISOString(),
        };


        const result = await createApplication(appData);

        if (result && !result.error) {
            setAppliedSuccess(true);
            setShowForm(false);
        } else {
            setErrorMsg(result?.error || "Failed to submit application.");
        }
        setApplying(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <Spinner size="xl" />
        </div>
    );

    if (notFound) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 gap-4">
            <Briefcase className="w-12 h-12 opacity-30" />
            <p className="text-lg font-semibold">Opportunity not found</p>
            <button onClick={() => router.back()} className="text-sm text-indigo-400 hover:underline cursor-pointer">Go back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Back */}
                <button onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back to Opportunities
                </button>

                {showForm ? (
                    <div className="space-y-4">
                        <ApplicationForm
                            opportunityId={id}
                            applicantEmail={session?.user?.email}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                            isSubmitting={applying}
                        />
                        {errorMsg && (
                            <p className="text-xs text-red-400 text-center">{errorMsg}</p>
                        )}
                    </div>
                ) : (
                    /* Hero Card */
                    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">

                        {/* Header: title + icon */}
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-lg border border-zinc-700">
                                <Briefcase className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent truncate">
                                    {opportunity.title}
                                </h1>
                                <span className="mt-1 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                                    {opportunity.role || "Collaborator"}
                                </span>
                            </div>
                        </div>

                        {/* Opportunity Details */}
                        <div className="bg-zinc-800/40 rounded-2xl p-5 border border-zinc-700/40 space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Company / Startup</p>
                                <p className="text-sm font-semibold text-zinc-200">{opportunity.startupName || "Unnamed Startup"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Description</p>
                                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
                            </div>
                            {opportunity.requirements && (
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">Requirements</p>
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{opportunity.requirements}</p>
                                </div>
                            )}
                        </div>

                        {/* Metadata Grid */}
                        <div className="bg-zinc-800/20 rounded-2xl p-4 border border-zinc-800/40 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-0.5">Location</p>
                                <p className="text-sm font-semibold text-zinc-200">{opportunity.location || "Remote"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-0.5">Contact</p>
                                <p className="text-sm font-semibold text-zinc-200">{opportunity.founderEmail || "Via Platform"}</p>
                            </div>
                        </div>

                        {/* Action */}
                        {appliedSuccess ? (
                            <div className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 p-4 rounded-xl text-center text-sm font-semibold">
                                ✓ Successfully applied! You can track status in your dashboard.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Button
                                    isLoading={applying}
                                    onClick={handleApplyClick}
                                    className="w-full text-white font-semibold py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:opacity-95 transition-all"
                                >
                                    Apply Now
                                </Button>
                                {errorMsg && (
                                    <p className="text-xs text-red-400 text-center">{errorMsg}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunityDetailsPage;
