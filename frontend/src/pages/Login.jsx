import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput"; 

// Resimler
import back1Image from '../assets/images/back1.png';
import back2Image from '../assets/images/back2.png';
import back3Image from '../assets/images/back3.png';
import back4Image from '../assets/images/back4.png';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Arka plan URL'leri
  const row1Url = `url('${back1Image}')`;
  const row2Url = `url('${back2Image}')`;
  const row3Url = `url('${back3Image}')`;
  const row4Url = `url('${back4Image}')`;

  // İkonlar (SVG'leri burada tanımlayarak JSX'i temiz tutuyoruz)
  const UserIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = isRegister
        ? await register(form.name, form.email, form.password)
        : await login(form.email, form.password);

      if (res.success) nav("/");
      else setErr(res.message);
    } catch (error) {
      setErr("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen font-sans overflow-hidden bg-[#0a0310]">
      
      {/* 1. ARKA PLAN (Animasyonlar index.css dosyasından geliyor) */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[200%] h-[25%] flex animate-scroll-left opacity-60">
          <div className="movie-bg-image" style={{ backgroundImage: row1Url }}></div>
          <div className="movie-bg-image" style={{ backgroundImage: row1Url }}></div>
        </div>
        <div className="absolute top-[25%] left-0 w-[200%] h-[25%] flex animate-scroll-right opacity-60">
          <div className="movie-bg-image" style={{ backgroundImage: row2Url }}></div>
          <div className="movie-bg-image" style={{ backgroundImage: row2Url }}></div>
        </div>
        <div className="absolute top-[50%] left-0 w-[200%] h-[25%] flex animate-scroll-left opacity-60">
          <div className="movie-bg-image" style={{ backgroundImage: row3Url }}></div>
          <div className="movie-bg-image" style={{ backgroundImage: row3Url }}></div>
        </div>
        <div className="absolute top-[75%] left-0 w-[200%] h-[25%] flex animate-scroll-right opacity-60">
          <div className="movie-bg-image" style={{ backgroundImage: row4Url }}></div>
          <div className="movie-bg-image" style={{ backgroundImage: row4Url }}></div>
        </div>
      </div>

      {/* --- KARANLIK FİLTRE  --- */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none"></div>

      {/* 2. FORM KUTUSU */}
      <div className="relative z-30 flex items-center justify-center h-full px-4">
        <div className={`w-full max-w-[450px] bg-black/70 p-8 md:p-12 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden group flex flex-col justify-center transition-all duration-500 ease-in-out ${isRegister ? "min-h-[600px]" : "min-h-[480px]"}`}>
          
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/10 transition-all duration-700"></div>

          <h2 className="text-3xl font-bold text-white mb-8 text-left relative z-10">
            {isRegister ? "Sign Up" : "Log In"}
          </h2>

          {err && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 font-medium flex items-center gap-2 animate-pulse">
              ⚠ {err}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-5 relative z-10">
            
            {/* Ad Soyad Input  */}
            {isRegister && (
              <FormInput
                id="name"
                type="text"
                label="Name - Surname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon={UserIcon}
              />
            )}

            {/* Email Input */}
            <FormInput
              id="email"
              type="email"
              label="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={MailIcon}
            />

            {/* Şifre Input */}
            <FormInput
              id="password"
              type={showPass ? "text" : "password"}
              label="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={LockIcon}
              isPassword={true}
              showPass={showPass}
              onTogglePass={() => setShowPass(!showPass)}
            />

            {/* Submit Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400
               text-white font-extrabold tracking-wide text-lg py-4 rounded-xl mt-4 shadow-[0_4px_14px_0_rgba(192,38,211,0.35)]
                hover:shadow-[0_6px_20px_rgba(219,39,119,0.3)] drop-shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Loading.." : (isRegister ? "Sign Up" : "Log In")}
            </button>
          </form>

          {/* Giriş/Kayıt Arası Geçiş */}
          <div className="mt-8 pt-6 border-t border-pink-500/20 text-center text-gray-400">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErr("");
              }}
              className="text-pink-400 hover:text-pink-300 font-semibold ml-1 transition-colors hover:underline"
            >
              {isRegister ? "Log In" : "Sign Up"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}