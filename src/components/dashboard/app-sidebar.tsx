"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Wordmark } from "@/components/site/wordmark";
import type { Role } from "@/generated/prisma/client";

interface NavItem {
  label: string;
  href: string;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "All leads", href: "/dashboard/admin/leads" },
    { label: "Employees", href: "/dashboard/admin/employees" },
    { label: "Partners", href: "/dashboard/admin/partners" },
    { label: "Lenders", href: "/dashboard/admin/lenders" },
    { label: "Reports", href: "/dashboard/admin/reports" },
    { label: "Activity log", href: "/dashboard/admin/activity" },
  ],
  MANAGER: [
    { label: "Overview", href: "/dashboard/manager" },
    { label: "Team leads", href: "/dashboard/manager/leads" },
    { label: "Team members", href: "/dashboard/manager/team" },
  ],
  EMPLOYEE: [
    { label: "My leads", href: "/dashboard/employee" },
    { label: "Follow-ups due", href: "/dashboard/employee/follow-ups" },
    { label: "My target", href: "/dashboard/employee/target" },
  ],
  PARTNER: [
    { label: "My leads", href: "/dashboard/partner" },
    { label: "Referrals", href: "/dashboard/partner/referrals" },
  ],
  CUSTOMER: [{ label: "My application", href: "/dashboard" }],
};

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <Wordmark className="text-sm" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role.charAt(0) + role.slice(1).toLowerCase()}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href}>{item.label}</Link>}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
