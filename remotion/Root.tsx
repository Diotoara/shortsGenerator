import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';
import React from 'react';
import {Composition} from 'remotion';
 
const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          script: '', // Provide a suitable default for 'script'
          imageUrls: [], // Provide a suitable default for 'imageUrls'
          audioUrl: '', // Provide a suitable default for 'audioUrl'
          caption: '', // Provide a suitable default for 'caption'
          setDurationinFrame: () => {}, // Provide a suitable default for 'setDurationinFrame'
        }}
      />
    </>
  );
};

export default RemotionRoot