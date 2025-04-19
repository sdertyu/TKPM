"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-white min-h-screen">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
