"use client"

import { authClient } from "@/lib/auth/auth-client";
import { Session } from "better-auth";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const currentSession = await authClient.getSession();
        setSession(currentSession.data?.session);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setSession(undefined);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  return { session, loading };
}
