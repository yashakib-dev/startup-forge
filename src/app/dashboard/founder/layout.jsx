import { FounderDashboardSidebar } from "@/components/dashboard/FounderDashboardSidebar";

const FounderDashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <FounderDashboardSidebar></FounderDashboardSidebar>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default FounderDashboardLayout;
