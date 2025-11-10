export interface Receipt {
  id: string;
  merchant: string;
  amount: number;
  date: Date | undefined;
  category: string;
  receipt_image_url: string;
}

export interface ReceiptData {
  merchant: string;
  amount: number;
  date: Date | undefined;
  category: string;
  file: File | null;
}