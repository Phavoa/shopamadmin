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
import { Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setSearchQuery } from "@/features/search";

function Header() {
  const dispatch = useDispatch();
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
          <div className="flex items-center gap-4">
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
