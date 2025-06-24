import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [secureLink, setSecureLink] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSecureLink(""); // Clear previous link when new file is selected
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!file) {
      alert("📂 Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // backend expects 'file' as the key

    try {
      setLoading(true);
      const response = await axios.post(
        "https://secure-file-transfer-1-o6ja.onrender.com/api/files/upload",
        formData
      );

      const link = response.data.accessLink;
      setSecureLink(link);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(
        "❌ Upload failed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Secure File Upload</h2>

      <input type="file" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "📤 Upload"}
      </button>

      <br /><br />

      {secureLink && (
        <div style={{ wordBreak: "break-all" }}>
          <strong>🔒 Secure Link:</strong>
          <p>
            <a
              id="secureLink"
              href={secureLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {secureLink}
            </a>
          </p>
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(secureLink)
                .then(() => alert("✅ Link copied to clipboard"))
                .catch(() => alert("❌ Failed to copy"));
            }}
          >
            📋 Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
