import * as HME from "h264-mp4-encoder";
import { download } from "./download";

type ExportOptions = {
  width: number;
  height: number;
  frameRate: number;
  traverseFrames: (encoder: HME.H264MP4Encoder) => Promise<void>;
};

export const exportVideo = async ({
  width,
  height,
  frameRate,
  traverseFrames,
}: ExportOptions) => {
  const encoder = await HME.createH264MP4Encoder();
  encoder.width = width;
  encoder.height = height;
  encoder.frameRate = frameRate;
  console.log(encoder);
  encoder.initialize();
  await traverseFrames(encoder);
  encoder.finalize();
  const uint8Array = encoder.FS.readFile(encoder.outputFilename);
  console.log("final buffer", uint8Array);
  download(URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" })));
  encoder.delete();
};
