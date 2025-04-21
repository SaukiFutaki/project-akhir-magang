/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  FileText,
  MapPin,
  Facebook,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { CalendarEventType } from '@/types';

interface EventDetailDialogProps {
  event: CalendarEventType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  isEditable?: boolean;
}

const EventDetailDialog = ({
  event,
  isOpen,
  onOpenChange,
  isPending = false,
  isEditable = false,
}: EventDetailDialogProps) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  if (!event) return null;

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const url = window.location.href;
    const text = `Check out this event: ${event.title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    
    window.open(shareUrls[platform], '_blank');
  };

  const nextFile = () => {
    if (event.documentationFiles && currentFileIndex < event.documentationFiles.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
    }
  };

  const prevFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-lg">
        {/* Close button in top-right */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onOpenChange(false)} 
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* File Preview Section */}
        {event.documentationFiles && event.documentationFiles.length > 0 && (
          <div className="relative h-[35vh] w-full bg-gray-100 dark:bg-gray-800">
            {event.documentationFiles[currentFileIndex].url.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${event.documentationFiles[currentFileIndex].url}#view=FitH`}
                title="PDF Preview"
                className="w-full h-full"
              />
            ) : (
              <Image
                fill
                src={event.documentationFiles[currentFileIndex].url}
                alt="Preview"
                className="object-contain"
              />
            )}
            
            {/* Navigation Arrows */}
            {event.documentationFiles.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 rounded-full p-2"
                  onClick={prevFile}
                  disabled={currentFileIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 rounded-full p-2"
                  onClick={nextFile}
                  disabled={currentFileIndex === event.documentationFiles.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {/* File Counter */}
            <div className="absolute bottom-2 right-2 bg-white dark:bg-black text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium shadow-md">
              {currentFileIndex + 1} / {event.documentationFiles.length}
            </div>
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {event.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Event Details
            </DialogDescription>
          </DialogHeader>
          
          <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
          
          <ScrollArea className="pr-2 max-h-[30vh]">
            <div className="space-y-6">
              {/* Event Details */}
              <Card className="p-6 space-y-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>{dayjs(event.date).format("DD MMMM YYYY")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>{event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                )}
              </Card>

              {/* Description */}
              {event.description && (
                <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
                </Card>
              )}

              {/* Thumbnail Gallery */}
              {event.documentationFiles && event.documentationFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {event.documentationFiles.map((file, index) => (
                    <button
                      key={file.id}
                      onClick={() => setCurrentFileIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                        currentFileIndex === index 
                          ? 'ring-2 ring-black dark:ring-white' 
                          : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-400 dark:hover:ring-gray-500'
                      }`}
                    >
                      {file.url.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      ) : (
                        <Image
                          fill
                          src={file.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Share Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              onClick={() => handleShare('whatsapp')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              WhatsApp
            </Button>
            <Button 
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;