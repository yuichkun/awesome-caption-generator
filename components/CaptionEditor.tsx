import { FC, useState } from "react";

// TODO: show video
// TODO: paint video inside canvas
// TODO: place some content over the video
// TODO: export the video
// TODO: add seek bar

export const CaptionEditor: FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  return (
    <div>
      <h1 className="font-mono text-xl code">Awesome Caption Generator</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
    </div>
  );
};
