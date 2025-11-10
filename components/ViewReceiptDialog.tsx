import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Receipt } from "@/types/receipt";
import { format } from "date-fns";

interface ViewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
}

export const ViewReceiptDialog = ({
  open,
  onOpenChange,
  receipt,
}: ViewReceiptDialogProps) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Receipt Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {receipt.receipt_image_url && (
            <div className="rounded-lg border overflow-hidden">
              {receipt.receipt_image_url.endsWith(".pdf") ? (
                <div className="p-8 text-center bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">
                    PDF Receipt
                  </p>
                  <a
                    href={receipt.receipt_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <img
                  src={receipt.receipt_image_url}
                  alt="Receipt"
                  className="w-full h-auto"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Merchant</p>
              <p className="font-medium">{receipt.merchant}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">
                ${receipt.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {receipt.date ? format(receipt.date, "PPP") : "No date provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{receipt.category}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
