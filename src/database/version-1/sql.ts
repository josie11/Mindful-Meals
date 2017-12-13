export const schema: string = `
  PRAGMA foreign_keys = ON;

  PRAGMA app_version = 1;

  CREATE TABLE IF NOT EXISTS meals(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mealTime CHAR(50),
    mealDate CHAR(50),
    intensityLevel INTEGER,
    satisfactionLevel INTEGER,
    hungerLevelBefore INTEGER,
    hungerLevelAfter INTEGER,
    triggerDescription TEXT,
    mealDescription TEXT,
    mealType CHAR(50),
    completed INTEGER DEFAULT 0
  );


  CREATE TABLE IF NOT EXISTS cravings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    cravingTime CHAR(50),
    cravingDate CHAR(50),
    intensityLevel INTEGER,
    hungerLevel INTEGER,
    triggerDescription TEXT
  );

  CREATE TABLE IF NOT EXISTS emotions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name CHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS distractions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name CHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS foods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name CHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cravingEmotions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cravingId INTEGER NOT NULL REFERENCES cravings (id) ON UPDATE CASCADE ON DELETE CASCADE,
    emotionId INTEGER NOT NULL REFERENCES emotions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cravingFoods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cravingId INTEGER NOT NULL REFERENCES cravings (id) ON UPDATE CASCADE ON DELETE CASCADE,
    foodId INTEGER NOT NULL REFERENCES foods (id) ON UPDATE CASCADE ON DELETE CASCADE,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mealEmotions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mealId INTEGER NOT NULL REFERENCES meals (id) ON UPDATE CASCADE ON DELETE CASCADE,
    emotionId INTEGER NOT NULL REFERENCES emotions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    mealStage CHAR(50),
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mealFoods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mealId INTEGER NOT NULL REFERENCES meals (id) ON UPDATE CASCADE ON DELETE CASCADE,
    foodId INTEGER NOT NULL REFERENCES foods (id) ON UPDATE CASCADE ON DELETE CASCADE,
    mealStage CHAR(50),
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mealDistractions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mealId INTEGER NOT NULL REFERENCES meals (id) ON UPDATE CASCADE ON DELETE CASCADE,
    distractionId INTEGER NOT NULL REFERENCES distractions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`

export const allVersionSeed = `

INSERT INTO foods (name)
VALUES ('Chocolate' );
INSERT INTO foods (name)
VALUES ('Pizza' );
INSERT INTO foods (name)
VALUES ('Cheesecake' );

INSERT INTO emotions (name)
VALUES ('Happy' );
INSERT INTO emotions (name)
VALUES ('Stressed' );
INSERT INTO emotions (name)
VALUES ('Worried' );
INSERT INTO emotions (name)
VALUES ('Depressed' );
INSERT INTO emotions (name)
VALUES ('Sad' );

INSERT INTO distractions (name)
VALUES ('TV' );
INSERT INTO distractions (name)
VALUES ('Reading' );
INSERT INTO distractions (name)
VALUES ('Cellphone' );
INSERT INTO distractions (name)
VALUES ('Conversation' );
INSERT INTO distractions (name)
VALUES ('Thoughts' );
INSERT INTO distractions (name)
VALUES ('Driving' );
INSERT INTO distractions (name)
VALUES ('Work' );
`;
