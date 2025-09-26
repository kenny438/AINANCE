import React, { useEffect, useState } from 'react';
import BussinLoadingLogoIcon from './icons/BussinLoadingLogoIcon';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  useEffect(() => {
    const taglineTimer = setTimeout(() => setShowTagline(true), 500);
    const authorTimer = setTimeout(() => setShowAuthor(true), 1500);
    const fadeOutTimer = setTimeout(() => setIsFadingOut(true), 2500);
    const finishTimer = setTimeout(onFinished, 3000);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(authorTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="animate-fade-in">
        <BussinLoadingLogoIcon className="w-48 h-48 text-brand-light mb-4" />
      </div>

      <div className="text-center">
        {showTagline && (
          <h2 className="w-[22ch] text-2xl font-light text-brand-light italic animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-brand-light mx-auto">
            Engineering the Future
          </h2>
        )}
        {showAuthor && (
          <p className="text-brand-muted mt-2 animate-fade-in">
            By Dr. Gethmika Dinuja Kumarathunga
          </p>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;