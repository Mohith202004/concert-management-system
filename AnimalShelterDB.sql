-- Create Pet table
CREATE TABLE Pet (
    pet_id INT PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT CHECK (age >= 0),
    weight DECIMAL(5, 2) CHECK (weight > 0),
    health_condition VARCHAR(20) CHECK (health_condition IN ('Good', 'Fair', 'Poor', 'Needs Vaccination', 'Underweight')),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Adopted', 'In Review', 'High Demand')),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Adopter table
CREATE TABLE Adopter (
    adopter_id INT PRIMARY KEY NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100)
);

-- Create Adoption_Application table
CREATE TABLE Adoption_Application (
    application_id INT PRIMARY KEY NOT NULL,
    pet_id INT,
    adopter_id INT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    application_date DATE NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id),
    FOREIGN KEY (adopter_id) REFERENCES Adopter(adopter_id)
);

-- Create Adoption_Record table
CREATE TABLE Adoption_Record (
    adoption_id INT PRIMARY KEY NOT NULL,
    pet_id INT,
    adopter_id INT,
    adoption_date DATE NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id),
    FOREIGN KEY (adopter_id) REFERENCES Adopter(adopter_id)
);

-- Create Volunteer table
CREATE TABLE Volunteer (
    volunteer_id INT PRIMARY KEY NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100),
    skills VARCHAR(255),
    availability VARCHAR(20) CHECK (availability IN ('Weekdays', 'Weekends', 'Flexible')),
    last_assigned_date DATE DEFAULT NULL
);

-- Create Volunteer_Schedule table
CREATE TABLE Volunteer_Schedule (
    schedule_id INT PRIMARY KEY NOT NULL,
    volunteer_id INT,
    shift_date DATE NOT NULL,
    task_description VARCHAR(255),
    FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id)
);

-- Create Volunteer_Audit table
CREATE TABLE Volunteer_Audit (
    audit_id INT PRIMARY KEY NOT NULL,
    volunteer_id INT,
    shift_date DATE NOT NULL,
    update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id)
);
-- Insert sample data into Pet table
INSERT INTO Pet VALUES
(1, 'Buddy', 'Golden Retriever', 3, 25.50, 'Good', 'Available', CURRENT_TIMESTAMP),
(2, 'Mittens', 'Tabby Cat', 2, 4.30, 'Fair', 'Available', CURRENT_TIMESTAMP),
(3, 'Chirpy', 'Parrot', 1, 0.75, 'Needs Vaccination', 'In Review', CURRENT_TIMESTAMP),
(4, 'BunBun', 'Rabbit', 1, 1.20, 'Underweight', 'High Demand', CURRENT_TIMESTAMP),
(5, 'Max', 'Bulldog', 4, 20.00, 'Poor', 'Adopted', CURRENT_TIMESTAMP);

-- Insert sample data into Adopter table
INSERT INTO Adopter VALUES
(1, 'John Doe', 'john.doe@example.com'),
(2, 'Jane Smith', 'jane.smith@example.com'),
(3, 'Michael Brown', 'michael.brown@example.com'),
(4, 'Anna White', 'anna.white@example.com'),
(5, 'Tom Black', 'tom.black@example.com');

-- Insert sample data into Adoption_Application table
INSERT INTO Adoption_Application VALUES
(1, 1, 1, 'Pending', '2024-11-01'),
(2, 2, 2, 'Approved', '2024-11-02'),
(3, 3, 3, 'Rejected', '2024-11-03'),
(4, 4, 4, 'Pending', '2024-11-04'),
(5, 5, 5, 'Approved', '2024-11-05');

-- Insert sample data into Adoption_Record table
INSERT INTO Adoption_Record VALUES
(1, 1, 1, '2024-11-10'),
(2, 5, 5, '2024-11-15');

-- Insert sample data into Volunteer table
INSERT INTO Volunteer VALUES
(1, 'Alex Johnson', 'alex.johnson@example.com', 'Animal care, First aid', 'Flexible', NULL),
(2, 'Sara Lee', 'sara.lee@example.com', 'Grooming, Handling', 'Weekends', NULL),
(3, 'Peter Parker', 'peter.parker@example.com', 'Event management', 'Weekdays', NULL),
(4, 'Emily Clark', 'emily.clark@example.com', 'Feeding, Training', 'Flexible', NULL),
(5, 'Robert Miles', 'robert.miles@example.com', 'Grooming', 'Weekends', NULL);

-- Insert sample data into Volunteer_Schedule table
INSERT INTO Volunteer_Schedule VALUES
(1, 1, '2024-11-20', 'Feeding the animals'),
(2, 2, '2024-11-21', 'Grooming the cats'),
(3, 3, '2024-11-22', 'Organizing adoption event'),
(4, 4, '2024-11-23', 'Training the dogs'),
(5, 5, '2024-11-24', 'Grooming the dogs');

-- Insert sample data into Volunteer_Audit table
INSERT INTO Volunteer_Audit VALUES
(1, 1, '2024-11-20', CURRENT_TIMESTAMP),
(2, 2, '2024-11-21', CURRENT_TIMESTAMP),
(3, 3, '2024-11-22', CURRENT_TIMESTAMP),
(4, 4, '2024-11-23', CURRENT_TIMESTAMP),
(5, 5, '2024-11-24', CURRENT_TIMESTAMP);

DELIMITER //




CREATE TRIGGER update_status_based_on_health
BEFORE UPDATE ON Pet
FOR EACH ROW
BEGIN
    -- Check if the health_condition has changed
    IF NEW.health_condition != OLD.health_condition THEN
        -- Update the status based on the new health condition
        IF NEW.health_condition IN ('Underweight', 'Poor') THEN
            SET NEW.status = 'Not Available';
        ELSEIF NEW.health_condition = 'Good' THEN
            SET NEW.status = 'Available';
        END IF;

        -- Debug message (optional, for testing)
        SELECT 'Trigger executed, status updated';

        -- Update the last_updated timestamp
        SET NEW.last_updated = CURRENT_TIMESTAMP;
    END IF;
END;
//

DELIMITER ;
UPDATE Pet SET health_condition = 'Poor' WHERE pet_id = 1;
SELECT * FROM Pet WHERE pet_id = 1;
UPDATE Pet SET health_condition = 'Good' WHERE pet_id = 1;
SELECT * FROM Pet WHERE pet_id = 1;


WITH RECURSIVE AdoptionAttempts AS (
      -- Base case: Select the first adoption attempt for each pet
         SELECT aa.application_id, aa.pet_id, p.name, aa.application_date AS adoption_date, 1 AS attempt_number
         FROM Adoption_Application aa
         JOIN Pet p ON aa.pet_id = p.pet_id
      WHERE aa.pet_id IN (
            SELECT pet_id
            FROM Adoption_Application
             GROUP BY pet_id
             HAVING COUNT(*) > 1
         )
        UNION ALL
        -- Recursive case: Select subsequent adoption attempts for each pet
       SELECT aa.application_id, aa.pet_id, p.name, aa.application_date AS adoption_date, at.attempt_number + 1
         FROM Adoption_Application aa
        JOIN Pet p ON aa.pet_id = p.pet_id
         JOIN AdoptionAttempts at ON aa.pet_id = at.pet_id
         WHERE aa.application_date > at.adoption_date
    )
     -- Final select: Retrieve all adoption attempts for pets with multiple attempts
     SELECT pet_id, name, adoption_date, attempt_number
     FROM (
         SELECT pet_id, name, adoption_date, attempt_number,
                ROW_NUMBER() OVER (PARTITION BY pet_id, attempt_number ORDER BY adoption_date) AS rn
         FROM AdoptionAttempts
     ) AS numbered_attempts
     WHERE rn = 1
     ORDER BY pet_id, attempt_number, adoption_date;




DELIMITER $$

CREATE PROCEDURE update_vaccination_status()
     BEGIN
         DECLARE total_updated INT DEFAULT 0;
    
         -- Update health_condition for pets due for vaccination and update the last_updated timestamp
         UPDATE Pet
		SET health_condition = 'Needs Vaccination',
             last_updated = CURRENT_DATE
        WHERE last_updated < CURDATE() - INTERVAL 6 MONTH;
   
         -- Count how many pets were updated
        SELECT ROW_COUNT() INTO total_updated;
   
       -- Return the total number of pets updated
        SELECT total_updated AS pets_updated;
    
   END$$



DELIMITER ;
CALL update_vaccination_status();




INSERT INTO Pet (pet_id, name, breed, age, weight, health_condition, status, last_updated)
VALUES
(6, 'Bella', 'Labrador', 2, 20.00, 'Good', 'Available', CURRENT_TIMESTAMP),
(7, 'Charlie', 'Beagle', 1, 9.50, 'Needs Vaccination', 'In Review', CURRENT_TIMESTAMP),
(8, 'Maximus', 'German Shepherd', 4, 30.00, 'Fair', 'Available', CURRENT_TIMESTAMP);

DELIMITER //

CREATE FUNCTION calculate_popularity_score(breed VARCHAR(50), age INT, pending_applications INT)
     RETURNS INT
    DETERMINISTIC
    BEGIN
        DECLARE popularity_score INT DEFAULT 50;
   
         -- Check for popular breeds
        IF breed IN ('Labrador', 'Beagle', 'German Shepherd') THEN
          SET popularity_score = popularity_score + 20;
       END IF;
   
        -- Check for young pets (age less than 3 years)
        IF age < 3 THEN
         SET popularity_score = popularity_score + 10;
        END IF;
   
        -- Add points for each pending adoption application
       SET popularity_score = popularity_score + (pending_applications * 5);
    
      -- Return the final popularity score
        RETURN popularity_score;
     END //

DELIMITER ;
SELECT calculate_popularity_score('Labrador', 2, 2) AS popularity_score;
SELECT calculate_popularity_score('Beagle', 1, 3) AS popularity_score;
SELECT calculate_popularity_score('German Shepherd', 4, 1) AS popularity_score;
