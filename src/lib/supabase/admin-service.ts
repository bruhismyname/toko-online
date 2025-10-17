import { createClient } from "@supabase/supabase-js";

const supabaseurl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseurl, serviceRoleKey);

export default supabaseAdmin