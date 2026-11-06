const SUPABASE_URL = "https://ernyuhiiiolirrotpzac.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybnl1aGlpaW9saXJyb3RwemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDA2MzgsImV4cCI6MjEwNDExNjYzOH0.p84ckfmNOqS24ey8jd3yPTjNTlBvktRxcsZmKoiu9es";

// Remove qualquer sessão local simulada anterior para garantir 100% OAuth oficial do Supabase
try {
  localStorage.removeItem('codehelper_sessao_usuario_v2');
} catch {}
