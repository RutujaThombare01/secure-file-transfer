import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ViewDocument() {
  const { token } = useParams();
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Build the actual file URL from token
    if (token) {
      setFileUrl(`https://secure-file-transfer-1-o6ja.onrender.com/api/files/access/${token}`);

    }
  }, [token]);

  const handlePrint = () => {
  const printWindow = window.open(fileUrl, '_blank');
  if (printWindow) {
    printWindow.focus();
    // You *can’t* auto-trigger print reliably across origins, so just alert:
    alert("Document opened in a new tab. Press Ctrl+P or ⌘+P to print.");
  } else {
    alert("Popup blocked! Please allow popups and try again.");
  }
};

// const handlePrint = () => {
//   const printWindow = window.open("", "_blank");

//   if (!printWindow) {
//     alert("Popup blocked! Please allow popups for this site.");
//     return;
//   }

//   // HTML inside the new tab
//   const htmlContent = `
//     <html>
//       <head>
//         <title>Secure Document</title>
//         <style>
//           body {
//             margin: 0;
//             padding: 10px;
//             text-align: center;
//             font-family: sans-serif;
//           }
//           img {
//             max-width: 100%;
//             height: auto;
//           }
//           .btn-group {
//             margin-top: 10px;
//           }
//           button {
//             margin: 5px;
//             padding: 10px 20px;
//             font-size: 16px;
//             cursor: pointer;
//           }
//           a {
//             display: inline-block;
//             margin-top: 10px;
//             font-size: 16px;
//             color: blue;
//             text-decoration: underline;
//           }
//         </style>
//       </head>
//       <body>
//         <h2>Secure Document</h2>
//         <img src="${fileUrl}" alt="Document" />
//         <div class="btn-group">
//           <button onclick="window.print()">🖨️ Print</button>
//           <a href="${fileUrl}" download>⬇️ Download</a>
//         </div>
//       </body>
//     </html>
//   `;

//   printWindow.document.open();
//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };








  return (
    <div style={{ padding: "20px" }}>
      <h2>View Document</h2>
      {fileUrl ? (
        <>
          <iframe
            id="doc-frame"
            title="Document Viewer"
            src={fileUrl}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc" }}
          ></iframe>
          <br />
          <button onClick={handlePrint}>🖨️ Print Document</button>
        </>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
  );
}
