import { createClient } from '@/supabase/server';
import ReceiptsClient from './receipts-client';

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: receipts, error } = await supabase
    .from('receipts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching receipts:', error);
  }

  return <ReceiptsClient initialReceipts={receipts || []} />;
}