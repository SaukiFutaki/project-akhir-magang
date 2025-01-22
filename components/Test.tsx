"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react'
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  date: Date
  attachments: Array<{
    type: "file" | "document" | "link"
    url: string
    name: string
  }>
}

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date(2025, 0, 1))
  const [events, setEvents] = React.useState<Event[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const addEvent = (event: Event) => {
    setEvents([...events, event])
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -30))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, 30))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <Card
            key={day.toISOString()}
            className="min-h-[100px] p-2 cursor-pointer hover:bg-muted/50"
            onClick={() => setSelectedDate(day)}
          >
            <div className="font-medium">{format(day, "d")}</div>
            {events
              .filter((event) => format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
              .map((event) => (
                <div
                  key={event.id}
                  className="mt-1 text-sm p-1 bg-primary/10 rounded truncate"
                >
                  {event.title}
                </div>
              ))}
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const title = formData.get("title") as string
              const date = formData.get("date") as string
              const file = formData.get("file") as File

              if (title && date) {
                addEvent({
                  id: Math.random().toString(),
                  title,
                  date: new Date(date),
                  attachments: file
                    ? [
                        {
                          type: "file",
                          url: URL.createObjectURL(file),
                          name: file.name,
                        },
                      ]
                    : [],
                })
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="file">Attachment</Label>
              <div className="flex gap-2">
                <Input id="file" name="file" type="file" />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button type="submit">Save Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

