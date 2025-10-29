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
        <Button className="cursor-pointer">
          Welcome to shopAm Admin Dashboard! Click here to get started.
        </Button>
      </Link>
    </div>
  );
};

export default page;
