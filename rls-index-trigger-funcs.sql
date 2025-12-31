----------------------------------------------------------
----------------------------------------------------------
-- THIS FILE HANDLED AND CREATED BY AI, AI MADE SOME MISTAKES IN THIS FILE
-- AND AI AGAIN MADE SOME ARRANGEMENTS TO FIX THE MISTAKES.
----------------------------------------------------------
----------------------------------------------------------
-- Create indexes for performance
CREATE INDEX idx_client_user_id ON client(user_id);
CREATE INDEX idx_movie_director ON movie(director_id);
CREATE INDEX idx_movie_status ON movie(status);
CREATE INDEX idx_watch_party_host ON watch_party(host_id);
CREATE INDEX idx_watch_party_movie ON watch_party(movie_id);
CREATE INDEX idx_watch_party_status ON watch_party(status);
CREATE INDEX idx_watch_party_scheduled ON watch_party(scheduled_time);
CREATE INDEX idx_ticket_client ON ticket(client_id);
CREATE INDEX idx_ticket_movie ON ticket(movie_id);
CREATE INDEX idx_ticket_party ON ticket(party_id);
CREATE INDEX idx_payment_ticket ON payment(ticket_id);
CREATE INDEX idx_watch_history_client ON watch_history(client_id);
CREATE INDEX idx_rating_movie ON rating(movie_id);
CREATE INDEX idx_party_participant_party ON party_participant(party_id);
CREATE INDEX idx_party_participant_client ON party_participant(client_id);

-- Unique constraint to prevent duplicate tickets
CREATE UNIQUE INDEX idx_ticket_unique_client_movie 
ON ticket(client_id, movie_id) 
WHERE is_active = true;

--  Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

--  Create triggers for updated_at
CREATE TRIGGER update_client_updated_at BEFORE UPDATE ON client
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movie_updated_at BEFORE UPDATE ON movie
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watch_party_updated_at BEFORE UPDATE ON watch_party
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rating_updated_at BEFORE UPDATE ON rating
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--  Row Level Security (RLS) Policies
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_party ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_participant ENABLE ROW LEVEL SECURITY;

-- Client can read their own data
CREATE POLICY "Users can view own profile"
    ON client FOR SELECT
    USING (auth.uid() = user_id);

-- Client can update their own data
CREATE POLICY "Users can update own profile"
    ON client FOR UPDATE
    USING (auth.uid() = user_id);

-- Anyone can view movies (public)
ALTER TABLE movie ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view movies"
    ON movie FOR SELECT
    TO authenticated, anon
    USING (true);

-- Watch parties - everyone can view, but only authenticated users can modify
CREATE POLICY "Everyone can view all parties"
    ON watch_party FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create parties"
    ON watch_party FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = host_id));

CREATE POLICY "Hosts can update their parties"
    ON watch_party FOR UPDATE
    TO authenticated
    USING (auth.uid() = (SELECT user_id FROM client WHERE client_id = host_id));

-- Tickets - users can only see their own
CREATE POLICY "Users can view own tickets"
    ON ticket FOR SELECT
    TO authenticated
    USING (auth.uid() = (SELECT user_id FROM client WHERE client_id = ticket.client_id));

-- Users can purchase tickets
CREATE POLICY "Users can purchase tickets"
    ON ticket FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = ticket.client_id));

-- Payment - users can view their own payments
CREATE POLICY "Users can view own payments"
    ON payment FOR SELECT
    TO authenticated
    USING (auth.uid() = (SELECT user_id FROM client WHERE client_id = (SELECT client_id FROM ticket WHERE ticket_id = payment.ticket_id)));

-- Users can create payments for their own tickets
CREATE POLICY "Users can create payments"
    ON payment FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = (SELECT client_id FROM ticket WHERE ticket_id = payment.ticket_id)));

-- Party participants
CREATE POLICY "Users can view party participants"
    ON party_participant FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can join parties"
    ON party_participant FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = party_participant.client_id));

-- Watch history policies
CREATE POLICY "Users can view own watch history"
    ON watch_history FOR SELECT
    TO authenticated
    USING (auth.uid() = (SELECT user_id FROM client WHERE client_id = watch_history.client_id));

CREATE POLICY "Users can create watch history"
    ON watch_history FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = watch_history.client_id));

-- Rating policies
CREATE POLICY "Users can view all ratings"
    ON rating FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create own ratings"
    ON rating FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = (SELECT user_id FROM client WHERE client_id = rating.client_id));

CREATE POLICY "Users can update own ratings"
    ON rating FOR UPDATE
    TO authenticated
    USING (auth.uid() = (SELECT user_id FROM client WHERE client_id = rating.client_id));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.client (user_id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to generate party code
CREATE OR REPLACE FUNCTION generate_party_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

--  Helper function to generate access code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TKT-' || upper(substring(gen_random_uuid()::text, 1, 8));
END;
$$ LANGUAGE plpgsql;