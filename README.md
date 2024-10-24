# Spocofy

Spocofy is a music streaming application that allows users to explore millions of songs, create playlists, and discover new music. This project is built using a combination of React for the frontend and Node.js for the backend.

## Features

- User authentication and authorization
- Responsive design for different screen sizes
- Create, view, and manage playlists
- Search for songs and artists
- Recent playlists section

## Tech Stack

### Frontend

- React
- Redux
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Spotify API

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Spotify Developer Account

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/spocofy.git
   ```

2. Navigate to the project directory:
   ```sh
   cd spocofy
   ```

3. Install dependencies for the frontend:
   ```sh
   cd Spotify
   npm install
   ```

4. Install dependencies for the backend:
   ```sh
   cd ../Spotify_backend
   npm install
   ```

### Configuration

1. Create a `.env` file in the `Spotify_backend` directory and add the following environment variables:
   ```env
   PORTNO=3000
   MONGODBPASSWORD=your_mongodb_password
   MONGODBCONNECTIONURL=your_mongodb_connection_url
   MONGODBUSERNAME=your_mongodb_username
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

### Running the Application

1. Start the backend server:
   ```sh
   cd Spotify_backend
   npm start
   ```

2. Start the frontend development server:
   ```sh
   cd ../Spotify
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Project Structure

### Frontend

- `src/components`: Contains reusable UI components
- `src/Pages`: Contains the main pages of the application
- `src/Store`: Contains Redux store and reducers
- `src/Utils`: Contains utility functions and hooks

### Backend

- `Routes`: Contains route definitions
- `Utils`: Contains utility functions and services
- `index.js`: Entry point of the backend server

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Spotify API](https://developer.spotify.com/documentation/web-api/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
