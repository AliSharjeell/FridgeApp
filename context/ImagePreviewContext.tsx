import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ImagePreviewContextType {
    previewImage: string | null;
    setPreviewImage: (image: string | null) => void;
}

const ImagePreviewContext = createContext<ImagePreviewContextType | undefined>(undefined);

export function ImagePreviewProvider({ children }: { children: ReactNode }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    return (
        <ImagePreviewContext.Provider value={{ previewImage, setPreviewImage }}>
            {children}
        </ImagePreviewContext.Provider>
    );
}

export function useImagePreview() {
    const context = useContext(ImagePreviewContext);
    if (context === undefined) {
        throw new Error('useImagePreview must be used within an ImagePreviewProvider');
    }
    return context;
}
