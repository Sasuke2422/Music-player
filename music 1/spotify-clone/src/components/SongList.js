import React from 'react';

const SongList = ({ songs, playSong, currentSongIndex }) => {
  return (
    <div className="song-list library-list">
      {songs.length > 0 ? (
        songs.map((song, index) => {
          // Find the original index in the songs array
          const originalIndex = songs.findIndex(s => s.title === song.title);
          return (
            <div 
              key={index}
              className={`song-item ${originalIndex === currentSongIndex ? 'active' : ''}`}
              onClick={() => playSong(originalIndex)}
            >
              <img src={song.cover} className="album-art" alt={song.title} />
              <div>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p>No songs match your search</p>
      )}
    </div>
  );
};

export default SongList; 