import { auth } from "@/auth";
import { signOut } from "@/lib/actions";
import { headers } from "next/headers";
import LeftSide from "./left-side";
import RightSide from "./right-side";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userImage = session?.user.image;
  const userName = session?.user.name;
 
  return (
    <div className="mx-3 flex items-center justify-between py-4 ">
      <LeftSide />
      <RightSide avatar={userImage ?? ""} username={userName} logout={signOut} />
    </div>
  );
}
