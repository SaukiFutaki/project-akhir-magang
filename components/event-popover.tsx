import { createEvent } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { eventSchema, FormEventValues } from "@/schemas/events.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import { HiOutlineLink, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoMdCalendar } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import * as z from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Upload } from "lucide-react";

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      documentationUrl: "",
      documentationFile: undefined,
      date: new Date(date),
      time: dayjs().format("HH:mm"),
    },
  });

  const onSubmit = (values: FormEventValues) => {
    startTransition(async () => {
      await createEvent({
        ...values,
        time: selectedTime,
      });
      router.refresh();
      onClose();
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("documentationFile", file);
      // Create preview if it's an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
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
          >
            <Card className="w-full max-w-md dark:bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b p-4 dark:border-white  ">
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
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nama Event"
                                {...field}
                                className="my-4 rounded-none border-0 border-b text-2xl focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-white dark:placeholder-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-3 dark:text-gray-300"
                    >
                      <IoMdCalendar className="size-5 text-slate-600 dark:text-slate-400" />
                      <div className="flex items-center space-x-3 text-sm">
                        <p>{dayjs(date).format("dddd, MMMM D")}</p>
                        <div className="flex items-center space-x-2">
                          <Input
                            disabled
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-24 border-0 bg-transparent p-0 focus-visible:ring-0"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
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
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center space-x-3">
                              <HiOutlineMenuAlt2 className="size-5 text-slate-600 dark:text-slate-400" />
                              <FormControl>
                                <Textarea placeholder="Deskripsi" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="documentationFile"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center space-x-3">
                              <HiOutlineMenuAlt2 className="size-5 text-slate-600 dark:text-slate-400" />
                              <FormControl>
                                <div className="flex items-center space-x-3">
                                  <Input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    hidden
                                  />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-end"
                    >
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending ? "Creating..." : "Create Event"}
                      </Button>
                    </motion.div>
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
