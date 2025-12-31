-- Generate 500 Users with Random Activity
-- All dates are MAX 24 days ago (no activity today)
-- Account created → Ticket purchase → Watch → Review → Party (in chronological order)

DO $$
DECLARE
    f_names TEXT[] := ARRAY[
      'Ahmet','Mehmet','Ayşe','Fatma','Mustafa','Hüseyin','Emre','Elif','Zeynep','Merve',
      'Burak','Can','Deniz','Ece','Yusuf','Ömer','Ali','Kemal','Gamze','Selin',
      'Berk','Seda','Hakan','Gökhan','Cem','Nazlı','Tuğçe','Onur','Melisa','İrem',
      'Cansu','Serkan','Rabia','Halil','Hatice','Sinem','Buse','Furkan','Batuhan','Dilara',
      'Hasan','İbrahim','Enes','Kaan','Umut','Mert','Bora','Eren','Tolga','Koray',
      'Volkan','Yunus','Samet','Talha','Baran','Kubilay','Kutay','Arda','Tuna','Çağrı',
      'Berat','Sarp','Egemen','Oğuz','Levent','Alper','Nihat','Rıza','Taner','Cihan',
      'Beyza','Derya','Hülya','Nisa','İlayda','Belgin','Gizem','Nehir','Esra','Nur',
      'Şeyma','Hacer','Mihriban','Sevgi','Zeliha','Gül','Rana','Ayça','Elvan','Yaren',
      'Berfin','Zuhal','Ayşegül','Şule','Nil','Selma','Mina','Aylin','Yasemin','Nermin'
    ];
    l_names TEXT[] := ARRAY[
      'Yılmaz','Demir','Şahin','Çelik','Yıldız','Aydın','Arslan','Doğan','Kılıç','Öztürk',
      'Kara','Yavuz','Koç','Kaplan','Polat','Korkmaz','Eren','Aksoy','Taş','Bulut',
      'Bozkurt','Kurt','Erdoğan','Keskin','Karaca','Uzun','Işık','Güneş','Toprak','Saygın',
      'Tekin','Bayraktar','Altun','Duman','Şimşek','Candan','Ergin','Ersoy','Gündüz','Güler',
      'Kaya','Özdemir','Kocabaş','Yurttaş','Demirtaş','Karataş','Çakır','Özkan','Sezer','Özcan',
      'Türkmen','Özer','Karaman','Turan','Uzunoglu','Özbay','Özden','Yurt','Altay','Akgün',
      'Bilgin','Gürbüz','Kapucu','Koçak','Önal','Aksu','Sarı','Köse','Yalçın','Tok',
      'Sözen','Karasu','Ateş','Çağlar','Baran','Boz','Dinç','Altunbaş','Güner','Şeker',
      'Ulusoy','Erbil','Kırlangıç','Erden','Aktaş','Başak','Savaş','Tosun','Kantarcı','Güclü', 
      'Pancaroglu', 'Turac', 'Kucuk', 'Isgor', 'Akbarli'
    ];
    
    v_client_id UUID;
    v_movie RECORD;
    v_ticket_id UUID;
    v_party_id UUID;
    
    -- Date boundaries: All dates must be at least 1 day ago (not today)
    -- Today is December 24, 2025
    v_today_start TIMESTAMP WITH TIME ZONE := '2025-12-24 00:00:00+00'::TIMESTAMP WITH TIME ZONE;
    v_yesterday_end TIMESTAMP WITH TIME ZONE := v_today_start - INTERVAL '1 second';
    v_24_days_ago_start TIMESTAMP WITH TIME ZONE := v_today_start - INTERVAL '24 days';
    
    v_account_created TIMESTAMP WITH TIME ZONE;
    v_purchase_date TIMESTAMP WITH TIME ZONE;
    v_watch_date TIMESTAMP WITH TIME ZONE;
    v_review_date TIMESTAMP WITH TIME ZONE;
    v_party_created TIMESTAMP WITH TIME ZONE;
    v_party_scheduled TIMESTAMP WITH TIME ZONE;
    
    v_target_hour INTEGER;
    v_hour_weight FLOAT;
    v_score INTEGER;
    v_tens_count INTEGER := 0;
    v_random_days INTEGER;
    v_party_code TEXT;
    v_other_client_id UUID;
    v_join_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Step 0.0: Set random seed for true randomness (different each run)
    -- Use microsecond precision for better variation
    PERFORM setseed((EXTRACT(MICROSECONDS FROM clock_timestamp())::bigint % 1000000)::numeric / 1000000.0);
    
    -- Step 1.0: Clear existing data
    TRUNCATE client, ticket, payment, watch_history, rating, party_participant, watch_party CASCADE;

    -- Step 2.0: Generate 100 users
    FOR i IN 1..100 LOOP
        -- Account created: Random day between 24 days ago and yesterday (not today)
        -- Use integer days for better distribution
        v_random_days := floor(random() * 24)::INTEGER; -- 0 to 23 days ago
        v_account_created := v_today_start - (v_random_days * INTERVAL '1 day') - (random() * INTERVAL '23 hours 59 minutes 59 seconds');
        
        -- Ensure it's not today
        IF v_account_created >= v_today_start THEN
            v_account_created := v_yesterday_end - (random() * INTERVAL '23 hours 59 minutes 59 seconds');
        END IF;
        
        -- Insert client
        INSERT INTO client (name, email, created_at)
        VALUES (
            f_names[floor(random() * array_length(f_names, 1) + 1)] || ' ' || 
            l_names[floor(random() * array_length(l_names, 1) + 1)], 
            'user' || i || '@metucinema.com', 
            v_account_created
        ) 
        RETURNING client_id INTO v_client_id;

        -- Step 3.0: Each user buys 3-7 random movies
        v_random_days := floor(random() * 5 + 3)::INTEGER; -- 3 to 7 movies (inclusive)
        
        -- Always proceed (every user buys at least 3 movies)
            FOR v_movie IN (
                SELECT movie_id, price 
                FROM movie 
                ORDER BY random() 
                LIMIT v_random_days
            ) LOOP
            -- Purchase date: After account creation, but before today
            -- Random between account_created and yesterday_end
            v_purchase_date := v_account_created + (random() * (v_yesterday_end - v_account_created));
            
            -- Ensure purchase_date is not today
            IF v_purchase_date >= v_today_start THEN
                v_purchase_date := v_yesterday_end - (random() * INTERVAL '12 hours');
            END IF;
            
            -- Insert ticket (set both purchase_date and created_at to avoid default CURRENT_TIMESTAMP)
            INSERT INTO ticket (client_id, movie_id, price, access_code, purchase_date, created_at)
            VALUES (
                v_client_id, 
                v_movie.movie_id, 
                v_movie.price, 
                'QR-' || upper(substring(gen_random_uuid()::text, 1, 8)), 
                v_purchase_date,
                v_purchase_date  -- Set created_at same as purchase_date
            )
            RETURNING ticket_id INTO v_ticket_id;

            -- Step 4.0: Watch date (70% chance to watch)
            IF random() < 0.7 THEN
                -- Watch date: After purchase, but before today
                v_watch_date := v_purchase_date + (random() * (v_yesterday_end - v_purchase_date));
                
                -- Ensure watch_date is not today
                IF v_watch_date >= v_today_start THEN
                    v_watch_date := v_yesterday_end - (random() * INTERVAL '6 hours');
                END IF;

                -- Prime time: 20:00 - 23:00 (75% chance)
                v_hour_weight := random();
                v_target_hour := CASE 
                    WHEN v_hour_weight < 0.75 THEN floor(random() * 4 + 20)::int -- 20, 21, 22, 23
                    WHEN v_hour_weight < 0.90 THEN floor(random() * 8 + 12)::int -- Afternoon/Early Evening (12-19)
                    ELSE floor(random() * 12 + 0)::int                          -- Morning/Late Night (0-11)
                END;
                
                -- Set watch_date with target hour (keep the date, just set time)
                v_watch_date := date_trunc('day', v_watch_date) 
                                + (v_target_hour * INTERVAL '1 hour') 
                                + (floor(random() * 60) * INTERVAL '1 minute');
                
                -- Final check: ensure watch_date is not today
                IF v_watch_date >= v_today_start THEN
                    -- Use yesterday with target hour
                    v_watch_date := (v_today_start - INTERVAL '1 day') 
                                    + (v_target_hour * INTERVAL '1 hour') 
                                    + (floor(random() * 60) * INTERVAL '1 minute');
                END IF;

                -- Insert watch history (set created_at to match watch_date)
                INSERT INTO watch_history (client_id, movie_id, watch_date, completed, created_at)
                VALUES (v_client_id, v_movie.movie_id, v_watch_date, true, v_watch_date);

                -- Step 5.0: Review (80% chance after watching)
                IF random() < 0.8 THEN
                    -- Review date: After watch date, but before today
                    v_review_date := v_watch_date + (random() * (v_yesterday_end - v_watch_date));
                    
                    -- Ensure review_date is not today
                    IF v_review_date >= v_today_start THEN
                        v_review_date := v_yesterday_end - (random() * INTERVAL '6 hours');
                    END IF;

                    -- Weighted scores: Ensures platform avg stays below 9.2
                    v_score := CASE 
                        WHEN v_tens_count < 2 AND random() < 0.001 THEN 10
                        WHEN random() < 0.85 THEN floor(random() * 2 + 8)::int -- 8 or 9
                        ELSE floor(random() * 4 + 4)::int                      -- 4, 5, 6, 7 (The anchors)
                    END;
                    
                    IF v_score = 10 THEN 
                        v_tens_count := v_tens_count + 1; 
                    END IF;
                    
                    -- Insert rating
                    INSERT INTO rating (client_id, movie_id, score, created_at)
                    VALUES (v_client_id, v_movie.movie_id, v_score, v_review_date);
                END IF;
            END IF;
            
            -- Step 6.0: Create watch party (1% chance, only if they watched the movie)
            IF random() < 0.01 AND v_watch_date IS NOT NULL THEN
                -- Party created: After purchase, but before today
                v_party_created := v_purchase_date + (random() * (v_yesterday_end - v_purchase_date));
                
                -- Ensure party_created is not today
                IF v_party_created >= v_today_start THEN
                    v_party_created := v_yesterday_end - (random() * INTERVAL '12 hours');
                END IF;
                
                -- Party scheduled time: Future date (1-14 days from today) so it shows in upcoming parties
                -- This allows parties to be visible in upcoming parties section
                v_random_days := floor(random() * 14 + 1)::INTEGER; -- 1 to 14 days in the future
                v_party_scheduled := v_today_start + (v_random_days * INTERVAL '1 day') + (random() * INTERVAL '23 hours 59 minutes');
                
                -- Set scheduled time to prime time (20:00-23:00) for better UX
                v_target_hour := floor(random() * 4 + 20)::int; -- 20, 21, 22, 23
                v_party_scheduled := date_trunc('day', v_party_scheduled) 
                                    + (v_target_hour * INTERVAL '1 hour') 
                                    + (floor(random() * 60) * INTERVAL '1 minute');
                
                -- Generate unique party code
                v_party_code := upper(substring(gen_random_uuid()::text, 1, 8));
                
                -- Insert watch party
                INSERT INTO watch_party (
                    host_id, 
                    movie_id, 
                    scheduled_time, 
                    party_code, 
                    status, 
                    max_participants,
                    created_at
                )
                VALUES (
                    v_client_id,
                    v_movie.movie_id,
                    v_party_scheduled,
                    v_party_code,
                    'scheduled'::party_status,  -- All parties are scheduled (future dates)
                    floor(random() * 30 + 10)::INTEGER, -- 10-40 participants
                    v_party_created
                )
                RETURNING party_id INTO v_party_id;
                
                -- Auto-join host
                INSERT INTO party_participant (party_id, client_id, joined_at)
                VALUES (v_party_id, v_client_id, v_party_created)
                ON CONFLICT DO NOTHING;
                
                -- Some other users might join (30% chance per potential participant, 1-5 participants)
                FOR j IN 1..floor(random() * 5 + 1) LOOP
                    IF random() < 0.3 THEN
                        -- Find a random client who has a ticket for this movie
                        SELECT t.client_id INTO v_other_client_id
                        FROM ticket t
                        WHERE t.movie_id = v_movie.movie_id
                          AND t.client_id != v_client_id
                          AND NOT EXISTS (
                              SELECT 1 FROM party_participant pp 
                              WHERE pp.party_id = v_party_id AND pp.client_id = t.client_id
                          )
                        ORDER BY random()
                        LIMIT 1;
                        
                        IF v_other_client_id IS NOT NULL THEN
                            v_join_date := v_party_created + (random() * (v_yesterday_end - v_party_created));
                            IF v_join_date >= v_today_start THEN
                                v_join_date := v_yesterday_end - (random() * INTERVAL '6 hours');
                            END IF;
                            
                            INSERT INTO party_participant (party_id, client_id, joined_at)
                            VALUES (v_party_id, v_other_client_id, v_join_date)
                            ON CONFLICT DO NOTHING;
                    END IF;
                END IF;
                END LOOP;
            END IF;
            END LOOP;  -- End of movie loop (FOR v_movie)
    END LOOP;  -- End of user loop (FOR i IN 1..100)
    
    -- Step 7.0: Create payments for all tickets (set created_at to match payment_date)
    INSERT INTO payment (ticket_id, amount, method, payment_date, status, transaction_id, created_at)
    SELECT 
        t.ticket_id,
        t.price,
        CASE floor(random() * 3)::int
            WHEN 0 THEN 'credit_card'
            WHEN 1 THEN 'debit_card'
            ELSE 'paypal'
        END::payment_method,
        t.purchase_date,
        'completed',
        'TXN-' || upper(substring(gen_random_uuid()::text, 1, 12)),
        t.purchase_date  -- Set created_at same as payment_date
    FROM ticket t;
    
    RAISE NOTICE '✅ Generated 100 users with random activity!';
    RAISE NOTICE '📊 All dates are between 24 days ago and yesterday (NO activity today)';
    RAISE NOTICE '   - Account created → Ticket purchase → Watch → Review → Party (chronological order)';
    RAISE NOTICE '   - ~1%% of users create watch parties (scheduled for future, visible in upcoming parties)';
    RAISE NOTICE '   - Activity distributed across all 24 days';
    RAISE NOTICE '   - All created_at fields match their respective dates';
END $$;

