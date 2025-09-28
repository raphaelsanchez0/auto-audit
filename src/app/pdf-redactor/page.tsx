"use client";

import { useState } from "react";

export default function PdfRedactorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/redact/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError("Failed to process PDF. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-900 text-white p-6">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-100">PDF Redactor</h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 text-black w-full px-3 py-2 rounded border border-red-200"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Processing..." : "Upload & Redact"}
        </button>

        {error && <p className="text-red-300 mt-4">{error}</p>}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="mt-6 inline-block bg-white text-red-700 font-semibold py-2 px-4 rounded hover:bg-red-50 transition"
          >
            Download Redacted PDF
          </a>
        )}
      </div>
    </main>
  );
}
