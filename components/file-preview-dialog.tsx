import { DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';

interface FilePreviewDialogProps {
  file: {
    url: string;
  };
  index : number;
}

const FilePreviewDialog = ({ file,index }: FilePreviewDialogProps) => {
  const isPdf = file.url.toLowerCase().endsWith('.pdf');

  return (
    <DialogContent className="max-w-3xl">
      {isPdf ? (
        <div className="h-[80vh] w-full">
          <iframe
            src={`${file.url}#view=FitH`}
            title="PDF Preview"
            className="w-full h-full rounded-md"
          />
        </div>
      ) : (
        <div className="relative aspect-video">
          <Image
            fill
            src={file.url}
            alt={`Documentation file ${index}`}
            className="rounded-md object-contain"
          />
        </div>
      )}
    </DialogContent>
  );
};

export default FilePreviewDialog;