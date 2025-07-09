import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

// Available fonts
const availableFonts = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Raleway",
  "Merriweather"
];

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "canvas",
  data: "https://techysaint.com",
  dotsOptions: { color: "#000", type: "rounded" },
  backgroundOptions: { color: "#ffffff" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
});

function App() {
  const [text, setText] = useState("https://techysaint.com");
  const [logoFile, setLogoFile] = useState(null);
  const [downloadSize, setDownloadSize] = useState(1200);
  const [brandingText, setBrandingText] = useState("Powered by TechySaint");
  const [brandingFont, setBrandingFont] = useState("Roboto");
  const [brandingFontSize, setBrandingFontSize] = useState(40);
  const qrRef = useRef(null);

  // Load selected Google Font dynamically
  useEffect(() => {
    const linkId = "dynamic-google-font";
    let link = document.getElementById(linkId);
    if (link) link.remove();

    link = document.createElement("link");
    link.id = linkId;
    link.href = `https://fonts.googleapis.com/css2?family=${brandingFont.replace(/ /g, '+')}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [brandingFont]);

  useEffect(() => {
    qrCode.update({ data: text, width: 300, height: 300 });
    qrRef.current.innerHTML = "";
    qrCode.append(qrRef.current);
  }, [text]);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => qrCode.update({ image: reader.result });
      reader.readAsDataURL(logoFile);
    } else {
      qrCode.update({ image: "" });
    }
  }, [logoFile]);

  const handleDownload = async () => {
    const finalSize = downloadSize;
    const tempQr = new QRCodeStyling({
      width: finalSize,
      height: finalSize,
      type: "canvas",
      data: text,
      dotsOptions: { color: "#000", type: "rounded" },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
    });

    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => tempQr.update({ image: reader.result });
      reader.readAsDataURL(logoFile);
    }

    const canvas = document.createElement("canvas");
    const brandingHeight = finalSize * 0.1;
    canvas.width = finalSize;
    canvas.height = finalSize + brandingHeight;
    const ctx = canvas.getContext("2d");

    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);
    await tempQr.append(tempDiv);

    setTimeout(() => {
      const qrCanvas = tempDiv.querySelector("canvas");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qrCanvas, 0, 0, finalSize, finalSize);

      ctx.fillStyle = "#000000";
      ctx.font = `${brandingFontSize}px '${brandingFont}', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(brandingText, canvas.width / 2, finalSize + brandingHeight / 2);

      const link = document.createElement("a");
      link.download = "branded-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(tempDiv);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">QR Code Generator with Branding</h1>
        
        {/* URL/Text Input */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Enter URL or Text for QR Code:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., https://techysaint.com"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Upload a Logo (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Branding Text */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Enter Custom Branding Text (optional):</label>
          <input
            type="text"
            value={brandingText}
            onChange={(e) => setBrandingText(e.target.value)}
            placeholder="e.g., Powered by TechySaint"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Font Selection */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Select Font for Branding Text:</label>
          <select
            value={brandingFont}
            onChange={(e) => setBrandingFont(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableFonts.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Branding Font Size: {brandingFontSize}px</label>
          <input
            type="range"
            min="20"
            max="100"
            step="2"
            value={brandingFontSize}
            onChange={(e) => setBrandingFontSize(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        {/* QR Preview */}
        <div ref={qrRef} className="flex justify-center"></div>
        <p
  className="text-center text-gray-600"
  style={{
    fontFamily: `'${brandingFont}', sans-serif`,
    fontSize: `${brandingFontSize}px`
  }}
>
  {brandingText}
</p>


        {/* Download Size */}
        <div className="space-y-1">
          <label className="block text-gray-700 font-medium">Download Image Size: {downloadSize}px</label>
          <input
            type="range"
            min="600"
            max="4200"
            step="300"
            value={downloadSize}
            onChange={(e) => setDownloadSize(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Download QR Code with Branding
        </button>
      </div>
    </div>
  );
}

export default App;
