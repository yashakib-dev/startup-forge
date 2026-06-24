import { AdminDashboardSidebar } from "@/components/dashboard/admin-dashhboard/AdminDashboardSidebar";


const AdminDashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <AdminDashboardSidebar></AdminDashboardSidebar>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default AdminDashboardLayout;