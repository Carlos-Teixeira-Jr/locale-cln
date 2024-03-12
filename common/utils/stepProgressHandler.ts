import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useProgressRedirect(progress: number, step: number, pathname: string) {
  const router = useRouter();

  useEffect(() => {
    if (progress < step) {
      router.push(pathname);
    }
  }, [progress, router]);
}