"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, LayoutDashboard, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setSearchQuery } from "@/features/search";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = React.useState<string | null>(null);
  const headerTitle = useSelector(
    (state: RootState) => state.header.headerTitle
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const searchQuery = useSelector((state: RootState) => state.search.query);

  const initials =
    `${user?.firstName ?? ""}${user?.lastName ?? ""}`
      .split(" ")
      .map((s) => s[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleNavigation = async (path: string) => {
    setIsNavigating(path);
    router.push(path);
  };

  return (
    <header className="bg-[var(--background)] w-full  flex items-center justify-between">
      <div className="flex-1 flex justify-between items-center gap-4 py-6 border-b border-[var(--border)] p-[var(--space-lg)]">
        <div className="flex  items-center">
          <Link href="/admin-dashboard">
            <Image
              src="/shopAmLogo.png"
              alt={"shopAm Logo"}
              width={2000}
              height={100}
              className="h-20 w-30 object-contain"
            />
          </Link>

          <h1 className="text-2xl text-black font-semibold ml-36 mr-8">
            {headerTitle || "Admin Dashboard"}
          </h1>

          <div className="relative w-full w-sm">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>

            <Input
              id="global-search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="
      h-10 pl-10 pr-4 rounded-full
      bg-muted/50 border border-border
      text-foreground placeholder:text-muted-foreground
      focus-visible:ring-2 focus-visible:ring-accent
    "
            />

            <Search
              className="
      absolute left-3 top-1/2 -translate-y-1/2
      h-5 w-5 text-muted-foreground pointer-events-none
    "
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                {/* text block with separator to the right, truncation for long names */}
                <div className="flex flex-col items-end pr-4 border-r border-gray-200 min-w-0">
                  <p className="text-sm leading-5 text-muted-foreground truncate">
                    {user?.role ?? "—"}
                  </p>
                  <p className="font-medium truncate">
                    {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                      "Unknown User"}
                  </p>
                </div>

                {/* Avatar: accessible fallback with initials */}
                <Avatar
                  aria-label={`Profile of ${user?.firstName ?? ""} ${
                    user?.lastName ?? ""
                  }`.trim()}
                >
                  {/* If you use shadcn's AvatarFallback/AvatarImage use those instead */}
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium bg-gray-300 text-foreground"
                    role="img"
                    aria-hidden={false}
                  >
                    {initials}
                  </div>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Logistics Dashboards
              </div>
              <DropdownMenuItem 
                onClick={() => handleNavigation("/logistics/lagos")}
                className="flex items-center gap-3 p-3 cursor-pointer rounded-md focus:bg-green-50 focus:text-green-700 transition-all duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {isNavigating === "/logistics/lagos" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Lagos Logistics</span>
                  <span className="text-xs text-muted-foreground">Manage Lagos hub operations</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation("/logistics/non-lagos")}
                className="flex items-center gap-3 p-3 cursor-pointer rounded-md focus:bg-orange-50 focus:text-orange-700 transition-all duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  {isNavigating === "/logistics/non-lagos" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Non-Lagos Logistics</span>
                  <span className="text-xs text-muted-foreground">Manage regional hub operations</span>
                </div>
              </DropdownMenuItem>
              
              <div className="my-2 border-t border-border/50" />
              
              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 p-3 rounded-md cursor-pointer flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                   <ChevronRight className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              aria-label="Open user menu"
              className="md:hidden"
            >
              <ChevronRight />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { Header };
