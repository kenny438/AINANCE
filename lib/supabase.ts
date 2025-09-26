import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vddbnyjiycjtevhzodxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGJueWppeWNqdGV2aHpvZHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDQ0NzQsImV4cCI6MjA3MzY4MDQ3NH0.o8X6S6ETmjypargtw3KQNm4mclRGV2g1ynCbT5agJb0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
