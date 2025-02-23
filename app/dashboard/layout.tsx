
import Header from "@/components/header/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export default async function DashboardLayout({children} : {children: React.ReactNode}) {

  return (
    <div className="">
      <ScrollArea className="h-[100vh]">
        <Header />
       
        {children}
      </ScrollArea>
    </div>
  );
}
