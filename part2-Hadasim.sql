-- Create the Person table
CREATE TABLE Person (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(25) NOT NULL,
    Family_Name VARCHAR(50) NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Father_Id INT NULL,
    Mother_Id INT NULL,
    Spouse_Id INT NULL,
    FOREIGN KEY (Father_Id) REFERENCES Person(Person_Id) ON DELETE SET NULL,
    FOREIGN KEY (Mother_Id) REFERENCES Person(Person_Id) ON DELETE SET NULL,
    FOREIGN KEY (Spouse_Id) REFERENCES Person(Person_Id) ON DELETE SET NULL,
    CHECK (Spouse_Id IS NULL OR Spouse_Id <> Person_Id)
);

-- Create the Family_Tree table
CREATE TABLE Family_Tree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(16) NOT NULL,
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    FOREIGN KEY (Person_Id) REFERENCES Person(Person_Id) ON DELETE CASCADE,
    FOREIGN KEY (Relative_Id) REFERENCES Person(Person_Id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO Person (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, 'Michael', 'Johnson', 'Male', NULL, NULL, 2),
(2, 'Emily',   'Johnson', 'Female', NULL, NULL, 1),
(3, 'Daniel',  'Smith',   'Male', NULL, NULL, 4),
(4, 'Sophia',  'Smith',   'Female', NULL, NULL, 3),
(5, 'Moshe',   'Johnson', 'Male', 1, 2, NULL),
(6, 'Yona',    'Smith',   'Female', 3, 4, NULL);

-- Insert 'father' relationships
INSERT INTO Family_Tree
SELECT Person_Id, Father_Id, 'father'
FROM Person
WHERE Father_Id IS NOT NULL;

-- Insert 'mother' relationships
INSERT INTO Family_Tree
SELECT Person_Id, Mother_Id, 'mother'
FROM Person
WHERE Mother_Id IS NOT NULL;

-- Insert 'sibling' relationships (based on shared parents)
INSERT INTO Family_Tree
SELECT p1.Person_Id, p2.Person_Id, 'sibling'
FROM Person p1
JOIN Person p2
  ON p1.Mother_Id = p2.Mother_Id
 AND p1.Father_Id = p2.Father_Id
 AND p1.Person_Id <> p2.Person_Id
WHERE p1.Mother_Id IS NOT NULL AND p1.Father_Id IS NOT NULL;

-- Insert 'child' relationships
INSERT INTO Family_Tree
SELECT Person_Id, Father_Id, 'child'
FROM Person
WHERE Father_Id IS NOT NULL
UNION
SELECT Person_Id, Mother_Id, 'child'
FROM Person
WHERE Mother_Id IS NOT NULL;

-- Insert 'spouse' relationships (one direction)
INSERT INTO Family_Tree
SELECT Person_Id, Spouse_Id, 'spouse'
FROM Person
WHERE Spouse_Id IS NOT NULL;

-- Exercise 2: Ensure symmetric 'spouse' in Family_Tree
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT p.Spouse_Id, p.Person_Id, 'spouse'
FROM Person p
LEFT JOIN Family_Tree ft
  ON p.Spouse_Id = ft.Person_Id AND p.Person_Id = ft.Relative_Id AND ft.Connection_Type = 'spouse'
WHERE p.Spouse_Id IS NOT NULL AND ft.Person_Id IS NULL;

-- Exercise 2: Ensure symmetric Spouse_Id in Person table
UPDATE Person p1
JOIN Person p2 ON p1.Spouse_Id = p2.Person_Id
SET p2.Spouse_Id = p1.Person_Id
WHERE p2.Spouse_Id IS NULL;

-- Final note:
-- Only 'spouse' relationships were made symmetric, as explicitly required by the exercise.
-- All other relationships (parent, child, sibling) remain one-directional, according to the spec.
-- However, these can be extended to bidirectional connections if needed for easier querying.
