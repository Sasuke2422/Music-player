# React Spotify Clone

A Spotify-like music player built with React.

## Features

- Music player with play/pause, next/previous, shuffle, and loop functionality
- Album gallery view
- Library view with song list
- Search functionality
- Responsive design for mobile and desktop

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add your music files to the `public/music` directory
4. Add album cover images to the `public/covers` directory
5. Update the `src/data.js` file with your music information
6. Start the development server:
   ```
   npm start
   ```

## Project Structure

- `src/components` - React components
  - `AlbumGrid.js` - Album grid display
  - `Player.js` - Music player controls
  - `Sidebar.js` - Navigation sidebar
  - `SongList.js` - Song list display
- `src/App.js` - Main application component
- `src/App.css` - Styles
- `src/data.js` - Song data

## Technologies Used

- React
- Font Awesome
- CSS3

## License

ISC 