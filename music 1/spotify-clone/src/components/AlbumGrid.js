import React from 'react';

const AlbumGrid = ({ songs, playSong, currentSongIndex }) => {
  return (
    <div className="album-grid">
      {songs.length > 0 ? (
        songs.map((song, index) => {
          // Find the original index in the songs array
          const originalIndex = songs.findIndex(s => s.title === song.title);
          return (
            <div 
              key={index}
              className={`album-item ${originalIndex === currentSongIndex ? 'active' : ''}`}
              onClick={() => playSong(originalIndex)}
            >
              <img src={song.cover} alt={song.title} />
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
            </div>
          );
        })
      ) : (
        <p>No albums match your search</p>
      )}
    </div>
  );
};

export default AlbumGrid; 