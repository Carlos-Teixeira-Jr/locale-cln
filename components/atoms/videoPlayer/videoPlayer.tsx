import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

interface VideoPlayerProps {
  videoUrl: string; // URL do vídeo no formato "https://www.youtube.com/watch?v=SEU_VIDEO_ID"
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {

  const isMobile = useIsMobile()

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
      {isMobile !== undefined && (
        <iframe
          width="100%"
          height={isMobile ? '250' : '600'}
          src={embedCode}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;

