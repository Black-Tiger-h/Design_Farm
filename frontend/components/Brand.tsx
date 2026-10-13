import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Design_Farm 홈">
      <svg
        className="brand-symbol"
        viewBox="0 0 40 44"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 38V18C5 9.7 11.7 3 20 3s15 6.7 15 15v20H5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M13 31V19c0-4 3-7 7-7s7 3 7 7v12H13Z" fill="currentColor" />
        <path
          d="M20 12v19M13 23h14"
          stroke="var(--paper, #fbfaf7)"
          strokeWidth="1.5"
        />
        <path d="M29 40h9" stroke="var(--accent, #b15131)" strokeWidth="3" />
      </svg>
      <span className="brand-word">
        Design<span className="brand-underscore">_</span>Farm
      </span>
    </Link>
  );
}
