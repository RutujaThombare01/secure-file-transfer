import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [secureLink, setSecureLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file) return alert("Please select a file first.");

  const formData = new FormData();
  formData.append("file", file); // key must be "file"

  try {
    const response = await axios.post("http://localhost:5000/api/files/upload", formData);
    const link = response.data.accessLink;
    setSecureLink(link);
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed: " + (error?.response?.data || error.message));
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Secure File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>
      <br /><br />
      {secureLink && (
  <div>
    <strong>Secure Link:</strong>
    <p>
      <a id="secureLink" href={secureLink} target="_blank" rel="noopener noreferrer">
        {secureLink}
      </a>
    </p>
    <button onClick={() => {
      navigator.clipboard.writeText(secureLink)
        .then(() => alert("✅ Link copied to clipboard"))
        .catch(() => alert("❌ Failed to copy"));
    }}>📋 Copy Link</button>
  </div>
)}

    </div>
  );
}
