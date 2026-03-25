const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const detail = document.getElementById("detail");
const smooth = document.getElementById("smooth");
const mode = document.getElementById("mode");

let img = new Image();
let currentSVG = "";

/* =========================
   IMAGE UPLOAD + PREVIEW
========================= */
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

/* =========================
   TRACE FUNCTION
========================= */
document.getElementById("traceBtn").onclick = () => {

  const dataURL = canvas.toDataURL("image/png");

  Potrace.loadImageFromUrl(dataURL, function () {

    // Different modes (like CorelDRAW)
    let params = {};

    if (mode.value === "line") {
      params = {
        turdSize: parseInt(detail.value),
        optTolerance: smooth.value / 10,
        alphaMax: 1
      };
    }

    if (mode.value === "logo") {
      params = {
        turdSize: parseInt(detail.value) + 2,
        optTolerance: smooth.value / 8,
        alphaMax: 0.8
      };
    }

    if (mode.value === "clipart") {
      params = {
        turdSize: parseInt(detail.value),
        optTolerance: smooth.value / 6,
        alphaMax: 1.2
      };
    }

    Potrace.setParameter(params);

    Potrace.process(function () {

      const svg = Potrace.getSVG(1);
      currentSVG = svg;

      showSVG(svg);
    });

  });
};

/* =========================
   SHOW SVG PREVIEW
========================= */
function showSVG(svg) {
  const preview = document.querySelector(".preview-area");

  preview.innerHTML = svg;
}

/* =========================
   EXPORT SVG
========================= */
document.getElementById("exportSVG").onclick = () => {

  if (!currentSVG) {
    alert("Please trace image first!");
    return;
  }

  const blob = new Blob([currentSVG], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "trace.svg";
  a.click();

  URL.revokeObjectURL(url);
};