'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, RotateCcw } from 'lucide-react';

interface AudioReaderProps {
    text: string;
    className?: string;
}

export default function AudioReader({ text, className = "" }: AudioReaderProps) {
    const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const list = window.speechSynthesis.getVoices();
            setVoices(list);
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Chọn giọng Việt tự nhiên nhất
    const pickBestVietnameseVoice = () => {
        return (
            voices.find(v => v.lang === 'vi-VN' && v.name.includes('Microsoft')) ||
            voices.find(v => v.lang === 'vi-VN' && v.name.includes('Apple')) ||
            voices.find(v => v.lang === 'vi-VN' && v.name.includes('Google')) ||
            voices.find(v => v.lang.startsWith('vi')) ||
            null
        );
    };

    const handlePlay = () => {
        if (status === 'paused') {
            window.speechSynthesis.resume();
            setStatus('playing');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = pickBestVietnameseVoice();

        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        } else {
            utterance.lang = 'vi-VN';
        }

        // Tune cho giọng Việt tự nhiên
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => setStatus('playing');
        utterance.onend = () => setStatus('idle');
        utterance.onerror = () => setStatus('idle');

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setStatus('paused');
    };

    const handleReplay = () => {
        window.speechSynthesis.cancel();
        setStatus('idle');
        setTimeout(handlePlay, 100);
    };

    return (
        <div className={`flex items-center gap-1 bg-blue-50 p-1 rounded-full border border-blue-200 ${className}`}>
            {status === 'idle' ? (
                <button
                    onClick={handlePlay}
                    className="p-2 hover:bg-blue-600 hover:text-white rounded-full text-blue-600 transition-all shadow-sm"
                    title="Nghe thuyết minh"
                >
                    <Volume2 size={16} />
                </button>
            ) : (
                <div className="flex items-center gap-1">
                    {status === 'playing' ? (
                        <button
                            onClick={handlePause}
                            className="p-2 bg-white rounded-full text-orange-600 shadow-sm"
                            title="Tạm dừng"
                        >
                            <Pause size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePlay}
                            className="p-2 bg-white rounded-full text-green-600 shadow-sm"
                            title="Tiếp tục"
                        >
                            <Play size={20} />
                        </button>
                    )}
                    <button
                        onClick={handleReplay}
                        className="p-2 hover:bg-white rounded-full text-gray-400"
                        title="Phát lại"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
