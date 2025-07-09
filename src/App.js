import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './App.css';

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "canvas",
  data: "https://techysaint.com",
  dotsOptions: {
    color: "#000",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#ffffff"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10
  }
});

function App() {
  const [text, setText] = useState("https://techysaint.com");
  const [logoFile, setLogoFile] = useState(null);
  const [qrSize, setQrSize] = useState(300);
  const qrRef = useRef(null);

  useEffect(() => {
    qrCode.update({
      data: text,
      width: qrSize,
      height: qrSize,
    });
    qrCode.append(qrRef.current);
  }, [text, qrSize]);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        qrCode.update({ image: reader.result });
      };
      reader.readAsDataURL(logoFile);
    } else {
      qrCode.update({ image: "" });
    }
  }, [logoFile]);

  const handleDownload = () => {
    qrCode.download({ extension: "png" });
  };

  return (
    <div className="app-container">
      <h1>QR Code Generator with Branding</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter URL or text"
        className="input"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files[0])}
        className="input"
      />
      <div ref={qrRef} className="qr-container"></div>
      <div className="controls">
        <button onClick={() => setQrSize(qrSize + 50)}>Increase Size</button>
        <button onClick={() => setQrSize(Math.max(150, qrSize - 50))}>Decrease Size</button>
        <button onClick={handleDownload}>Download QR Code</button>
      </div>
    </div>
  );
}

export default App;
