"use client";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useState, useRef } from "react";

interface QRCodeScannerProps {
  setScannedResult: (result: string | null) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ setScannedResult }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isCameraOpen) {
      codeReader.current = new BrowserMultiFormatReader();
      codeReader.current
        .decodeFromVideoDevice(null, videoRef.current!, (result) => {
          if (result) {
            setScannedResult(result.getText());
          }
        })
        .catch((err) => {
          console.error("Error scanning QR code:", err);
        });
    } else {
      codeReader.current?.reset();
    }

    return () => {
      codeReader.current?.reset();
    };
  }, [isCameraOpen, setScannedResult]);

  const handleStartScan = () => {
    setIsCameraOpen(true);
  };

  const handleStopScan = () => {
    setIsCameraOpen(false);
    setScannedResult(null);
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md max-w-xs mx-auto">
      <h2 className="text-lg font-semibold mb-2">QR Code Scanner</h2>

      {isCameraOpen ? (
        <div className="relative w-64 h-64 border-2 border-gray-400 rounded-lg">
          <video ref={videoRef} id="video" className="w-full h-full rounded-lg" autoPlay />
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center border-2 border-gray-400 rounded-lg bg-gray-100">
          <p className="text-gray-500">Camera is off</p>
        </div>
      )}

      <div className="mt-4 space-x-2">
        {!isCameraOpen ? (
          <button
            onClick={handleStartScan}
            className="px-4 py-2 bg-[#2D3DFF] text-[#fff] font-bold rounded-lg shadow hover:bg-blue-500"
          >
            Open Camera
          </button>
        ) : (
          <button
            onClick={handleStopScan}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600"
          >
            Close Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
