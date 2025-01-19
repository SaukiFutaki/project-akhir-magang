import { DefaultDemo } from "@/components/tab-bar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Button variant={"destructive"}>
        click me
      </Button>
      <DefaultDemo />
    </div>
  );
}
