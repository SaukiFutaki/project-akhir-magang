'use client'

import { useSession } from "@/hooks/use-session";

export default function ClientComponent() {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in</div>;
  }

  return (
    <div className="bg-slate-100 m-4">
      <h1>This is from client component</h1>
      <h1>Session id: {session.userId}</h1>
      <h1>
        {session.ipAddress}
      </h1>
      <h1>
        {session.token}
        
      </h1>
    </div>
  );
}



// TODO : G denger kamu bilang apa, signal e jelek