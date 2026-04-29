"use client";
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useRealtimeProducts(initialProducts: any[]) {
  const [products, setProducts] = useState(initialProducts);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const channel = supabase
      .channel('realtime_products')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, 
        (payload) => {
          setProducts((current) => 
            current.map((p) => p.id === payload.new.id ? payload.new : p)
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  return products;
}