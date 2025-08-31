import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Healthcare System
      </h1>
      <p className="text-gray-600 mb-6">
        Book appointments, access records, and manage healthcare easily.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
