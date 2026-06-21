import { CollaboratorDashboardSidebar } from "@/components/dashboard/collaborator-dashboard/CollaboratorDashboardSidebar";


const CollaboratorDashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <CollaboratorDashboardSidebar></CollaboratorDashboardSidebar>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default CollaboratorDashboardLayout;