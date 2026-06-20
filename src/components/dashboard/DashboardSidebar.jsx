import { Bell, Envelope, Gear, House, LayoutSideContentRight, Magnifier, Person} from "@gravity-ui/icons";
import {Button, Drawer} from "@heroui/react";

export function DashboardSidebar() {
  const navItems = [
    {icon: House, label: "Home"},
    {icon: Magnifier, label: "Search"},
    {icon: Bell, label: "Notifications"},
    {icon: Envelope, label: "Messages"},
    {icon: Person, label: "Profile"},
    {icon: Gear, label: "Settings"},
  ];
  const navContent = <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    type="button"
                  >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                  </button>
                ))}
              </nav>

  return (
    <>

    <aside className="hidden lg:block w-68 shrink-0 border-r border-default p-4">
        {navContent}
    </aside>
    

    <Drawer>
      <Button 
        className="lg:hidden fixed top-6 left-4 z-50 min-w-10 w-10 h-10 p-0  rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 backdrop-blur-md transition-all shadow-lg shadow-black/40" 
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