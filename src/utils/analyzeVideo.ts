import type { MediaInfo } from "mediainfo.js";

export type AnalyzedVideoData = {
  frameRate: number;
  frameCount: number;
};

export function analyzeVideoFile(videoFile: File) {
  const MediaInfo = (window as any).MediaInfo;
  return new Promise<AnalyzedVideoData>((returnResolve) => {
    MediaInfo({ format: "object" }, async (mediaInfo: MediaInfo) => {
      const getSize = () => videoFile.size;
      const res = await mediaInfo.analyzeData(
        getSize,
        (chunkSize, offset) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.error) {
                reject(event.target.error);
              }
              if (!event.target?.result)
                throw new Error("Something went wrong");
              resolve(new Uint8Array(event.target.result as ArrayBuffer));
            };
            reader.readAsArrayBuffer(
              videoFile.slice(offset, offset + chunkSize)
            );
          })
      );
      if (!res) {
        console.error(res);
        throw new Error("res is weird");
      }
      if (typeof res !== "string") {
        const videoTrack = res.media.track.find(
          (track) => track["@type"] === "Video"
        );
        if (!videoTrack) throw new Error("video track not found");
        console.log("video meta data", videoTrack);
        returnResolve({
          frameCount: Number((videoTrack as any).FrameCount),
          frameRate: Number((videoTrack as any).FrameRate),
        });
      }
    });
  });
}
