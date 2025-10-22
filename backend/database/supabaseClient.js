
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://gcislnfhcvbrrridmbji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaXNsbmZoY3ZicnJyaWRtYmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjY3NTAsImV4cCI6MjA3NjcwMjc1MH0.Lka7SjcfQupJBijhVsdPk5nGIYHnKbAqDKhMk8cJfc4";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
