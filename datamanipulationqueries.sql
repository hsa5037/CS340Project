/*INSERT individual entry*/
INSERT INTO characters (name, homeplanet, alignment) 
VALUES (?, NULLIF(?,'none'), ?);

INSERT INTO planets (name, realm) 
VALUES (?,?);

INSERT INTO alignment (alignment)
VALUES (?);

INSERT INTO weapons (name, description, wielder) 
VALUES (?,?,?);

INSERT INTO powers (name, description) 
VALUES (?,?);

INSERT INTO characters_powers (cid, pid) 
VALUES (?,?)



/*SELECT to display content or filter options*/
/*Get characters*/
SELECT C.id as id, C.name as name, H.name as planet, A.alignment as alignment FROM characters C 
LEFT JOIN planets H ON H.id = C.homeplanet 
LEFT JOIN alignment A ON A.id = C.alignment 
ORDER BY C.name ASC;

/*Get powers*/
SELECT P.id as pid, P.name as name, P.description as description, COUNT(C.name) as numChars FROM powers P 
LEFT JOIN characters_powers CP ON CP.pid=P.id 
LEFT JOIN characters C ON C.id=CP.pid 
GROUP BY P.name ASC;

/*Get characters-powers*/
SELECT P.id as pid, P.name as name, C.id as cid, C.name as charName FROM powers P 
INNER JOIN characters_powers CP ON CP.pid=P.id 
INNER JOIN characters C ON C.id=CP.cid 
ORDER BY P.name ASC;

/*Get weapons*/
SELECT W.id as id, W.name as name, W.description as description, C.name as wielder FROM weapons W 
LEFT JOIN characters C ON C.id=W.wielder
ORDER BY W.name ASC;

/*Get planets*/
SELECT P.id, P.name as name, R.name as realm FROM planets P 
LEFT JOIN realms R ON P.realm=R.id 
ORDER BY P.name ASC;

/*Get realms*/
SELECT R.id as id, R.name, COUNT(P.name) as planet_count FROM realms R 
LEFT JOIN planets P ON P.realm=R.id 
GROUP BY R.name ASC



/*DELETE queries*/
/*Delete character by name*/
DELETE FROM characters 
WHERE id = ?;

/*Delete planet by name*/
DELETE FROM planets 
WHERE id = ?;

/*Delete realm by name*/
DELETE FROM realms 
WHERE id = ?;

/*Delete weapon by name*/
DELETE FROM weapons 
WHERE id = ?;

/*Delete power by name*/
DELETE FROM powers WHERE id = ?;

/*Delete character-power*/
DELETE FROM characters_powers 
WHERE cid = ? AND pid = ?;



/*UPDATE queries*/
/*Updates character, includes Null option for planet*/
UPDATE characters SET name=?, homeplanet=NULLIF(?,'none'), alignment=? 
WHERE id=?;

/*Updates planet, includes Null option for realm*/
UPDATE planets SET name=?, realm=NULLIF(?, 'none') 
WHERE id=?;

/*Updates weapon, includes Null option for wielder*/
UPDATE weapons SET name=?, description=?, wielder=NULLIF(?, 'none')
WHERE id=?;

/*Updates realm*/
UPDATE realms SET name=? 
WHERE id=?;

/*Updates power*/
UPDATE powers SET name=?, description=? 
WHERE id=?;