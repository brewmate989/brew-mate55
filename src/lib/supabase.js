import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://egahsyfqhiinexebcooe.supabase.co";
const SUPABASE_KEY = "sb_publishable_S2PTRsZ7e8YJmEi7jy9jfg_-F0iOBb7";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
 