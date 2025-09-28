"use client";

import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/ui/navbar";
import { useEffect, useState } from "react";

export default function PdfRedactorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState("Choose file (no file chosen)");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

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

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process PDF. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 hover:shadow-[0_0_30px_rgba(248,113,113,0.3)] transition-all">
          <h1 className="text-3xl font-bold mb-2 text-rose-600">PDF Redactor</h1>

          <p className="text-gray-700 mb-6">
            Upload your PDF and automatically redact sensitive information in seconds.
          </p>

          <div className="mb-4 w-full">
            <label htmlFor="file-upload" className="block">
              <Input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setFileLabel(f ? f.name : "Choose file (no file chosen)");
                }}
              />
              <div className="cursor-pointer text-center text-black w-full px-3 py-2 rounded border border-gray-300 bg-white hover:bg-rose-50 transition">
                {fileLabel}
              </div>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Upload & Redact"}
          </button>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="mt-6 inline-block bg-white font-semibold py-2 px-4 rounded hover:bg-rose-100 transition text-neutral-800 shadow hover:shadow-md"
            >
              Download Redacted PDF
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
