// migrate.js - Átnevezi a 'name' oszlopot 'username'-re
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
});

async function migrate() {
    try {
        console.log('🔄 Migráció indítása: name → username\n');

        const queryInterface = sequelize.getQueryInterface();

        // SQLite doesn't support ALTER COLUMN RENAME, so we recreate the table
        await sequelize.query(`
      BEGIN TRANSACTION;
      
      -- Create new table with username
      CREATE TABLE Users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT,
        firstName TEXT,
        lastName TEXT,
        password TEXT NOT NULL,
        admin INTEGER NOT NULL DEFAULT 0,
        token TEXT,
        valid_thru TEXT
      );
      
      -- Copy data
      INSERT INTO Users_new (id, email, username, firstName, lastName, password, admin, token, valid_thru)
      SELECT id, email, name, firstName, lastName, password, admin, token, valid_thru
      FROM Users;
      
      -- Drop old table
      DROP TABLE Users;
      
      -- Rename new table
      ALTER TABLE Users_new RENAME TO Users;
      
      COMMIT;
    `);

        console.log('✅ Migráció sikeres! A "name" oszlop átnevezve "username"-re.\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba a migráció során:', error);
        process.exit(1);
    }
}

migrate();
