"use client";

import { Home, ArrowLeft, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#bac095] text-center px-6 py-10">
      <div className="max-w-lg w-full space-y-8">
        {/* Icon and 404 Number */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#59641a] blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <SearchX className="size-24 text-[#59641a] relative z-10 animate-bounce" />
          </div>
          <h1 className="text-8xl md:text-9xl font-extrabold text-[#59641a] drop-shadow-lg">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-3xl md:text-4xl font-bold text-[#59641a]">
            Page not found
          </p>
          <p className="text-lg text-[#555f24] max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d2da95ac] text-[#555f24] font-bold hover:bg-[#d2da95d3] transition-colors cursor-pointer shadow-md"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4a5317e5] text-[#dee5b4] font-bold hover:bg-[#4a5317] transition-colors cursor-pointer shadow-md"
          >
            <Home className="size-5" />
            Go Home
          </button>
        </div>

        {/* Decorative elements */}
        <div className="pt-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#59641a] opacity-30 animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 rounded-full bg-[#59641a] opacity-30 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-[#59641a] opacity-30 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </main>
  );
}
