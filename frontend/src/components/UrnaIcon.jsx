export default function UrnaIcon({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradientes Oficiais das Cores do Brasil */}
        <linearGradient id="br-green-icon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00A83E" />
          <stop offset="100%" stopColor="#007F2E" />
        </linearGradient>

        <linearGradient id="br-yellow-icon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEB3B" />
          <stop offset="100%" stopColor="#FBC02D" />
        </linearGradient>

        <linearGradient id="br-blue-icon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00358E" />
          <stop offset="100%" stopColor="#001F5C" />
        </linearGradient>

        <linearGradient id="urna-tampa-icon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00B845" />
          <stop offset="100%" stopColor="#009B3A" />
        </linearGradient>
      </defs>

      {/* Corpo Principal da Urna (Verde Bandeira) */}
      <rect x="76" y="210" width="360" height="250" rx="28" fill="url(#br-green-icon)" stroke="#005C20" strokeWidth="4" />

      {/* Base Inferior de Apoio */}
      <rect x="60" y="440" width="392" height="24" rx="12" fill="#006624" />

      {/* Emblema Central Estilizado (Losango Amarelo e Círculo Azul da Bandeira) */}
      <g transform="translate(256, 335)">
        <polygon points="0,-48 68,0 0,48 -68,0" fill="url(#br-yellow-icon)" stroke="#D4A000" strokeWidth="2" />
        <circle cx="0" cy="0" r="28" fill="url(#br-blue-icon)" stroke="#001844" strokeWidth="2" />
        <path d="M-27,-6 Q0,10 27,2" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Tampa Superior da Urna */}
      <path d="M 52 220 L 96 156 L 416 156 L 460 220 Z" fill="url(#urna-tampa-icon)" stroke="#005C20" strokeWidth="4" strokeLinejoin="round" />

      {/* Friso de Borda da Tampa */}
      <rect x="44" y="212" width="424" height="18" rx="9" fill="#00802B" />

      {/* Ranhura / Fenda de Inserção do Voto */}
      <rect x="156" y="172" width="200" height="18" rx="9" fill="url(#br-blue-icon)" stroke="#001A4E" strokeWidth="2" />

      {/* Cédula de Votação Entrando na Urna */}
      <g transform="rotate(-6, 256, 120)">
        <rect x="178" y="44" width="156" height="140" rx="12" fill="url(#br-yellow-icon)" stroke="#D4A000" strokeWidth="3" />
        <rect x="194" y="60" width="124" height="12" rx="4" fill="#E5A600" opacity="0.8" />
        <rect x="194" y="82" width="76" height="8" rx="3" fill="#00358E" opacity="0.6" />
        <rect x="194" y="98" width="60" height="8" rx="3" fill="#00358E" opacity="0.6" />

        {/* Checkbox com confirmação */}
        <rect x="286" y="82" width="28" height="28" rx="6" fill="#00358E" />
        <path d="M 292 95 L 298 102 L 308 89" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Faixa Verde Decorativa */}
        <rect x="178" y="172" width="156" height="12" rx="4" fill="#009B3A" />
      </g>
    </svg>
  );
}
