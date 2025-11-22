import React from "react";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className="min-h-screen bg-[#F1F1F1] font-inter"
      style={{
        backgroundImage: "url('/images/auth_background.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="min-h-screen flex flex-col sm:flex-row">
        {/* LEFT - Brand / Logo */}
        <aside
          className="w-full sm:w-1/2 flex items-center justify-center p-6 "
          aria-hidden
        >
          <div className="max-w-md w-full flex items-center gap-6 sm:gap-8 pl-2 sm:pl-10">
            {/* Using the uploaded image path as requested */}
            <div className="flex-shrink-0">
              {/* Using plain img to reference the local path - adapt as needed */}
              <Image
                src="/shopAmLogo.png"
                width={500}
                height={500}
                alt="ShopAm logo"
                className="w-44 h-auto select-none"
                draggable={false}
              />
            </div>
          </div>
        </aside>

        {/* RIGHT - Auth Card */}
        <section className="w-full sm:w-1/2 flex items-center justify-center p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
