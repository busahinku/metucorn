-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE party_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'paypal', 'wallet');

-- Client table (client_idye supabase auth baglanicak)
CREATE TABLE client (
    client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin table
-- bool is admin varken tablo oluşturmamız bomboş iş oldu. ama yaparken çalışıp çalışamayacağını bilmioduk
CREATE TABLE admin (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Director table
CREATE TABLE director (
    director_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    director_name VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Genre table
CREATE TABLE genre (
    genre_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cast member table
CREATE TABLE cast_member (
    cast_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cast_name VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Movie table
CREATE TABLE movie (
    movie_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    director_id UUID REFERENCES director(director_id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    age_rating VARCHAR(10),
    description TEXT,
    synopsis TEXT,
    duration_time INTEGER, -- e.g. 1231 minutes
    release_date DATE,
    poster_image TEXT,
    header_image TEXT,
    banner_text TEXT,
    trailer_link TEXT,
    yt_link TEXT, -- bu aslinda film linki ama youtube embed baya kötüymüş vimeo linkleri var o yuzden
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Movie-Genre junction table
CREATE TABLE movie_genre (
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genre(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- Movie-Cast junction table
CREATE TABLE movie_cast (
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    cast_id UUID REFERENCES cast_member(cast_id) ON DELETE CASCADE,
    role_name VARCHAR(255), --  ted mosby
    PRIMARY KEY (movie_id, cast_id)
);

-- Watch party table
CREATE TABLE watch_party (
    party_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID REFERENCES client(client_id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    party_code VARCHAR(20) UNIQUE NOT NULL,
    status party_status DEFAULT 'scheduled',
    max_participants INTEGER DEFAULT 50,
    end_time TIMESTAMP WITH TIME ZONE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Party participants junction table
CREATE TABLE party_participant (
    participant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID REFERENCES watch_party(party_id) ON DELETE CASCADE,
    client_id UUID REFERENCES client(client_id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(party_id, client_id)
);

-- Ticket table
CREATE TABLE ticket (
    ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client(client_id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    party_id UUID REFERENCES watch_party(party_id) ON DELETE SET NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    access_code VARCHAR(50) UNIQUE NOT NULL,
    show_time TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment table
CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES ticket(ticket_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method payment_method NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status payment_status DEFAULT 'completed',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Watch history table
CREATE TABLE watch_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client(client_id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    watch_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER, -- in seconds
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rating table
CREATE TABLE rating (
    rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client(client_id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movie(movie_id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, movie_id)
);





