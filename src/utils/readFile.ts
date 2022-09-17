export function readVideoFile(videoFile: File) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(videoFile);
    fileReader.onload = () => resolve(fileReader.result as string);
  });
}
