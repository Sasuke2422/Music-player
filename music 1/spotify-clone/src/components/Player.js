import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faPause, faStepForward, faStepBackward, 
  faRandom, faRedo, faVolumeUp, faVolumeMute
} from '@fortawesome/free-solid-svg-icons';

const Player = ({ 
  currentSong, 
  isPlaying, 
  isShuffle, 
  isLoop, 
  volume,
  onVolumeChange,
  togglePlay, 
  playNext, 
  playPrev, 
  toggleShuffle, 
  toggleLoop, 
  seek 
}) => {
  const sparkleContainerRef = useRef(null);
  const sparkleIntervalRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
  
  // Format time in minutes:seconds
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Update time display
  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;
    
    const updateTimeDisplay = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration));
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    
    audio.addEventListener('timeupdate', updateTimeDisplay);
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTimeDisplay);
      audio.removeEventListener('loadedmetadata', updateTimeDisplay);
    };
  }, []);
  
  // Keep prevVolume updated when volume changes and it's not muted
  useEffect(() => {
    if (volume > 0 && !isMuted) {
      setPrevVolume(volume);
    }
  }, [volume, isMuted]);
  
  // Clear all sparkles 
  const clearSparkles = () => {
    if (sparkleContainerRef.current) {
      sparkleContainerRef.current.innerHTML = '';
    }
    if (sparkleIntervalRef.current) {
      clearInterval(sparkleIntervalRef.current);
      sparkleIntervalRef.current = null;
    }
  };
  
  // Handle sparkle effects based on play state
  useEffect(() => {
    // Clear any existing sparkles and intervals
    clearSparkles();
    
    // Only create new sparkles if playing
    if (isPlaying && sparkleContainerRef.current) {
      createSparkles();
      
      // Periodically refresh sparkles when playing
      sparkleIntervalRef.current = setInterval(createSparkles, 8000);
    }
    
    // Cleanup function
    return clearSparkles;
  }, [isPlaying]);
  
  // Function to create sparkles
  const createSparkles = () => {
    if (!sparkleContainerRef.current || !isPlaying) return;
    
    // Clear existing sparkles
    if (sparkleContainerRef.current) {
      sparkleContainerRef.current.innerHTML = '';
    }
    
    // Create sparkles
    const numberOfSparkles = 50; // More sparkles for better effect
    for (let i = 0; i < numberOfSparkles; i++) {
      const sparkle = document.createElement('div');
      
      // Random properties with bias towards white sparkles for minimal look
      const sparkleType = Math.random();
      let className = 'sparkle ';
      
      // More white sparkles for minimalist look
      if (sparkleType > 0.7) {
        className += 'green';
      } else {
        className += 'white';
      }
      
      // Position sparkles in a more intentional pattern
      let top, left;
      
      // Create a better distribution of sparkles
      if (i % 5 === 0) {
        // Along the edges
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { // top
          top = Math.random() * 10;
          left = Math.random() * 100;
        } else if (side === 1) { // right
          top = Math.random() * 100;
          left = 90 + Math.random() * 10;
        } else if (side === 2) { // bottom
          top = 90 + Math.random() * 10;
          left = Math.random() * 100;
        } else { // left
          top = Math.random() * 100;
          left = Math.random() * 10;
        }
      } else if (i % 5 === 1) {
        // Around the progress bar
        top = 70 + (Math.random() * 20);
        left = Math.random() * 100;
      } else if (i % 5 === 2) {
        // Around the play button (center)
        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + Math.random() * 20;
        top = 40 + Math.sin(angle) * distance;
        left = 50 + Math.cos(angle) * distance;
      } else if (i % 5 === 3) {
        // Near album art
        top = 20 + Math.random() * 40;
        left = 10 + Math.random() * 20;
      } else {
        // Random elsewhere
        top = Math.random() * 100;
        left = Math.random() * 100;
      }
      
      // Varying sizes for more natural look
      const size = 1 + Math.random() * 4;
      const duration = 2 + Math.random() * 6;
      const delay = Math.random() * 8;
      
      // Set sparkle properties
      sparkle.className = className;
      sparkle.style.setProperty('--top', `${top}%`);
      sparkle.style.setProperty('--left', `${left}%`);
      sparkle.style.setProperty('--size', `${size}px`);
      sparkle.style.setProperty('--duration', `${duration}s`);
      sparkle.style.setProperty('--delay', `${delay}s`);
      
      // Add to container
      sparkleContainerRef.current.appendChild(sparkle);
    }
    
    // Add a special burst when play button is clicked
    if (isPlaying) {
      // Create a ripple effect from the center
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          if (!sparkleContainerRef.current || !isPlaying) return;
          
          const angle = (i / 15) * Math.PI * 2;
          const sparkle = document.createElement('div');
          
          // Alternate between green and white
          sparkle.className = `sparkle ${i % 2 === 0 ? 'green' : 'white'}`;
          
          // Position in a circular pattern from center
          const distance = 20 + (i / 15) * 30; // Increasing distance for ripple effect
          const top = 40 + Math.sin(angle) * distance/3;
          const left = 50 + Math.cos(angle) * distance/2;
          
          sparkle.style.setProperty('--top', `${top}%`);
          sparkle.style.setProperty('--left', `${left}%`);
          sparkle.style.setProperty('--size', `${i % 3 + 2}px`);
          sparkle.style.setProperty('--duration', '1.5s');
          sparkle.style.setProperty('--delay', '0s');
          
          sparkleContainerRef.current.appendChild(sparkle);
          
          // Remove sparkle after animation
          setTimeout(() => {
            if (sparkleContainerRef.current && sparkleContainerRef.current.contains(sparkle)) {
              sparkleContainerRef.current.removeChild(sparkle);
            }
          }, 1500);
        }, i * 50);
      }
    }
  };

  // Handle volume slider change
  const handleVolumeChange = (e) => {
    const sliderWidth = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newVolume = Math.floor((clickX / sliderWidth) * 100);
    
    onVolumeChange(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };
  
  if (!currentSong) {
    return null;
  }
  
  return (
    <div className="player-container">
      <div className="sparkle-container" ref={sparkleContainerRef}></div>
      
      <div className="player-info">
        <img 
          src={currentSong.cover} 
          className={`album-art ${isPlaying ? 'playing' : ''}`}
          alt="Album Art" 
        />
        <div className="song-info">
          <h4 className="song-title">{currentSong.title}</h4>
          <p className="artist">{currentSong.artist}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button 
            className="control-btn shuffle" 
            style={{ color: isShuffle ? '#1db954' : '#fff' }}
            onClick={toggleShuffle}
          >
            <FontAwesomeIcon icon={faRandom} />
          </button>
          <button className="control-btn prev" onClick={playPrev}>
            <FontAwesomeIcon icon={faStepBackward} />
          </button>
          <button 
            className="control-btn play-pause" 
            onClick={togglePlay}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button className="control-btn next" onClick={playNext}>
            <FontAwesomeIcon icon={faStepForward} />
          </button>
          <button 
            className="control-btn loop" 
            style={{ color: isLoop ? '#1db954' : '#fff' }}
            onClick={toggleLoop}
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
        
        <div className="progress-wrapper">
          <span className="time current-time">{currentTime}</span>
          <div className="progress-container" onClick={seek}>
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time total-time">{duration}</span>
        </div>
      </div>
      
      <div className="player-volume">
        <button className="volume-btn" onClick={toggleMute}>
          <FontAwesomeIcon icon={volume === 0 ? faVolumeMute : faVolumeUp} />
        </button>
        <div className="volume-slider" onClick={handleVolumeChange}>
          <div className="volume-progress" style={{ width: `${volume}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Player; 