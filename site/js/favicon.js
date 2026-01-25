export function createNegativeFavicon(id) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://corsproxy.io/?https://drive.google.com/uc?id=${id}`;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = 255 - data.data[i];
            data.data[i+1] = 255 - data.data[i+1];
            data.data[i+2] = 255 - data.data[i+2];
        }
        ctx.putImageData(data, 0, 0);
        document.getElementById('favicon').href = canvas.toDataURL();
    };
}
