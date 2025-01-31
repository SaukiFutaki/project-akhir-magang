"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewStore } from "@/lib/store";
import { LogOut } from "lucide-react";
import { ModeToggle } from "../dark-mode";

interface IRightSideProps {
  avatar?: string;
  username?: string;
  logout?: () => void;
}

export default function RightSide({
  avatar,
  username,
  logout,
}: IRightSideProps) {
  const { setView } = useViewStore();

  const capitalizeEachWord = (string?: string) => {
    if (!string) return "User"; // Fallback jika username kosong
    return string
      .split(" ") // Pisahkan kata-kata berdasarkan spasi
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Kapitalisasi huruf pertama
      .join(" "); // Gabungkan kembali kata-kata
  };
  return (
    <div className="flex items-center space-x-4">
      {/* <SearchComponent /> */}
      <ModeToggle />
      <Select onValueChange={(v) => setView(v)}>
        <SelectTrigger className="w-24 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="ring-2 ring-green-500">
            <AvatarImage src={avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-4">
          <DropdownMenuLabel>{capitalizeEachWord(username)}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="bg-red-500 hover:cursor-pointer" onClick={logout}>
            <LogOut />
            <span>Sign out</span>

           
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
