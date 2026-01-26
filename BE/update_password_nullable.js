// update_password_nullable.js - Modifies the User table to make password nullable
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
});

async function migrate() {
    try {
        console.log('🔄 Migráció indítása: password nullable beállítása\n');

        await sequelize.query('BEGIN TRANSACTION;');

        // 1. Create new table (exactly like before but password is NULLable)
        console.log('1️⃣ Új tábla létrehozása (password nullable)...');
        await sequelize.query(`
      CREATE TABLE Users_password_nullable (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        password VARCHAR(255), -- This is now nullable
        admin TINYINT(1) NOT NULL DEFAULT 0,
        token VARCHAR(255),
        valid_thru DATETIME
      );
    `);

        // 2. Copy data
        console.log('2️⃣ Adatok másolása...');
        await sequelize.query(`
      INSERT INTO Users_password_nullable (id, email, username, firstName, lastName, password, admin, token, valid_thru)
      SELECT id, email, username, firstName, lastName, password, admin, token, valid_thru
      FROM Users;
    `);

        // 3. Drop old table
        console.log('3️⃣ Régi tábla törlése...');
        await sequelize.query('DROP TABLE Users;');

        // 4. Rename new table
        console.log('4️⃣ Új tábla átnevezése...');
        await sequelize.query('ALTER TABLE Users_password_nullable RENAME TO Users;');

        await sequelize.query('COMMIT;');

        console.log('\n✅ Migráció sikeres! A "password" oszlop most már lehet NULL.');
        process.exit(0);
    } catch (error) {
        await sequelize.query('ROLLBACK;').catch(() => { });
        console.error('\n❌ Hiba a migráció során:', error.message);
        process.exit(1);
    }
}

migrate();
