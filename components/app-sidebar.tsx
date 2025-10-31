"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  MusicIcon,
  MenuIcon,
  SettingsIcon,
  BarChart3Icon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Inventario",
      url: "/dashboard/inventario",
      icon: PackageIcon,
    },
    {
      title: "Ventas",
      url: "/dashboard/ventas",
      icon: ShoppingCartIcon,
    },
    {
      title: "DJ Requests",
      url: "/dashboard/canciones",
      icon: MusicIcon,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/dashboard/config",
      icon: SettingsIcon,
    },
    {
      title: "Carta Digital",
      url: "/carta",
      icon: MenuIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link
                href="/dashboard"
                className="flex items-center  justify-evenly"
              >
                <Image
                  src="/dulce-juerga-logo.png"
                  className="p-1 h-10 w-10"
                  alt="Logo"
                  width={30}
                  height={30}
                />
                <span className="text-base truncate font-semibold">
                  Dulce Juerga
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
        <NavSecondary
          items={data.navSecondary}
          pathname={pathname}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
