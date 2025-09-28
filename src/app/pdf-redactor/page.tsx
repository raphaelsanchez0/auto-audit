"use client";

import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/ui/navbar";
import { useEffect, useRef, useState } from "react";

export default function PdfRedactorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState("Choose file (no file chosen)");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Clean up blob URL when replaced/unmounted
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
    <div className="h-screen w-screen min-h-screen flex flex-col bg-neutral-100 text-white overflow-hidden">
      <div className="page">
        <Navbar />
        <main className="p-6 pb-20 ">
          <h2 className="text-2xl font-semibold"></h2>
        </main>
      </div>

      <main className="min-h-screen flex flex-col items-center justify-top">
        <div className="bg-white/10 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6 text-neutral-800">PDF Redactor</h1>

          <div className="mb-4 w-full">
            {/* Use label to trigger the hidden input; no manual click */}
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
                  // Allow picking the *same* file again:
                  // e.currentTarget.value = "";
                }}
              />
              <div className="cursor-pointer text-center text-black w-full px-3 py-2 rounded border border-neutral-800 bg-white">
                {fileLabel}
              </div>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Redact"}
          </button>

          {error && <p className="text text-neutral-800 mt-4">{error}</p>}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="mt-6 inline-block bg-white font-semibold py-2 px-4 rounded hover:bg-red-50 transition text-neutral-800"
            >
              Download Redacted PDF
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
