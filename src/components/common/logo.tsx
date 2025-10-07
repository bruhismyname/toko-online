import Link from "next/link";

type LogoProps = {
  className?: string;
  showText?: boolean;
};

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-10 w-10">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <circle cx="50" cy="50" r="45" fill="#000000" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x="50"
            y="42"
            fontSize="12"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
          >
            BAKUL
          </text>
          <text
            x="50"
            y="58"
            fontSize="18"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
          >
            ★
          </text>
          <text
            x="50"
            y="72"
            fontSize="12"
            textAnchor="middle"
            fill="#ffffff"
            fontWeight="bold"
          >
            CONV.
          </text>
        </svg>
      </div>
      {showText && <span className="font-bold text-lg">Bakul Converse</span>}
    </Link>
  );
};

export default Logo;