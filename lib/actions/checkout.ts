"use server";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function processCheckout(cartItems: { productId: string, qty: number }[]) {
  if (!cartItems.length) return { error: "Cart is empty." };

  // 1. Await the cookies() function here
  const cookieStore = await cookies(); 
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        // 2. Now .getAll() will work perfectly
        getAll: () => cookieStore.getAll(), 
        setAll: () => {} 
      } 
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    // 1. Fetch current stock for all items
    const productIds = cartItems.map(item => item.productId);
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, quantity_kg, price_per_kg')
      .in('id', productIds);

    if (prodErr || !products) throw new Error("Failed to fetch products");

    let totalAmount = 0;

    // 2. Validate Stock & Calculate Total
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found.`);
      if (product.quantity_kg < item.qty) {
        throw new Error(`Out of stock! Only ${product.quantity_kg}kg left for an item.`);
      }
      totalAmount += (product.price_per_kg * item.qty);
    }

    // 3. Create Order (Escrow status: pending)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ consumer_id: user.id, total_amount: totalAmount, status: 'pending' })
      .select()
      .single();

    if (orderErr) throw new Error("Order creation failed.");

    // 4. Update Inventory & Insert Order Items
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId)!;
      
      // Decrement stock
      await supabase
        .from('products')
        .update({ quantity_kg: product.quantity_kg - item.qty })
        .eq('id', item.productId);

      // Record order item
      await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.qty,
          price_at_purchase: product.price_per_kg
        });
    }

    return { success: true, orderId: order.id };

  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}