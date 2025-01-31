import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import * as HME from "h264-mp4-encoder";
import { AnalyzedVideoData, analyzeVideoFile } from "../utils/analyzeVideo";
import { readVideoFile } from "../utils/readFile";
import { exportVideo } from "../utils/export";

// TODO: add seek bar
export const CaptionEditor: FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const [videoMetaData, setVideoMetaData] = useState<AnalyzedVideoData | null>(
    null
  );

  useEffect(() => {
    if (videoFile) {
      analyzeVideoFile(videoFile).then(setVideoMetaData);
      readVideoFile(videoFile).then((result) => {
        if (!videoElRef.current) throw new Error("videoEl gone");
        videoElRef.current.src = result;
      });
    }
  }, [videoFile]);

  useEffect(() => {
    if (canvasElRef.current && videoElRef.current) {
      videoElRef.current.addEventListener("loadedmetadata", function () {
        if (!(canvasElRef.current && videoElRef.current)) return;
        canvasElRef.current.width = videoElRef.current.videoWidth;
        canvasElRef.current.height = videoElRef.current.videoHeight;
        if (!(canvasElRef.current && videoElRef.current))
          throw new Error("not ready");
        const ctx = canvasElRef.current.getContext("2d");
        if (!ctx) throw new Error("2D context not available");

        function render() {
          if (!(canvasElRef.current && videoElRef.current))
            throw new Error("not ready");
          if (!ctx) throw new Error("2D context not available");
          ctx.drawImage(
            videoElRef.current,
            0,
            0,
            canvasElRef.current.width,
            canvasElRef.current.height
          );
        }
        // some weird work around because it doesn't render at the first time for some reason
        videoElRef.current.currentTime = 0;
        render();
        setTimeout(render, 1000);
      });

      videoElRef.current.addEventListener("play", () => {
        function step() {
          if (!(canvasElRef.current && videoElRef.current)) return;
          const ctx = canvasElRef.current.getContext("2d");
          if (!ctx) throw new Error("2D context not available");
          ctx.drawImage(
            videoElRef.current,
            0,
            0,
            canvasElRef.current.width,
            canvasElRef.current.height
          );
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }, []);

  const onPlay: MouseEventHandler<HTMLButtonElement> = () => {
    if (videoElRef.current) {
      videoElRef.current.play();
    }
  };

  const onExport: MouseEventHandler<HTMLButtonElement> = async () => {
    async function traverseFrames(encoder: HME.H264MP4Encoder) {
      function drawFrame() {
        if (!(canvasElRef.current && videoElRef.current))
          throw new Error("cannot draw frame");
        const ctx = canvasElRef.current.getContext("2d");
        if (!ctx) throw new Error("2D context not available");
        ctx.drawImage(
          videoElRef.current,
          0,
          0,
          canvasElRef.current.width,
          canvasElRef.current.height
        );
      }
      if (!(videoElRef.current && canvasElRef.current))
        throw new Error("cannot traverse frames");
      videoElRef.current.currentTime = 0;
      const ctx = canvasElRef.current.getContext("2d");
      return new Promise<void>((resolve) => {
        function writeFrame() {
          if (!(canvasElRef.current && videoElRef.current && videoMetaData))
            throw new Error("oops");
          if (!ctx) throw new Error("2D context not available");
          drawFrame();
          ctx.fillRect(10, 10, 150, 100);
          encoder.addFrameRgba(
            ctx.getImageData(
              0,
              0,
              canvasElRef.current.width,
              canvasElRef.current.height
            ).data
          );
          console.log("current time:", videoElRef.current.currentTime);
          const frameDuration = 1 / videoMetaData.frameRate;
          videoElRef.current.currentTime += frameDuration;
          if (videoElRef.current.currentTime < videoElRef.current.duration) {
            requestAnimationFrame(writeFrame);
          } else {
            resolve();
          }
        }
        writeFrame();
      });
    }

    await exportVideo({
      width: canvasElRef.current!.width,
      height: canvasElRef.current!.height,
      frameRate: videoMetaData!.frameRate,
      traverseFrames,
    });
  };
  return (
    <div>
      <h1 className="font-mono text-xl code">Awesome Caption Generator</h1>
      <input
        style={{
          display: videoFile ? "none" : "initial",
        }}
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files![0])}
      />
      <div className="relative">
        <canvas ref={canvasElRef} />
        <video className="hidden" controls ref={videoElRef} />
      </div>
      <div>
        <button className="mt-8" onClick={onPlay}>
          Play
        </button>
      </div>
      <div>
        <button className="mt-8" onClick={onExport}>
          Export
        </button>
      </div>
    </div>
  );
};
