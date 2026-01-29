'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Scan, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface QRScannerProps {
    onScan: (result: string) => void;
    onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReader = useRef<BrowserMultiFormatReader | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        codeReader.current = new BrowserMultiFormatReader();

        // Slight delay to ensure video element is mounted and animation has started
        const timer = setTimeout(() => {
            if (videoRef.current) {
                codeReader.current
                    ?.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                        if (result) {
                            onScan(result.getText());
                            // Optional: vibration feedback if supported
                            if (navigator.vibrate) navigator.vibrate(200);
                        }
                        // Ignore errors as they happen on every frame without a code
                    })
                    .catch((err) => {
                        console.error('Camera access error:', err);
                        setError('Could not access camera. Please ensure permissions are granted.');
                    });
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            codeReader.current?.reset();
        };
    }, [onScan]);

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Darkened corners */}
                <div className="absolute inset-0 bg-black/30 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* Scanner Guide Frame */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                    {/* Animated Scanner Line */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                    />

                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                </div>

                {/* Text Hint */}
                <div className="absolute bottom-12 left-0 right-0 text-center">
                    <p className="text-white font-medium text-sm tracking-wide px-4 py-2 bg-black/50 backdrop-blur-md rounded-full inline-block">
                        Align QR Code within the frame
                    </p>
                </div>
            </div>

            {onClose && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:bg-black/40 z-20 rounded-full w-10 h-10"
                >
                    <X className="w-6 h-6" />
                </Button>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-6 z-30">
                    <div className="text-center text-red-500">
                        <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
