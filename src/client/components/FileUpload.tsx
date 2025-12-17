'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    type?: 'payment' | 'document';
    maxSizeMB?: number;
    accept?: string;
    currentFile?: string;
}

export default function FileUpload({
    onUploadSuccess,
    type = 'payment',
    maxSizeMB = 5,
    accept = 'image/jpeg,image/png,image/jpg,application/pdf',
    currentFile,
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(currentFile || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setError(`File terlalu besar. Maksimal ${maxSizeMB}MB`);
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUploadSuccess(response.data.url);
            setPreview(response.data.url);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Gagal upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {!preview && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                    <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-700 dark:text-gray-300 mb-1">
                        Click untuk upload file
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, PNG, atau PDF (Max {maxSizeMB}MB)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}

            {/* Preview */}
            {preview && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative border border-gray-300 dark:border-gray-600 rounded-xl p-4"
                >
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition z-10"
                    >
                        <X size={16} />
                    </button>

                    {preview.startsWith('data:') || preview.match(/\.(jpg|jpeg|png)$/i) ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-contain rounded-lg"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="text-center">
                                <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                                <p className="text-gray-700 dark:text-gray-300">File uploaded</p>
                                <p className="text-sm text-gray-500">{file?.name}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Upload Button */}
            {file && !preview?.startsWith('/uploads') && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            Upload File
                        </>
                    )}
                </button>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
}
