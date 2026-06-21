"use client";

import { Briefcase, PersonGear, Gear, House, LayoutSideContentRight, Envelope, CirclePlus } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CollaboratorDashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: House, label: "Home", href: "/dashboard/collaborator" },
    { icon: Briefcase, label: "My Collaborators", href: "/dashboard/collaborator/collaborators/new" },
    { icon: PersonGear, label: "Manage Collaborators", href: "/dashboard/collaborator/collaborators" },
    { icon: CirclePlus, label: "Add Opportunity", href: "/dashboard/collaborator/add-opportunity" },
    { icon: Gear, label: "Manage Opportunities", href: "/dashboard/collaborator/opportunity" },
    { icon: Envelope, label: "Applications", href: "/dashboard/collaborator/applications" },
  ];

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              isActive 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold" 
                : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
            }`}
            href={item.href}
          >
            <item.icon className={`size-5 transition-colors ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block w-68 shrink-0 border-r border-default p-4">
        {navContent}
      </aside>

      <Drawer>
        <Button
          className="lg:hidden fixed top-6 left-4 z-50 min-w-10 w-10 h-10 p-0 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 backdrop-blur-md transition-all shadow-lg shadow-black/40"
          variant="secondary"
        >
          <LayoutSideContentRight className="w-5 h-5" />
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}