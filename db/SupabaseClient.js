import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.Supabase_Url;
const supabaseKey = process.env.Supabase_Anon_Key;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be defined in your environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
