"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
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
  const { selectedView, setView } = useViewStore();

  const capitalizeEachWord = (string?: string) => {
    if (!string) return "User";
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="flex items-center space-x-4">
      <ModeToggle />
      <Select value={selectedView} onValueChange={(v) => setView(v)}>
        <SelectTrigger className="w-24 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
          <SelectValue>
            {selectedView === "month" && "Bulan"}
            {selectedView === "week" && "Minggu"}
            {selectedView === "day" && "Hari"}
            {selectedView === "year" && "Tahun"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">
            Bulan
          </SelectItem>
          <SelectItem value="week">
            Minggu
          </SelectItem>
          <SelectItem value="day">
            Hari
          </SelectItem>
          <SelectItem value="year">
            Tahun
          </SelectItem>
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
          <DropdownMenuItem 
            className="bg-red-500 hover:cursor-pointer text-white" 
            onClick={logout}
          >
            <LogOut className="mr-2" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}