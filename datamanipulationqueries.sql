/*INSERT individual entry*/
INSERT INTO realms (name)
VALUES (?);

INSERT INTO planets (name, realm)
VALUES (?, ?);

INSERT INTO alignment (alignment)
VALUES (?);

INSERT INTO characters (name, homeplanet, alignment)
VALUES (?, ?, ?);

INSERT INTO weapons (name, description, wielder)
VALUES (?, ?, ?);

INSERT INTO powers (name, description)
VALUES (?, ?);

INSERT INTO characters_powers (cid, pid)
VALUES (?, ?);


/*SELECT to display content or filter options*/
/*Show characters with planet, weapons, alignment and powers attached*/
SELECT C.name, H.name, P.name, A.alignment FROM characters C
INNER JOIN characters_powers CP ON CP.cid = C.id
INNER JOIN powers P ON P.id = CP.pid
INNER JOIN planets H ON H.id = C.homeplanet
INNER JOIN alignment A ON A.id = C.alignment
ORDER BY C.name ASC;

/*Show planets with realm attached*/
SELECT P.name, R.name FROM planets P
INNER JOIN realms R ON R.id = P.realm
ORDER BY P.name ASC;

/*List powers*/
SELECT name, description FROM powers
ORDER BY name ASC;

/*List weapons*/
SELECT name, description FROM weapons
ORDER BY name ASC;

/*List realms*/
SELECT name FROM realms
ORDER BY name ASC;


/*DELETE one entity*/
/*Delete character by name*/
DELETE FROM characters
WHERE name='?';

/*Delete planet by name*/
DELETE FROM planets
WHERE name='?';

/*Delete realm by name*/
DELETE FROM realms
WHERE name='?';

/*Delete weapon by name*/
DELETE FROM weapons
WHERE name='?';

/*Delete power by name*/
DELETE FROM powers
WHERE name='?';

/*UPDATE one entity*/
/*Updates character name*/
UPDATE characters
SET name='?'
WHERE id='?';

/*Update character info by name*/
UPDATE characters
SET homeplanet='?', alignment='?'
WHERE name='?';

/*Must be able to add and remove from on many-to-many relationship and add to all relationships.*/
/*INSERT into all relationships*/
SELECT C.id INTO @cid FROM characters C WHERE C.name = '?';
SELECT P.id INTO @pid FROM powers P WHERE P.name = '?';
INSERT INTO powers (cid, pid) VALUES (@cid, @pid);

/*DELETE one many-to-many*/
DELETE FROM characters
WHERE id in (
SELECT id FROM characters c
INNER JOIN characters_powers cp ON c.id =cp.cid
INNER JOIN powers p ON p.id= cp.pid WHERE p.id = (?)
);

DELETE FROM powers WHERE id = (?);

/*In one 1-to-many relationship, set foreign key to NULL*/
/*Sets character's homeworld to NULL by name*/
UPDATE characters
SET homeplanet=NULL
WHERE name='?';

/*In many-to-many, delete a row from the join table*/
DELETE FROM characters
WHERE id IN (
SELECT id FROM characters c
INNER JOIN characters_powers cp ON c.id =cp.cid
INNER JOIN powers p ON p.id= cp.pid WHERE p.id = '?'
);

DELETE FROM powers WHERE id = '?';
DELETE characters,powers FROM characters
INNER JOIN powers ON powers.ref = characters.id 
WHERE characters.id = '?';