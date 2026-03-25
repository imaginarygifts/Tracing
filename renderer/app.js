const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let currentSVG = "";

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
  const dataURL = canvas.toDataURL("image/png");

  Potrace.loadImageFromUrl(dataURL, function() {

    // SETTINGS (like Corel sliders)
    Potrace.setParameter({
      turdSize: 2,        // remove noise
      optTolerance: 0.4,  // smoothness
      alphaMax: 1         // corner sharpness
    });

    Potrace.process(function() {
      const svg = Potrace.getSVG(1);

      currentSVG = svg;

      // Show SVG preview
      document.querySelector(".panel:nth-child(2)").innerHTML =
        "<h2>Preview</h2>" + svg +
        '<button id="exportSVG">Export SVG</button>';

      bindExport();
    });

  });
};