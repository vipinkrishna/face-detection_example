const screen = document.getElementById("screen");

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models")]).then(
  startCamera
);

function startCamera() {
  navigator.getUserMedia(
    { video: { width: 720, height: 480 } },
    stream => (screen.srcObject = stream),
    err => console.error(err)
  );
}

screen.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(screen);
  document.body.append(canvas);
  const displaySize = { width: screen.width, height: screen.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      screen,
      new faceapi.TinyFaceDetectorOptions()
    );

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100);
});
