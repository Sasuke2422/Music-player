import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faPause, faStepForward, faStepBackward, 
  faRandom, faRedo, faSearch
} from '@fortawesome/free-solid-svg-icons';
import songs from './data';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import AlbumGrid from './components/AlbumGrid';
import SongList from './components/SongList';
import Player from './components/Player';

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(window.innerWidth > 768);
  const [activeSection, setActiveSection] = useState('home');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [volume, setVolume] = useState(70);
  
  const audioRef = useRef(new Audio());
  const { current: audio } = audioRef;
  
  // Initialize audio event listeners
  useEffect(() => {
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('timeupdate', updateProgress);
    
    // Initialize volume
    audio.volume = volume / 100;
    
    // Responsive sidebar
    const handleResize = () => {
      setSidebarActive(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('timeupdate', updateProgress);
      window.removeEventListener('resize', handleResize);
    };
  }, [audio, volume]);
  
  // Filter songs when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  }, [searchQuery]);
  
  // Handle song end
  const handleSongEnd = () => {
    if (!isLoop) {
      playNext();
    }
  };
  
  // Update progress bar
  const updateProgress = () => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
  };
  
  // Play a song
  const playSong = (index) => {
    setCurrentSongIndex(index);
    audio.src = songs[index].file;
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error("Error playing audio:", error);
      });
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
          });
      } else if (songs.length > 0) {
        playSong(0);
      }
    }
  };
  
  // Play next song
  const playNext = () => {
    if (songs.length === 0) return;
    
    const nextIndex = isShuffle 
      ? Math.floor(Math.random() * songs.length) 
      : (currentSongIndex + 1) % songs.length;
    
    playSong(nextIndex);
  };
  
  // Play previous song
  const playPrev = () => {
    if (songs.length === 0) return;
    
    const prevIndex = currentSongIndex === 0 
      ? songs.length - 1 
      : currentSongIndex - 1;
    
    playSong(prevIndex);
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };
  
  // Toggle loop
  const toggleLoop = () => {
    setIsLoop(!isLoop);
    audio.loop = !isLoop;
  };
  
  // Seek in the song
  const seek = (e) => {
    const progressContainer = document.querySelector('.progress-container');
    const width = progressContainer.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    
    if (audio.duration) {
      audio.currentTime = (clickX / width) * audio.duration;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    audio.volume = newVolume / 100;
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };
  
  // Toggle search
  const toggleSearch = (e) => {
    e.stopPropagation();
    setSearchActive(!searchActive);
  };
  
  // Close search when clicking outside
  const closeSearch = (e) => {
    if (!e.target.closest('.search-wrapper')) {
      setSearchActive(false);
    }
  };
  
  // Change section
  const changeSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      setSidebarActive(false);
    }
  };
  
  return (
    <div onClick={closeSearch}>
      <div className="hamburger" onClick={toggleSidebar}>☰</div>
      
      <Sidebar 
        active={sidebarActive}
        activeSection={activeSection}
        changeSection={changeSection}
      />
      
      <div className="main-content">
        <div className={`search-wrapper ${searchActive ? 'active' : ''}`}>
          <input 
            type="text" 
            className={`search-bar ${searchActive ? 'active' : ''}`}
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="search-toggle" 
            onClick={toggleSearch}
          />
        </div>
        
        {/* Home Section */}
        <section id="home" className={`section ${activeSection === 'home' ? 'active-section' : ''}`}>
          <h2>Album Gallery</h2>
          <AlbumGrid 
            songs={filteredSongs} 
            playSong={playSong}
            currentSongIndex={currentSongIndex}
          />
        </section>
        
        {/* Library Section */}
        <section id="library" className={`section ${activeSection === 'library' ? 'active-section' : ''}`}>
          <h2>Your Library</h2>
          <SongList 
            songs={filteredSongs} 
            playSong={playSong}
            currentSongIndex={currentSongIndex}
          />
        </section>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }}></audio>
      
      <Player 
        currentSong={songs[currentSongIndex]}
        isPlaying={isPlaying}
        isShuffle={isShuffle}
        isLoop={isLoop}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        togglePlay={togglePlay}
        playNext={playNext}
        playPrev={playPrev}
        toggleShuffle={toggleShuffle}
        toggleLoop={toggleLoop}
        seek={seek}
      />
    </div>
  );
}

export default App; 