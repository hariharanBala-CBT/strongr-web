import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';

import * as localAnimationData from '../css/no-data-animation.json';

const NoDataAnimation = ({ url }) => {
  const [animationData, setAnimationData] = useState(localAnimationData);

  useEffect(() => {
    const fetchAnimationData = async () => {
      if (!localAnimationData) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          setAnimationData(data);
        } catch (error) {
          console.error('Error fetching animation data:', error);
        }
      }
    };

    fetchAnimationData();
  }, [url]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      {animationData ? (
        <Lottie options={defaultOptions} height={300} width={300} />
      ) : (
        <p>Loading animation...</p>
      )}
    </div>
  );
};

export default NoDataAnimation;
