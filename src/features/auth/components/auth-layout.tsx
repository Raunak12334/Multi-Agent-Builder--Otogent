import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="https://otogent.com"
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
        <Link
          href="https://otogent.com"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/logo.svg" alt="otogent" width={30} height={30} />
          otogent
        </Link>
        {children}
      </div>
    </div>
  );
};
