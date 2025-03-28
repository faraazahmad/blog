interface VideoPlayerProps {
  src: string;
  width?: string;
  height?: string;
}

export default function VideoPlayer({ src, width = "640", height = "360" }: VideoPlayerProps) {
  return (
    <video controls width={width} height={height}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
