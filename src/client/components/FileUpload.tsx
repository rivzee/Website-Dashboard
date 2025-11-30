'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    X,
    File,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Archive,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface UploadedFile {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'success' | 'error';
    preview?: string;
}

interface FileUploadProps {
    accept?: string;
    maxSize?: number; // in MB
    multiple?: boolean;
    onUpload?: (files: File[]) => Promise<void>;
}

export default function FileUpload({
    accept = '*',
    maxSize = 10,
    multiple = true,
    onUpload
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (file: File) => {
        const type = file.type;
        if (type.startsWith('image/')) return <ImageIcon size={24} />;
        if (type.startsWith('video/')) return <Video size={24} />;
        if (type.startsWith('audio/')) return <Music size={24} />;
        if (type.includes('pdf')) return <FileText size={24} />;
        if (type.includes('zip') || type.includes('rar')) return <Archive size={24} />;
        return <File size={24} />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFiles = async (fileList: FileList) => {
        const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            progress: 0,
            status: 'uploading' as const,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Simulate upload progress
        for (const uploadedFile of newFiles) {
            // Check file size
            if (uploadedFile.file.size > maxSize * 1024 * 1024) {
                setFiles(prev =>
                    prev.map(f =>
                        f.id === uploadedFile.id ? { ...f, status: 'error' as const } : f
                    )
                );
                continue;
            }

            // Simulate upload
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setFiles(prev =>
                    prev.map(f =>
                        f.id === uploadedFile.id ? { ...f, progress } : f
                    )
                );
            }

            setFiles(prev =>
                prev.map(f =>
                    f.id === uploadedFile.id ? { ...f, status: 'success' as const } : f
                )
            );
        }

        // Call onUpload callback
        if (onUpload) {
            await onUpload(newFiles.map(f => f.file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <Upload className="text-blue-600 dark:text-blue-400" size={32} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Drop files here or click to upload
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {accept === '*' ? 'Any file type' : accept} • Max {maxSize}MB
                    </p>

                    <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                        Choose Files
                    </button>
                </div>
            </div>

            {/* Uploaded Files List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-2"
                    >
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Uploaded Files ({files.length})
                        </h4>

                        {files.map((uploadedFile) => (
                            <motion.div
                                key={uploadedFile.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Preview/Icon */}
                                    <div className="flex-shrink-0">
                                        {uploadedFile.preview ? (
                                            <img
                                                src={uploadedFile.preview}
                                                alt={uploadedFile.file.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400">
                                                {getFileIcon(uploadedFile.file)}
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {uploadedFile.file.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatFileSize(uploadedFile.file.size)}
                                        </p>

                                        {/* Progress Bar */}
                                        {uploadedFile.status === 'uploading' && (
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadedFile.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {uploadedFile.progress}%
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Icon */}
                                    <div className="flex-shrink-0">
                                        {uploadedFile.status === 'uploading' && (
                                            <Loader2 className="text-blue-600 animate-spin" size={20} />
                                        )}
                                        {uploadedFile.status === 'success' && (
                                            <CheckCircle className="text-green-600" size={20} />
                                        )}
                                        {uploadedFile.status === 'error' && (
                                            <AlertCircle className="text-red-600" size={20} />
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFile(uploadedFile.id)}
                                        className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="text-gray-500" />
                                    </button>
                                </div>

                                {uploadedFile.status === 'error' && (
                                    <p className="text-sm text-red-600 mt-2">
                                        File size exceeds {maxSize}MB limit
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
