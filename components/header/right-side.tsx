import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface IRightSideProps {
        avatar? : string
    }

export default function RightSide({avatar}:IRightSideProps) {
  return (
    <div className="flex items-center space-x-4">
    {/* <SearchComponent /> */}
    <Select >
      <SelectTrigger className="w-24 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="day">Day</SelectItem>
      </SelectContent>
    </Select>

    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </div>
  )
}
