"use client";

import React, { useRef, useEffect, useState, useTransition } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { CalendarEventType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  File,
  FileText,
  Link as LinkIcon,
  Pencil,
} from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { editEventSchema, FormEditEventValues } from "@/schemas/events.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
interface EventSummaryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventType;
}

export function EventSummaryPopover({
  isOpen,
  onClose,
  event,
}: EventSummaryPopoverProps) {
  const router =useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof editEventSchema>>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: "",
      description: "",
      documentationUrl: "",
    },
  });
  console.log(event.id);
  const onSubmit = (values: FormEditEventValues) => {
    startTransition(() => {

      updateEvent(event.id, values);
      router.refresh();
  
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <Card
        ref={popoverRef}
        className="w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Event" : "Detail Event"}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
              >
                <File className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <IoCloseSharp className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        {isEditing ? (
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Dokumentasi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending}>
                  Simpan
                </Button>
              </form>
            </Form>
          </CardContent>
        ) : (
          <CardContent>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nama Event
                    </p>
                    <p className="text-sm text-gray-500">{event.title}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Tanggal</p>
                    <p className="text-sm text-gray-500">
                      {dayjs(event.date).format("dddd, MMMM D, YYYY")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Waktu{" "}
                      <span className="text-xs text-gray-500 italic">
                        Ditambahkan
                      </span>
                    </p>

                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>

                {event.description && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Deskripsi Event
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.description}
                      </p>
                    </div>
                  </div>
                )}

                {event.documentationUrl && (
                  <div className="flex items-start space-x-3">
                    <LinkIcon className="h-5 w-5 text-gray-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Link Dokumentasi
                      </p>
                      <a
                        href={event.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Klik disini
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
