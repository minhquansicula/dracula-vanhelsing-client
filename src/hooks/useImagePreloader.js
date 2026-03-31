// src/hooks/useImagePreloader.js
import { useState, useEffect } from "react";

const useImagePreloader = (imageList) => {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let imagesLoaded = 0;

    if (!imageList || imageList.length === 0) {
      setImagesPreloaded(true);
      return;
    }

    imageList.forEach((url) => {
      const img = new Image();
      img.src = url;

      // Khi ảnh tải xong hoặc tải lỗi, ta đều tăng biến đếm để không bị kẹt loading
      img.onload = img.onerror = () => {
        if (isCancelled) return;
        imagesLoaded++;
        if (imagesLoaded === imageList.length) {
          setImagesPreloaded(true);
        }
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [imageList]);

  return imagesPreloaded;
};

export default useImagePreloader;
