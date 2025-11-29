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
  const searchQuery = useSelector((state: RootState) => state.search.query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <header className="bg-[var(--background)] w-full  flex items-center justify-between">
      <div className="flex-1 flex justify-between items-center gap-4 py-6 border-b border-[var(--border)] p-[var(--space-lg)]">
        <div className="flex  items-center gap-36">
          <Link href="/admin-dashboard">
            <Image
              src="/shopAmLogo.png"
              alt={"shopAm Logo"}
              width={2000}
              height={100}
              className="h-20 w-30 object-contain"
            />
          </Link>

          <h1 className="text-2xl text-black font-semibold">
            {headerTitle || "hello"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <Input
              id="global-search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pr-10 min-w-[320px] h-10 px-3 border border-gray-200  rounded-md bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[rgba(233,119,30,0.06)]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)] w-4 h-4" />
          </div>

          <div className="flex items-center ">
            <div className="flex flex-col items-end border-l px-4">
              <p className=" leading-[var(--text-caption-line)] text-sm">
                Admin • ShopAm
              </p>
              <p className="font-medium">Akin Damilola</p>
            </div>
            <Avatar>
              <div className="h-[36px] w-[36px] rounded-full  flex items-center justify-center text-[var(--foreground)] text-[var(--text-caption-size)] font-[var(--text-caption-weight)] bg-gray-300">
                AD
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
