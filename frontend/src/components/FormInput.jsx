const FormInput = ({ id, type, label, value, onChange, icon, isPassword = false, onTogglePass, showPass }) => {
  return (
    <div className="relative group/input">
      {/* Sol Taraftaki İkon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-100 group-focus-within/input:text-white transition-colors duration-300 pointer-events-none">
        {icon}
      </div>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="block w-full bg-zinc-900/50 text-white pl-12 pr-12 pt-6 pb-2 rounded-xl border border-white/10 
        focus:bg-zinc-900 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all 
        duration-300 peer placeholder-transparent min-h-[56px] [&:-webkit-autofill]:shadow-[0_0_0_1000px_#18181b_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
        placeholder=" "
        required
      />

      <label
        htmlFor={id}
        className="absolute left-12 transition-all duration-300 pointer-events-none top-2 text-xs text-zinc-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-100 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-white"
      >
        {label}
      </label>

      {/* Şifre Göster/Gizle Butonu */}
      {isPassword && (
        <button
          type="button"
          onClick={onTogglePass}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-100 hover:text-white transition-colors cursor-pointer outline-none"
        >
          {showPass ? (
            // Göz Açık İkonu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            // Göz Kapalı İkonu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default FormInput;