<script>
  import Quagga from "@ericblade/quagga2";
  import { onMount, onDestroy } from "svelte";

  let videoContainer;
  let started = false;
  export let onDetected = (code) => console.log("Barcode detected:", code);
  export let onError = (err) => console.error("Quagga error:", err);

  let lastCode = null;

  function isValidIsbn(code) {
    if (
      code &&
      code.length === 13 &&
      (`${code}`.startsWith("978") || `${code}`.startsWith("979"))
    ) {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(code[i]);
        sum += i % 2 === 0 ? digit : digit * 3;
      }
      let checkDigit = 10 - (sum % 10);
      if (checkDigit === 10) {
        checkDigit = 0;
      }

      return checkDigit === parseInt(code[12]);
    }
    return false;
  }

  const startScanner = async () => {
    try {
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoContainer,
          constraints: {
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
          area: {
            top: "20%",
            right: "10%",
            left: "10%",
            bottom: "20%",
          },
        },
        decoder: {
          locate: true,
          multiple: false,
          numOfWorkers: 4,
          readers: ["ean_reader"],
        },
      });

      Quagga.start();
      started = true;

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (code !== lastCode) {
          lastCode = code;
          if (isValidIsbn(code)) {
            onDetected(code);
            Quagga.stop();
          }
        }
      });

      Quagga.onProcessed((result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width")),
              parseInt(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter((box) => box !== result.box)
              .forEach((box) => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2,
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2,
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              {
                color: "red",
                lineWidth: 3,
              }
            );
          }
        }
      });
    } catch (err) {
      onError(err);
    }
  };

  onMount(() => {
    startScanner();
  });

  onDestroy(() => {
    if (started) {
      Quagga.stop();
    }
  });
</script>

<div bind:this={videoContainer} class="relative">
  <div class="absolute">
    {#if !started}
      <p>Starting camera...</p>
    {/if}
  </div>
</div>

<style>
  :global(video),
  :global(canvas) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  :global(canvas.drawingBuffer) {
    position: absolute;
    left: 0;
    top: 0;
  }

  .relative {
    height: 100vh;
    left: 0;
    position: relative;
    top: 0;
    width: 100vw;
  }
  .absolute {
    left: 0;
    position: absolute;
    top: 0;
  }
</style>
