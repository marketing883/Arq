"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WhitepapersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/content?type=whitepapers");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );
}
