import React, { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin, Upload, X } from "lucide-react";
import { IoMdCalendar } from "react-icons/io";
import { HiOutlineLink, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createEvent } from "@/lib/actions";
import { eventSchema } from "@/schemas/events.schema";
import * as z from "zod";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { MAX_FILE_SIZE, MAX_FILES } from "@/lib/constant";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

interface FilePreview {
  file: File;
  preview: string;
}

export default function EventPopover({
  isOpen,
  onClose,
  date,
}: EventPopoverProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedTime, setSelectedTime] = useState(dayjs().format("HH:mm"));
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      documentationUrl: "",
      documentationFiles: [],
      date: new Date(date),
      time: dayjs().format("HH:mm"),
      location: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = form.getValues("documentationFiles") || [];
    const totalFiles = currentFiles.length + files.length;

    if (totalFiles > MAX_FILES) {
      form.setError("documentationFiles", {
        type: "manual",
        message: `Maximum ${MAX_FILES} images allowed`,
      });
      e.target.value = "";
      return;
    }

    const invalidFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("documentationFiles", {
          type: "manual",
          message: "Each file must be less than 10MB",
        });
        return true;
      }
      if (!file.type.startsWith("image/")) {
        form.setError("documentationFiles", {
          type: "manual",
          message: "Only image files are allowed",
        });
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      e.target.value = "";
      return;
    }

    const newPreviews: FilePreview[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result as string,
        });
        if (newPreviews.length === files.length) {
          setFilePreviews((prev) => [...prev, ...newPreviews]);
          form.setValue("documentationFiles", [...currentFiles, ...files]);
          form.clearErrors("documentationFiles");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    const currentFiles = form.getValues("documentationFiles") || [];
    form.setValue(
      "documentationFiles",
      currentFiles.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    startTransition(async () => {
      await createEvent({
        ...values,
        time: selectedTime,
      });
      router.refresh();
      onClose();
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
          onClick={onClose}
        >
          <motion.div
            ref={popoverRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md px-4"
          >
            <Card className="w-full dark:bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b p-4 dark:border-white">
                <CardTitle className="text-lg font-semibold">
                  Create Event
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="dark:text-white dark:hover:bg-red-400 dark:hover:text-red-100"
                >
                  <IoCloseSharp className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Nama Event"
                              {...field}
                              autoComplete="off"
                              className="my-4 rounded-none border-0 border-b text-2xl focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-white dark:placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date and Time */}
                    <div className="flex items-center space-x-3 dark:text-gray-300">
                      <IoMdCalendar className="size-5 text-slate-600 dark:text-slate-400" />
                      <div className="flex items-center space-x-3 text-sm">
                        <p>{dayjs(date).format("dddd, MMMM D")}</p>
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-24 border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    {/* Location Field */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-3">
                            <MapPin className="size-5 text-slate-600 dark:text-slate-400" />
                            <FormControl>
                              <Input placeholder="Lokasi" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Documentation URL */}
                    <FormField
                      control={form.control}
                      name="documentationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-3">
                            <HiOutlineLink className="size-5 text-slate-600 dark:text-slate-400" />
                            <FormControl>
                              <Input
                                placeholder="Link dokumentasi"
                                {...field}
                                autoComplete="off"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-3">
                            <HiOutlineMenuAlt2 className="size-5 text-slate-600 dark:text-slate-400" />
                            <FormControl>
                              <Textarea
                                placeholder="Deskripsi"
                                {...field}
                                autoComplete="off"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload */}
                    <FormField
                      control={form.control}
                      name="documentationFiles"
                      render={({}) => (
                        <FormItem>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Upload className="size-5 text-slate-600 dark:text-slate-400" />
                              <FormControl>
                                <Input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                                />
                              </FormControl>
                            </div>
                            <p className="text-xs text-slate-500">
                             maksimal upload {MAX_FILES} gambar dengan ukuran maksimal {MAX_FILE_SIZE / 1024 / 1024}MB
                            </p>

                            {/* Image Previews */}
                            {filePreviews.length > 0 && (
                              <ScrollArea className="h-48">
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  {filePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                      <Image
                                        width={200}
                                        height={200}
                                        src={preview.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          "Tambahkan Event"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
