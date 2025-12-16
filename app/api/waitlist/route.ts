import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    if (!isValidEmail(normalized)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert({ email: normalized });

    // Email already exists → still success
    if (error?.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    if (error) {
      return NextResponse.json({ error: "Could not save email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}