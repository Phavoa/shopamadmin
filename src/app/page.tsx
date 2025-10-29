import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[var(--background)]">
      <Image
        src="/shopAmLogo.png"
        alt={"shopAm Logo"}
        width={10000}
        height={1000}
        className="h-50 object-contain mx-auto mb-20"
      />
      <Link href="/admin-dashboard">
        <Button className="cursor-pointer mb-4">
          Welcome to shopAm Admin Dashboard! Click here to get started.
        </Button>
      </Link>
      <Link href="/logistics/lagos">
        <Button className="cursor-pointer mb-4 bg-[#02B753] hover:bg-[#02B753]/90">
          Go to Logistics Lagos
        </Button>
      </Link>
      <Link href="/logistics/non-lagos">
        <Button className="cursor-pointe bg-[#0915FF] hover:bg-[#0915FF]/90">
          Go to Logistics Non-Lagos
        </Button>
      </Link>
    </div>
  );
};

export default page;
