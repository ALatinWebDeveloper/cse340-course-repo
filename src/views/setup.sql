/*Week 1*/
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

/*Week 2*/
CREATE TABLE projects (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER      NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    location        VARCHAR(255),
    event_date      DATE,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id)
        ON DELETE CASCADE
);

INSERT INTO projects (organization_id, title, description, location, event_date) VALUES
(1, 'Community Garden Build',       'Constructing raised garden beds for the local community center.', 'City Park', '2026-03-15'),
(1, 'School Renovation Day',        'Painting and repairing classrooms at Lincoln Elementary.', 'Lincoln Elementary', '2026-04-22'),
(1, 'Playground Assembly',          'Assembling new playground equipment for the neighborhood park.', 'Elm Street Park', '2026-05-10'),
(1, 'Safe Ramp Installation',       'Building wheelchair ramps for elderly residents in need.', 'Various Homes', '2026-06-01'),
(1, 'Habitat Home Build',           'Helping Habitat for Humanity build a new home.', 'Oak Subdivision', '2026-07-19');

INSERT INTO projects (organization_id, title, description, location, event_date) VALUES
(2, 'Urban Farm Planting Day',      'Planting seedlings at the downtown urban farm.', 'Downtown Community Farm', '2026-03-22'),
(2, 'Farmers Market Setup',         'Setting up and staffing the weekly farmers market.', 'City Square', '2026-04-05'),
(2, 'School Garden Workshop',       'Teaching students how to start their own vegetable garden.', 'Roosevelt High School', '2026-04-15'),
(2, 'Composting 101 Seminar',       'Free public workshop on composting techniques.', 'Public Library Auditorium', '2026-05-01'),
(2, 'Harvest Food Drive',           'Collecting and distributing fresh produce to food banks.', 'Various Locations', '2026-09-12');

INSERT INTO projects (organization_id, title, description, location, event_date) VALUES
(3, 'Senior Center Social',         'Organizing games, music, and lunch for the local senior center.', 'Sunrise Senior Center', '2026-03-30'),
(3, 'Clothing Drive & Sorting',     'Collecting and sorting donated clothes for the homeless shelter.', 'Community Church Hall', '2026-04-12'),
(3, 'Youth Mentoring Kickoff',      'Launching a new youth mentoring program with training sessions.', 'YMCA', '2026-05-20'),
(3, 'Beach Clean-Up',               'Volunteer day to clean up litter along the shoreline.', 'Pebble Beach', '2026-06-08'),
(3, 'Holiday Meal Packing',         'Packing holiday meal boxes for families in need.', 'UnityServe Warehouse', '2026-12-10');