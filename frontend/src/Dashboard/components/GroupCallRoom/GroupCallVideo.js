import React, {useRef, useEffect} from 'react';

const styles = {
  videContainer: {
    width: '300px',
    height: '300px',
  },
  videoElement: {
    widht: '100%',
    height: '100%',
  },
};

const GroupCallVideo = ({stream}) => {
  const videoRef = useRef ();
  useEffect (
    () => {
      const remoteGroupCallVideo = videoRef.current;
      remoteGroupCallVideo.srcObject = stream;

      //for some browwsers autoPlay does not work. So, we handle it below
      remoteGroupCallVideo.onloadmetadata = () => {
        remoteGroupCallVideo.play ();
      };
    },
    [stream]
  );

  return (
    <div style={styles.videContainer}>
      <video ref={videoRef} autoPlay style={styles.videoElement} />
    </div>
  );
};

export default GroupCallVideo;
