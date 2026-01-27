/// <reference lib="deno.ns" />
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type InitBody = {
  amount: number; // in kobo
  email: string;
  order_id: string;
  callback_url: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!PAYSTACK_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing PAYSTACK_SECRET_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as InitBody;
    if (!body?.amount || !body?.email || !body?.order_id || !body?.callback_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a unique reference so we can verify later.
    const reference = `order_${body.order_id}_${Date.now()}`;

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        amount: body.amount,
        reference,
        callback_url: body.callback_url,
        metadata: {
          order_id: body.order_id,
        },
      }),
    });

    const initJson = await initRes.json();
    if (!initRes.ok) {
      return new Response(JSON.stringify({ error: initJson?.message || "Paystack init failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authorization_url = initJson?.data?.authorization_url as string | undefined;
    if (!authorization_url) {
      return new Response(JSON.stringify({ error: "Missing authorization_url" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional: store reference on the order if your schema has a column.
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from("orders")
        .update({})
        .eq("id", body.order_id);
    }

    return new Response(JSON.stringify({ authorization_url, reference }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
