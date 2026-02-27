import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const hasServiceKey = !!serviceKey && serviceKey.length > 50;

const adminClient = hasServiceKey
  ? createClient(url, serviceKey!, { auth: { persistSession: false } })
  : null;

const anonClient = createClient(url, anonKey, { auth: { persistSession: false } });

type TestUser = {
  email: string;
  password: string;
  role: "admin" | "host" | "viewer";
  edu_verified: boolean;
};

const USERS: TestUser[] = [
  { email: "admin@leaseu.app", password: "Admin123!", role: "admin", edu_verified: true },
  { email: "student@fsu.edu", password: "Student123!", role: "host", edu_verified: true },
  { email: "viewer@gmail.com", password: "Viewer123!", role: "viewer", edu_verified: false },
];

async function ensureUserAdmin(u: TestUser): Promise<string> {
  const created = await adminClient!.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
  });

  if (!created.error && created.data.user?.id) return created.data.user.id;

  const { data } = await adminClient!.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const match = data?.users?.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());
  if (!match) {
    throw new Error(`Could not create or find ${u.email}: ${created.error?.message}`);
  }

  await adminClient!.auth.admin.updateUserById(match.id, {
    password: u.password,
    email_confirm: true,
  });

  return match.id;
}

async function ensureUserAnon(u: TestUser): Promise<string | null> {
  const { data: signUpData, error: signUpErr } = await anonClient.auth.signUp({
    email: u.email,
    password: u.password,
  });

  if (signUpData?.user?.id && !signUpErr) {
    console.log(`  Created ${u.email} via signUp`);
    return signUpData.user.id;
  }

  if (signUpErr?.message?.includes("already registered")) {
    const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
      email: u.email,
      password: u.password,
    });

    if (signInData?.user?.id) {
      console.log(`  Found existing ${u.email}`);
      await anonClient.auth.signOut();
      return signInData.user.id;
    }

    if (signInErr) {
      console.log(`  ${u.email}: exists but can't sign in (${signInErr.message}). Try fixing the service role key.`);
      return null;
    }
  }

  if (signUpErr) {
    console.log(`  ${u.email}: signUp failed (${signUpErr.message})`);
    return null;
  }

  return signUpData?.user?.id ?? null;
}

async function upsertProfile(client: typeof adminClient | typeof anonClient, userId: string, u: TestUser) {
  const c = client ?? anonClient;
  const { error } = await c.from("profiles").upsert({
    id: userId,
    email: u.email,
    role: u.role,
    email_verified: true,
    edu_verified: u.edu_verified,
  });
  if (error) {
    console.log(`  Profile upsert for ${u.email}: ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  console.log(`\nLeaseU Test User Setup`);
  console.log(`Mode: ${hasServiceKey ? "SERVICE ROLE (full admin)" : "ANON KEY (limited — fix service role key for full setup)"}\n`);

  let allOk = true;

  for (const u of USERS) {
    let userId: string | null = null;

    if (adminClient) {
      try {
        userId = await ensureUserAdmin(u);
      } catch (e: any) {
        console.log(`  Admin API failed for ${u.email}: ${e.message}`);
        console.log(`  Falling back to anon signUp...`);
        userId = await ensureUserAnon(u);
      }
    } else {
      userId = await ensureUserAnon(u);
    }

    if (!userId) {
      console.log(`❌ SKIP: ${u.email} — could not create or find user`);
      allOk = false;
      continue;
    }

    const profileOk = await upsertProfile(adminClient, userId, u);
    if (profileOk) {
      console.log(`✅ Ready: ${u.email} / ${u.password} (role=${u.role})`);
    } else {
      console.log(`⚠️  User ${u.email} exists but profile upsert failed (RLS). Need service role key.`);
      allOk = false;
    }
  }

  console.log(`\n${allOk ? "SUCCESS" : "PARTIAL"} — Login credentials:`);
  console.log("  admin@leaseu.app / Admin123!");
  console.log("  student@fsu.edu  / Student123!");
  console.log("  viewer@gmail.com / Viewer123!");

  if (!hasServiceKey) {
    console.log("\n⚠️  Service role key missing or invalid.");
    console.log("   Get it from: Supabase Dashboard → Settings → API → service_role key");
    console.log("   Paste into .env as SUPABASE_SERVICE_ROLE_KEY=eyJ...");
    console.log("   Then re-run: npm run seed:users");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
