import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";

// TODO: place some content over the video
// TODO: export the video
// TODO: add seek bar

export const CaptionEditor: FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoFile && videoElRef.current) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(videoFile);
      fileReader.onload = () => {
        if (!videoElRef.current) throw new Error("videoEl gone");
        videoElRef.current.src = fileReader.result as string;
      };
    }
  }, [videoFile]);

  useEffect(() => {
    if (canvasElRef.current && videoElRef.current) {
      videoElRef.current.addEventListener("loadedmetadata", function () {
        if (!(canvasElRef.current && videoElRef.current)) return;
        canvasElRef.current.width = videoElRef.current.videoWidth;
        canvasElRef.current.height = videoElRef.current.videoHeight;
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
      <button className="mt-8" onClick={onPlay}>
        Play
      </button>
    </div>
  );
};
