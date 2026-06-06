import { useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        
        {/* 404 */}
        <h1 className="text-7xl font-bold text-slate-300">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-slate-800">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-600 leading-relaxed">
          Halaman{" "}
          <span className="font-semibold text-slate-800">
            "{pageName}"
          </span>{" "}
          tidak ditemukan.
        </p>

        {/* Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
            />
          </svg>

          Kembali ke Home
        </button>
      </div>
    </div>
  );
}