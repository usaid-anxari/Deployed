// cropImage.js
export default function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  // This function turns the cropped area into a blob/file for uploading
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = image.naturalWidth / image.width;
      const cropX = crop.x * scale;
      const cropY = crop.y * scale;
      const cropWidth = crop.width * scale;
      const cropHeight = crop.height * scale;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
}
