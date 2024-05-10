import React from 'react';

interface VideoPlayerProps {
  videoUrl: string; // URL do vídeo no formato "https://www.youtube.com/watch?v=SEU_VIDEO_ID"
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {

  // Função para extrair o ID do vídeo a partir do URL
  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/)([^&/?#]+)/i);
    return match && match[1] ? match[1] : '';
  };

  // Extrair o ID do vídeo a partir do URL
  const videoId = extractVideoId(videoUrl);

  // Construir o código de incorporação iframe
  const embedCode = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-container">
      {/* Use o código de incorporação iframe gerado a partir do ID do vídeo */}
      <iframe
        width="1000"
        height="600"
        src={embedCode}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;

