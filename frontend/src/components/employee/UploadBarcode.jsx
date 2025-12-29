import { BrowserMultiFormatReader } from "@zxing/library";

export default function UploadBarcode({ onDetected }) {
  const reader = new BrowserMultiFormatReader();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = imgURL;

    img.onload = async () => {
      const result = await reader.decodeFromImageElement(img);
      onDetected(result.text);
    };
  };

  return (
    <input
      type="file"
      accept="image/*"
      className="form-control mt-2"
      onChange={handleImage}
    />
  );
}
