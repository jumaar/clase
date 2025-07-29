CREATE DATABASE IF NOT EXISTS moviesdb;

USE moviesdb;

CREATE TABLE movie (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  director VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  poster TEXT,
  rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_genres (
  movie_id BINARY(16) REFERENCES movie(id),
  genre_id INT REFERENCES genre(id),
  PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name) VALUES
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance'),
('Animation'),
('Biography'),
('Fantasy');

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
(UUID_TO_BIN(UUID()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
(UUID_TO_BIN(UUID()), 'Inception', 2010, 'Christopher Nolan', 148, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
(UUID_TO_BIN(UUID()), 'Pulp Fiction', 1994, 'Quentin Tarantino', 154, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9),
(UUID_TO_BIN(UUID()), 'Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8);

INSERT INTO movie_genres (movie_id, genre_id)
SELECT
  m.id, g.id
FROM movie m
JOIN genre g ON
  (m.title = 'The Shawshank Redemption' AND g.name IN ('Drama')) OR
  (m.title = 'The Dark Knight' AND g.name IN ('Action', 'Crime', 'Drama')) OR
  (m.title = 'Inception' AND g.name IN ('Action', 'Adventure', 'Sci-Fi')) OR
  (m.title = 'Pulp Fiction' AND g.name IN ('Crime', 'Drama')) OR
  (m.title = 'Forrest Gump' AND g.name IN ('Drama', 'Romance'));

