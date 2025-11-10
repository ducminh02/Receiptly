"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, Plus } from "lucide-react";
import { CreateExpenseDialog } from "@/components/AddReceiptDialog";
import { ViewReceiptDialog } from "@/components/ViewReceiptDialog";
import { Receipt, ReceiptData } from "@/types/receipt";
import { format } from "date-fns";
import { toast } from "sonner";
import { createClient } from '@/supabase/client';
import { categories } from "@/lib/utils";

interface ReceiptsClientProps {
  initialReceipts: Receipt[];
}


export default function ReceiptsClient({ initialReceipts }: ReceiptsClientProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const filteredReceipts =
    categoryFilter === "all"
      ? receipts
      : receipts.filter((r) => r.category === categoryFilter);

      const supabase = createClient();

  const addReceipt = async (receiptData: ReceiptData) => {
    try {

      let imageUrl = null;

      // Step 1: Upload image to Supabase Storage if file exists
      if (receiptData.file) {
        const file = receiptData.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipt_imgs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error('Failed to upload receipt image');
          return;
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('receipt_imgs')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Step 2: Insert expense data with image URL into database
      const newReceipt = {
        merchant: receiptData.merchant,
        amount: receiptData.amount,
        date: receiptData.date,
        category: receiptData.category,
        receipt_image_url: imageUrl,
      };

      const { data, error } = await supabase
        .from('receipts')
        .insert([newReceipt])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        toast.error('Failed to create expense');
        
        // If database insert fails but file was uploaded, optionally delete the file
        if (imageUrl && receiptData.file) {
          const filePath = imageUrl.split('/receipts/')[1];
          await supabase.storage.from('receipts').remove([`receipts/${filePath}`]);
        }
      } else {
        setReceipts([data, ...receipts]);
        toast.success('Expense created successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to create expense');
    }
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setViewDialogOpen(true);
  };

  const handleDeleteReceipt = async (id: string) => {
    try {

      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting receipt:', error);
        toast.error('Failed to delete receipt');
      } else {
        setReceipts(receipts.filter((r) => r.id !== id));
        toast.success("Receipt deleted successfully");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Receipts</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add receipt
          </Button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No receipts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">
                      {receipt.merchant}
                    </TableCell>
                    <TableCell>
                      ${receipt.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {receipt.date ? format(new Date(receipt.date), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>{receipt.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewReceipt(receipt)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReceipt(receipt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialogs */}
        <CreateExpenseDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={addReceipt}
        />

        <ViewReceiptDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          receipt={selectedReceipt}
        />
      </div>
    </div>
  );
}