"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopAppBar() {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100/50 shadow-sm flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50">
      <Link href="/home" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">school</span>
        </div>
        <span className="text-2xl font-black text-primary tracking-tighter">
          EduAI
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => alert("Жаңа хабарламалар жоқ")}
          className="hover:bg-blue-50 transition-colors active:scale-95 duration-200 p-2.5 rounded-2xl text-outline"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors shadow-sm block"
        >
          <Image
            className="w-full h-full object-cover"
            width={40}
            height={40}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-c6ftNBC1ZQlrW9Y58z2PxCwcHTiEOBNIoT_3cZWJq8oLuKe3JaX2IH_62qxsBT6A76vJfLXROZue7wowOb5bYP2CubRsONGQmkW-CHNWtJESRO_92S3qtY7KbNVkS86INLC2vUXT-3RlfqbmFd7PhHRiUHcY9rTrNaVJmXGwkcz7Wko0GCOCV6ATUsF1AijEPdnlBLOJUo4wN0ADhza-82m7CBYA7afzjYllYNG9eBcNun9SOx1FBRNEIi18K7y6uA-Duy9zVkSX"
            alt="Profile"
          />
        </Link>
      </div>
    </header>
  );
}
