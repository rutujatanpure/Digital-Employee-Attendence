import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScanner({ onDetected }) {
  const [error, setError] = useState("");

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <BarcodeScannerComponent
        width={300}
        height={200}
        onUpdate={(err, result) => {
          if (result) {
            onDetected(result.text); 
          }
          if (err) setError("Camera access error");
        }}
      />
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
