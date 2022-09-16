import { FC, useEffect, useRef, useState } from "react";

// TODO: paint video inside canvas
// TODO: place some content over the video
// TODO: export the video
// TODO: add seek bar

export const CaptionEditor: FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

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
  return (
    <div>
      <h1 className="font-mono text-xl code">Awesome Caption Generator</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files![0])}
      />
      <div className="relative">
        <canvas className="absolute w-full h-full" />
        <video controls ref={videoElRef} />
      </div>
      <button
        className="mt-8"
        onClick={() => {
          if (videoElRef.current) {
            videoElRef.current.play();
          }
        }}
      >
        Play
      </button>
    </div>
  );
};
