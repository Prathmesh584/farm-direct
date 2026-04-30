"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Uses the SECRET key so users cannot manipulate stock via the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseSecretKey);

export async function processCheckout(productId: string) {
  try {
    // 1. Check current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError || !product) throw new Error("Product not found");
    if (product.stock <= 0) throw new Error("Item is sold out!");

    // 2. Deduct stock by 1
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: product.stock - 1 })
      .eq('id', productId);

    if (updateError) throw new Error("Failed to update stock");

    // 3. Create Escrow Order
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{ product_id: productId, status: 'held_in_escrow' }]);

    if (orderError) throw new Error("Failed to create escrow order");

    // Tell Next.js to refresh the page data
    revalidatePath('/marketplace');
    return { success: true };

  } catch (error: any) {
    return { error: error.message };
  }
}