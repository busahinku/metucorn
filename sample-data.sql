-- Sample Data for metucorn Movie Platform
-- AI created this file, we rearranged and changed the data with existed ones after creating.

-- Step 1.0: Insert Genres
INSERT INTO genre (name, description) VALUES
  ('Action', 'High-octane movies with intense sequences'),
  ('Comedy', 'Funny and entertaining films'),
  ('Drama', 'Serious and emotional storytelling'),
  ('Sci-Fi', 'Science fiction and futuristic themes'),
  ('Horror', 'Scary and suspenseful content'),
  ('Romance', 'Love stories and romantic themes'),
  ('Thriller', 'Suspenseful and gripping narratives'),
  ('Adventure', 'Exciting journeys and explorations'),
  ('Fantasy', 'Magical and imaginative worlds'),
  ('Animation', 'Animated features and cartoons'),
  ('Crime', 'Stories centered around criminals, detectives, and law enforcement'),
  ('Mystery', 'Plots involving secrets, puzzles, and investigations'),
  ('Documentary', 'Non-fiction films exploring real events and topics'),
  ('Biography', 'Movies based on real people and their life stories'),
  ('Historical', 'Films set in or inspired by historical events'),
  ('War', 'Movies focused on battles, soldiers, and wartime stories'),
  ('Musical', 'Films featuring songs performed by the characters'),
  ('Family', 'Movies suitable for all ages with family-friendly themes'),
  ('Sports', 'Stories revolving around athletes, competitions, and sports life'),
  ('Western', 'Films set in the American Old West featuring cowboys and frontier life'),
  ('Noir', 'Dark, stylish crime dramas with moral ambiguity'),
  ('Superhero', 'Movies based on characters with extraordinary abilities'),
  ('Psychological', 'Mind-bending films focusing on mental conflict and suspense'),
  ('Epic', 'Large-scale, grand narratives often spanning long periods'),
  ('Crime-Thriller', 'Fast-paced crime stories with high tension'),
  ('Disaster', 'Movies about catastrophes, natural or man-made'),
  ('Cyberpunk', 'High-tech and dystopian futuristic worlds'),
  ('Post-Apocalyptic', 'Stories set after the collapse of civilization'),
  ('Time Travel', 'Movies exploring journeys across time'),
  ('Martial Arts', 'Films featuring combat-focused action and choreography');

-- Step 2.0: Insert Directors
INSERT INTO director (director_name, bio) VALUES
  ('Christopher Nolan', 'British-American filmmaker known for cerebral, complex films including Deadpool, Interstellar, and The Dark Knight trilogy.'),
  ('Quentin Tarantino', 'American director known for stylized violence and sharp dialogue in films like Pulp Fiction and Kill Bill.'),
  ('Steven Spielberg', 'Legendary filmmaker behind blockbusters like Jurassic Park, E.T., and Schindler''s List.'),
  ('Martin Scorsese', 'Master of crime dramas and character studies, directed Goodfellas, The Wolf of Wall Street, and Taxi Driver.'),
  ('Greta Gerwig', 'Acclaimed director of Lady Bird and Barbie, known for her insightful character development.'),
  ('Denis Villeneuve', 'Visionary director of Dune, Arrival, and Blade Runner 2049.'),
  ('James Cameron', 'Director of Titanic and Avatar, known for pushing technical boundaries.'),
  ('Wes Anderson', 'Distinctive visual stylist known for The Grand Budapest Hotel and Moonrise Kingdom.'),
  ('Ridley Scott', 'Director of Alien, Blade Runner, and Gladiator.'),
  ('Peter Jackson', 'Director of The Lord of the Rings and The Hobbit trilogies.'),
  ('Alfonso Cuarón', 'Mexican filmmaker known for Gravity, Roma, and Children of Men.'),
  ('Guillermo del Toro', 'Director known for Pan''s Labyrinth, The Shape of Water, and Hellboy.'),
  ('David Fincher', 'Known for precise visual style in films like Fight Club, Seven, and The Social Network.'),
  ('Bong Joon-ho', 'South Korean director known for Parasite, Snowpiercer, and Memories of Murder.'),
  ('Christopher McQuarrie', 'Director known for Mission: Impossible – Fallout and Rogue Nation.'),
  ('Patty Jenkins', 'American filmmaker known for Wonder Woman and Monster.'),
  ('Jordan Peele', 'Director known for Get Out, Us, and Nope, blending horror with social commentary.'),
  ('Taika Waititi', 'Known for Thor: Ragnarok, Jojo Rabbit, and Hunt for the Wilderpeople.'),
  ('Zack Snyder', 'Director known for 300, Man of Steel, and Zack Snyder''s Justice League.'),
  ('Kathryn Bigelow', 'First woman to win Best Director Oscar, known for The Hurt Locker and Zero Dark Thirty.'),
  ('Akira Kurosawa', 'Legendary Japanese filmmaker behind Seven Samurai, Rashomon, and Ikiru.'),
  ('Hayao Miyazaki', 'Co-founder of Studio Ghibli, known for Spirited Away and Princess Mononoke.'),
  ('Lana Wachowski', 'Co-director of The Matrix trilogy and Cloud Atlas.'),
  ('Ang Lee', 'Taiwanese filmmaker known for Life of Pi, Brokeback Mountain, and Crouching Tiger, Hidden Dragon.'),
  ('Stanley Kubrick', 'Iconic director known for 2001: A Space Odyssey, The Shining, and Full Metal Jacket.');

-- Step 3.0: Insert Cast Members
INSERT INTO cast_member (cast_name, bio) VALUES
  ('Leonardo DiCaprio', 'Academy Award-winning actor known for Titanic, Deadpool, and The Revenant.'),
  ('Meryl Streep', 'Three-time Oscar winner, considered one of the greatest actresses of all time.'),
  ('Tom Hanks', 'Beloved actor known for Forrest Gump, Cast Away, and Saving Private Ryan.'),
  ('Scarlett Johansson', 'Versatile actress known for Marvel films and dramatic roles.'),
  ('Robert Downey Jr.', 'Iron Man himself, charismatic leading man.'),
  ('Emma Stone', 'Oscar winner known for La La Land and Easy A.'),
  ('Christian Bale', 'Method actor known for Batman trilogy and American Psycho.'),
  ('Natalie Portman', 'Oscar-winning actress known for Black Swan and Star Wars.'),
  ('Brad Pitt', 'A-list actor known for Fight Club, Once Upon a Time in Hollywood.'),
  ('Cate Blanchett', 'Two-time Oscar winner known for Blue Jasmine and The Aviator.'),
  ('Denzel Washington', 'Two-time Oscar winner known for Training Day and Malcolm X.'),
  ('Jennifer Lawrence', 'Oscar winner known for The Hunger Games and Silver Linings Playbook.'),
  ('Morgan Freeman', 'Iconic voice and presence, known for Shawshank Redemption.'),
  ('Samuel L. Jackson', 'Prolific actor known for Pulp Fiction and Marvel films.'),
  ('Margot Robbie', 'Australian actress known for Barbie and Suicide Squad.'),
  ('Matt Damon', 'Academy Award-winning actor known for The Martian, Good Will Hunting, and Interstellar ensemble.'),
  ('Anne Hathaway', 'Oscar-winning actress known for Les Misérables, Interstellar, and The Devil Wears Prada.'),
  ('Hugh Jackman', 'Actor known for Wolverine, The Prestige, and The Greatest Showman.'),
  ('Amy Adams', 'Six-time Oscar nominee known for Arrival, Enchanted, and American Hustle.'),
  ('Timothée Chalamet', 'Actor known for Dune, Call Me By Your Name, and Wonka.'),
  ('Zendaya', 'Actress known for Dune, Euphoria, and Spider-Man trilogy.'),
  ('Jake Gyllenhaal', 'Actor known for Nightcrawler, Prisoners, and Donnie Darko.'),
  ('Ryan Gosling', 'Actor known for Blade Runner 2049, La La Land, and Drive.'),
  ('Joaquin Phoenix', 'Oscar winner known for Joker, Gladiator, and Her.'),
  ('Keanu Reeves', 'Actor known for The Matrix trilogy, John Wick, and Speed.'),
  ('Carrie-Anne Moss', 'Actress known for The Matrix trilogy and Memento.'),
  ('Rami Malek', 'Actor known for Bohemian Rhapsody, Mr. Robot, and No Time to Die.'),
  ('Ben Affleck', 'Actor-director known for Argo, Gone Girl, and The Town.'),
  ('Rooney Mara', 'Actress known for The Girl with the Dragon Tattoo and Carol.'),
  ('Michael Fassbender', 'Actor known for X-Men, Prometheus, and Steve Jobs.'),
  ('Jessica Chastain', 'Actress known for Interstellar, Zero Dark Thirty, and The Tree of Life.'),
  ('Emily Blunt', 'Actress known for Edge of Tomorrow, A Quiet Place, and Sicario.'),
  ('Idris Elba', 'Actor known for Pacific Rim, Luther, and Thor.'),
  ('Tilda Swinton', 'Actress known for Doctor Strange, Snowpiercer, and The Grand Budapest Hotel.'),
  ('Andy Serkis', 'Actor known for Gollum in LOTR, Planet of the Apes, and Star Wars.');
 

-- Step 4.0: Insert Movies with YouTube Links
-- Note: Using trailer/sample video links - replace with actual content links as needed

INSERT INTO movie (
  title, 
  director_id, 
  status, 
  age_rating, 
  description, 
  synopsis, 
  duration_time, 
  release_date, 
  price,
  trailer_link,
  yt_link,
  poster_image,
  header_image
) VALUES
  (
    'Deadpool',
    (SELECT director_id FROM director WHERE director_name = 'Christopher Nolan'),
    'available',
    'PG-13',
    'A mind-bending thriller about dreams within dreams',
    'Dom Cobb is a skilled thief who steals secrets from people''s subconscious during the dream state. He''s offered a chance at redemption: instead of stealing an idea, he must plant one.',
    148,
    '2010-07-16',
    9.99,
    'https://www.youtube.com/watch?v=VHAK-gU9gi0',
    'https://www.youtube.com/watch?v=VHAK-gU9gi0',
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'https://free-3dtextureshd.com/wp-content/uploads/2024/12/325.jpg.webp'
  ),
  (
    'The Dark Knight',
    (SELECT director_id FROM director WHERE director_name = 'Christopher Nolan'),
    'available',
    'PG-13',
    'Batman faces his greatest challenge yet with the Joker',
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    152,
    '2008-07-18',
    8.99,
    'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg'
  ),
  (
    'Interstellar',
    (SELECT director_id FROM director WHERE director_name = 'Christopher Nolan'),
    'available',
    'PG-13',
    'A journey beyond the stars to save humanity',
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival as Earth becomes uninhabitable.',
    169,
    '2014-11-07',
    10.99,
    'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg'
  ),
  (
    'Pulp Fiction',
    (SELECT director_id FROM director WHERE director_name = 'Quentin Tarantino'),
    'available',
    'R',
    'Intertwining stories of crime in Los Angeles',
    'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    154,
    '1994-10-14',
    7.99,
    'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg'
  ),
  (
    'Dune',
    (SELECT director_id FROM director WHERE director_name = 'Denis Villeneuve'),
    'available',
    'PG-13',
    'Epic sci-fi saga on the desert planet Arrakis',
    'Paul Atreides arrives on Arrakis after his father accepts stewardship of the dangerous planet. However, chaos ensues after a betrayal as forces clash over the planet''s exclusive supply of the most precious resource in existence.',
    155,
    '2021-10-22',
    12.99,
    'https://www.youtube.com/watch?v=8g18jFHCLXk',
    'https://www.youtube.com/watch?v=8g18jFHCLXk',
    'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    'https://image.tmdb.org/t/p/original/s1FhzhJH41ibConVbGcCmm4B1WC.jpg'
  ),
  (
    'Barbie',
    (SELECT director_id FROM director WHERE director_name = 'Greta Gerwig'),
    'available',
    'PG-13',
    'Barbie embarks on a journey of self-discovery',
    'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
    114,
    '2023-07-21',
    11.99,
    'https://www.youtube.com/watch?v=pBk4NYhWNMM',
    'https://www.youtube.com/watch?v=pBk4NYhWNMM',
    'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg'
  ),
  (
    'Avatar',
    (SELECT director_id FROM director WHERE director_name = 'James Cameron'),
    'available',
    'PG-13',
    'A marine on an alien planet torn between duty and love',
    'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    162,
    '2009-12-18',
    10.99,
    'https://www.youtube.com/watch?v=5PSNL1qE6VY',
    'https://www.youtube.com/watch?v=5PSNL1qE6VY',
    'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqoKGNCZv.jpg',
    'https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg'
  ),
  (
    'The Grand Budapest Hotel',
    (SELECT director_id FROM director WHERE director_name = 'Wes Anderson'),
    'available',
    'R',
    'A legendary concierge and his protégé embark on adventures',
    'The adventures of Gustave H, a legendary concierge at a famous European hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend.',
    99,
    '2014-03-28',
    8.99,
    'https://www.youtube.com/watch?v=1Fg5iWmQjwk',
    'https://www.youtube.com/watch?v=1Fg5iWmQjwk',
    'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    'https://image.tmdb.org/t/p/original/nP6RliHjxsU3cKlP1dXhkSF7uyb.jpg'
  ),
  (
    'The Shawshank Redemption',
    (SELECT director_id FROM director WHERE director_name = 'Steven Spielberg'),
    'available',
    'R',
    'Hope and friendship in the darkest of places',
    'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    142,
    '1994-09-23',
    7.99,
    'https://www.youtube.com/watch?v=6hB3S9bIaco',
    'https://www.youtube.com/watch?v=6hB3S9bIaco',
    'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg'
  ),
  (
    'Gladiator',
    (SELECT director_id FROM director WHERE director_name = 'Ridley Scott'),
    'available',
    'R',
    'A betrayed general seeks vengeance in the arena',
    'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    155,
    '2000-05-05',
    8.99,
    'https://www.youtube.com/watch?v=owK1qxDselE',
    'https://www.youtube.com/watch?v=owK1qxDselE',
    'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    'https://image.tmdb.org/t/p/original/6WBIzCgmDCYrqh64yDREGeDk9d3.jpg'
  ),
  (
    'Fight Club',
    (SELECT director_id FROM director WHERE director_name = 'David Fincher'),
    'available',
    'R',
    'A psychological drama about identity and rebellion',
    'An office worker and a soap salesman build a global organization to help vent male frustration.',
    139,
    '1999-10-15',
    7.99,
    'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
    'https://image.tmdb.org/t/p/original/7Hl2wPcCIFBgoYfWfZqF39cptfN.jpg'
  ),
  (
    'Parasite',
    (SELECT director_id FROM director WHERE director_name = 'Bong Joon-ho'),
    'available',
    'R',
    'A dark comedy thriller about two families from different classes',
    'A poor family infiltrates a wealthy household, sparking an unexpected chain of events.',
    132,
    '2019-05-30',
    10.99,
    'https://www.youtube.com/watch?v=SEUXfv87Wpk',
    'https://www.youtube.com/watch?v=SEUXfv87Wpk',
    'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    'https://image.tmdb.org/t/p/original/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg'
  ),
  (
    'The Shape of Water',
    (SELECT director_id FROM director WHERE director_name = 'Guillermo del Toro'),
    'available',
    'R',
    'A romantic dark fantasy set during the Cold War',
    'A mute woman forms a unique bond with a mysterious aquatic creature being held in a secret government facility.',
    123,
    '2017-12-01',
    8.99,
    'https://www.youtube.com/watch?v=XFYWazblaUA',
    'https://www.youtube.com/watch?v=XFYWazblaUA',
    'https://image.tmdb.org/t/p/w500/iLYlyXTCYjpgPSprPsLPTnww8yy.jpg',
    'https://image.tmdb.org/t/p/original/wmP8nq4v0Lz7mg7Fwhwxp2Muq1r.jpg'
  ),
  (
    'Gravity',
    (SELECT director_id FROM director WHERE director_name = 'Alfonso Cuarón'),
    'available',
    'PG-13',
    'A tense survival story set in space',
    'Two astronauts struggle to survive after an accident leaves them adrift in space.',
    91,
    '2013-10-04',
    9.99,
    'https://www.youtube.com/watch?v=OiTiKOy59o4',
    'https://www.youtube.com/watch?v=OiTiKOy59o4',
    'https://image.tmdb.org/t/p/w500/kMBwqycDoSAGg8p1Q4vRcg5wK1J.jpg',
    'https://image.tmdb.org/t/p/original/x5sRKJZaPj0VS62PpGeTjikvKTT.jpg'
  ),
  (
    'The Hurt Locker',
    (SELECT director_id FROM director WHERE director_name = 'Kathryn Bigelow'),
    'available',
    'R',
    'A gripping war drama following a bomb disposal team',
    'An Iraq War bomb disposal expert faces danger and psychological strain during missions.',
    131,
    '2009-06-26',
    8.99,
    'https://www.youtube.com/watch?v=2GxSDZc8etg',
    'https://www.youtube.com/watch?v=2GxSDZc8etg',
    'https://image.tmdb.org/t/p/w500/q0IBs4tJfZZ8XvvxbZNVlrQX6hw.jpg',
    'https://image.tmdb.org/t/p/original/8mDdySb0nudIG3n6D79deoaoCSo.jpg'
  ),
  (
    'The Matrix',
    (SELECT director_id FROM director WHERE director_name = 'Lana Wachowski'),
    'available',
    'R',
    'A hacker discovers the truth about reality and joins a rebellion',
    'Thomas Anderson learns about the Matrix, a simulated world created to enslave humanity.',
    136,
    '1999-03-31',
    8.99,
    'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    'https://image.tmdb.org/t/p/original/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg'
  ),
  (
    'Life of Pi',
    (SELECT director_id FROM director WHERE director_name = 'Ang Lee'),
    'available',
    'PG',
    'A spiritual survival story at sea',
    'After a shipwreck, a young man survives on a lifeboat with a Bengal tiger.',
    127,
    '2012-11-21',
    7.99,
    'https://www.youtube.com/watch?v=j9Hjrs6WQ8M',
    'https://www.youtube.com/watch?v=j9Hjrs6WQ8M',
    'https://image.tmdb.org/t/p/w500/lr8Lu94FAzgdQKW8o5sC5pF4VqN.jpg',
    'https://image.tmdb.org/t/p/original/ltVjX0ykG5GkSx70iogxZ6EYBjO.jpg'
  ),
  (
    'Princess Mononoke',
    (SELECT director_id FROM director WHERE director_name = 'Hayao Miyazaki'),
    'available',
    'PG-13',
    'An epic fantasy about humanity, nature, and conflict',
    'A young warrior becomes involved in a conflict between forest gods and humans exploiting the land.',
    134,
    '1997-07-12',
    8.99,
    'https://www.youtube.com/watch?v=4OiMOHRDs14',
    'https://www.youtube.com/watch?v=4OiMOHRDs14',
    'https://image.tmdb.org/t/p/w500/q164MZ6pE4GfFnE58YsVAJtUY6s.jpg',
    'https://image.tmdb.org/t/p/original/cb1K3N3Wf9eKJeNEqXWiwxup6vC.jpg'
  ),
  (
    'Seven Samurai',
    (SELECT director_id FROM director WHERE director_name = 'Akira Kurosawa'),
    'available',
    'PG-13',
    'A legendary tale of heroism and sacrifice',
    'Villagers recruit seven samurai to protect them from bandits threatening their village.',
    207,
    '1954-04-26',
    6.99,
    'https://www.youtube.com/watch?v=7mw6LyyoeGE',
    'https://www.youtube.com/watch?v=7mw6LyyoeGE',
    'https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg',
    'https://image.tmdb.org/t/p/original/jdLsmpqmP1wTdFUPtmxMnYgoifT.jpg'
  ),
  (
    '300',
    (SELECT director_id FROM director WHERE director_name = 'Zack Snyder'),
    'available',
    'R',
    'A stylized retelling of the Battle of Thermopylae',
    'King Leonidas leads 300 Spartans against the Persian army in a legendary last stand.',
    117,
    '2007-03-09',
    7.99,
    'https://www.youtube.com/watch?v=UrIbxk7idYA',
    'https://www.youtube.com/watch?v=UrIbxk7idYA',
    'https://image.tmdb.org/t/p/w500/9W49fy5VQYc1eoGeJQoMuNNsPD1.jpg',
    'https://image.tmdb.org/t/p/original/9W49fy5VQYc1eoGeJQoMuNNsPD1.jpg'
  );

-- Step 5.0: Link Movies to Genres
INSERT INTO movie_genre (movie_id, genre_id)
SELECT 
  m.movie_id,
  g.genre_id
FROM movie m
CROSS JOIN genre g
WHERE 
  (m.title = 'Deadpool' AND g.name IN ('Action', 'Sci-Fi', 'Thriller')) OR
  (m.title = 'The Dark Knight' AND g.name IN ('Action', 'Crime', 'Drama')) OR
  (m.title = 'Interstellar' AND g.name IN ('Sci-Fi', 'Drama', 'Adventure')) OR
  (m.title = 'Pulp Fiction' AND g.name IN ('Crime', 'Drama')) OR
  (m.title = 'Dune' AND g.name IN ('Sci-Fi', 'Adventure', 'Drama')) OR
  (m.title = 'Barbie' AND g.name IN ('Comedy', 'Fantasy', 'Adventure')) OR
  (m.title = 'Avatar' AND g.name IN ('Sci-Fi', 'Action', 'Adventure')) OR
  (m.title = 'The Grand Budapest Hotel' AND g.name IN ('Comedy', 'Drama', 'Adventure')) OR
  (m.title = 'The Shawshank Redemption' AND g.name IN ('Drama')) OR
  (m.title = 'Gladiator' AND g.name IN ('Action', 'Drama', 'Adventure')) OR
  (m.title = 'Fight Club' AND g.name IN ('Drama', 'Psychological', 'Crime')) OR
  (m.title = 'Parasite' AND g.name IN ('Drama', 'Thriller', 'Mystery')) OR
  (m.title = 'The Shape of Water' AND g.name IN ('Fantasy', 'Romance', 'Drama')) OR
  (m.title = 'Gravity' AND g.name IN ('Sci-Fi', 'Thriller', 'Drama')) OR
  (m.title = 'The Hurt Locker' AND g.name IN ('War', 'Drama', 'Action')) OR
  (m.title = 'The Matrix' AND g.name IN ('Sci-Fi', 'Action', 'Cyberpunk')) OR
  (m.title = 'Life of Pi' AND g.name IN ('Adventure', 'Drama', 'Fantasy')) OR
  (m.title = 'Princess Mononoke' AND g.name IN ('Fantasy', 'Adventure', 'Action')) OR
  (m.title = 'Seven Samurai' AND g.name IN ('Action', 'Drama', 'Adventure')) OR
  (m.title = '300' AND g.name IN ('Action', 'War', 'Drama'));

-- Step 6.0: Link Movies to Cast
-- Deadpool Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Leonardo DiCaprio' THEN 'Dom Cobb'
    WHEN 'Tom Hanks' THEN 'Arthur'
    WHEN 'Cate Blanchett' THEN 'Mal'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Deadpool' 
  AND c.cast_name IN ('Leonardo DiCaprio', 'Tom Hanks', 'Cate Blanchett');

-- The Dark Knight Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Christian Bale' THEN 'Bruce Wayne / Batman'
    WHEN 'Morgan Freeman' THEN 'Lucius Fox'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Dark Knight' 
  AND c.cast_name IN ('Christian Bale', 'Morgan Freeman');

-- Interstellar Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Tom Hanks' THEN 'Cooper'
    WHEN 'Natalie Portman' THEN 'Brand'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Interstellar' 
  AND c.cast_name IN ('Tom Hanks', 'Natalie Portman');

-- Pulp Fiction Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Samuel L. Jackson' THEN 'Jules Winnfield'
    WHEN 'Brad Pitt' THEN 'Vincent Vega'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Pulp Fiction' 
  AND c.cast_name IN ('Samuel L. Jackson', 'Brad Pitt');

-- Dune Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Scarlett Johansson' THEN 'Paul Atreides'
    WHEN 'Denzel Washington' THEN 'Duke Leto'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Dune' 
  AND c.cast_name IN ('Scarlett Johansson', 'Denzel Washington');

-- Barbie Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Margot Robbie' THEN 'Barbie'
    WHEN 'Emma Stone' THEN 'Ken'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Barbie' 
  AND c.cast_name IN ('Margot Robbie', 'Emma Stone');

-- Avatar Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Natalie Portman' THEN 'Jake Sully'
    WHEN 'Scarlett Johansson' THEN 'Neytiri'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Avatar' 
  AND c.cast_name IN ('Natalie Portman', 'Scarlett Johansson');

-- The Grand Budapest Hotel Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Brad Pitt' THEN 'M. Gustave'
    WHEN 'Cate Blanchett' THEN 'Zero Moustafa'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Grand Budapest Hotel' 
  AND c.cast_name IN ('Brad Pitt', 'Cate Blanchett');

-- The Shawshank Redemption Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Morgan Freeman' THEN 'Ellis Boyd "Red" Redding'
    WHEN 'Tom Hanks' THEN 'Andy Dufresne'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Shawshank Redemption' 
  AND c.cast_name IN ('Morgan Freeman', 'Tom Hanks');

-- Gladiator Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Denzel Washington' THEN 'Maximus Decimus Meridius'
    WHEN 'Cate Blanchett' THEN 'Commodus'
  END as role_name
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Gladiator' 
  AND c.cast_name IN ('Denzel Washington', 'Cate Blanchett');

-- Fight Club Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Brad Pitt' THEN 'Tyler Durden'
    WHEN 'Jake Gyllenhaal' THEN 'The Narrator'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Fight Club'
  AND c.cast_name IN ('Brad Pitt', 'Jake Gyllenhaal');

-- Parasite Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Tilda Swinton' THEN 'Yeon-kyo'
    WHEN 'Timothée Chalamet' THEN 'Kim Ki-woo'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Parasite'
  AND c.cast_name IN ('Tilda Swinton', 'Timothée Chalamet');

-- The Shape of Water Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Amy Adams' THEN 'Elisa Esposito'
    WHEN 'Idris Elba' THEN 'Richard Strickland'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Shape of Water'
  AND c.cast_name IN ('Amy Adams', 'Idris Elba');

-- Gravity Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Anne Hathaway' THEN 'Dr. Ryan Stone'
    WHEN 'Matt Damon' THEN 'Matt Kowalski'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Gravity'
  AND c.cast_name IN ('Anne Hathaway', 'Matt Damon');

-- The Hurt Locker Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Michael Fassbender' THEN 'Will James'
    WHEN 'Jessica Chastain' THEN 'Sgt. Sanborn'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Hurt Locker'
  AND c.cast_name IN ('Michael Fassbender', 'Jessica Chastain');

-- The Matrix Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Keanu Reeves' THEN 'Neo'
    WHEN 'Carrie-Anne Moss' THEN 'Trinity'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'The Matrix'
  AND c.cast_name IN ('Keanu Reeves', 'Carrie-Anne Moss');

-- Life of Pi Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Timothée Chalamet' THEN 'Pi Patel'
    WHEN 'Tilda Swinton' THEN 'Gita Patel'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Life of Pi'
  AND c.cast_name IN ('Timothée Chalamet', 'Tilda Swinton');

-- Princess Mononoke Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Amy Adams' THEN 'San'
    WHEN 'Ryan Gosling' THEN 'Ashitaka'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Princess Mononoke'
  AND c.cast_name IN ('Amy Adams', 'Ryan Gosling');

-- Seven Samurai Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Hugh Jackman' THEN 'Kikuchiyo'
    WHEN 'Idris Elba' THEN 'Kambei Shimada'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = 'Seven Samurai'
  AND c.cast_name IN ('Hugh Jackman', 'Idris Elba');

-- 300 Cast
INSERT INTO movie_cast (movie_id, cast_id, role_name)
SELECT 
  m.movie_id,
  c.cast_id,
  CASE c.cast_name
    WHEN 'Michael Fassbender' THEN 'Stelios'
    WHEN 'Joaquin Phoenix' THEN 'Xerxes'
  END
FROM movie m
CROSS JOIN cast_member c
WHERE m.title = '300'
  AND c.cast_name IN ('Michael Fassbender', 'Joaquin Phoenix');



DO $$
BEGIN
  RAISE NOTICE '✅ Sample data inserted successfully!';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '   - Genres: 10';
  RAISE NOTICE '   - Directors: 10';
  RAISE NOTICE '   - Cast Members: 15';
  RAISE NOTICE '   - Movies: 10';
  RAISE NOTICE '   - Movie-Genre Relations: Created';
  RAISE NOTICE '   - Movie-Cast Relations: Created';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 You can now test the application with real movie data!';
END $$;

