const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

document.getElementById("traceBtn").onclick = () => {
  // Simple B/W conversion (placeholder for tracing)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    const val = avg > 128 ? 255 : 0;
    data[i] = data[i+1] = data[i+2] = val;
  }

  ctx.putImageData(imageData, 0, 0);
};