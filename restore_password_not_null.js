// restore_password_not_null.js - Visszaállítja a jelszó kötelezőségét
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
});

async function migrate() {
    try {
        console.log('🔄 Migráció indítása: password NOT NULL visszaállítása\n');

        // 1. Alapértelmezett hash legenerálása (egyszer fut le, hatékonyabb)
        console.log('🔑 Alapértelmezett jelszó hashelése...');
        const defaultHash = await bcrypt.hash('password123', 10);

        await sequelize.query('BEGIN TRANSACTION;');

        // 2. Meglévő NULL jelszavak feltöltése
        console.log('📝 NULL jelszavak feltöltése az alapértelmezett hash-sel...');
        await sequelize.query(`UPDATE Users SET password = ? WHERE password IS NULL`, {
            replacements: [defaultHash]
        });

        // 3. Új tábla létrehozása NOT NULL kényszerrel
        console.log('1️⃣ Új tábla létrehozása (password NOT NULL)...');
        await sequelize.query(`
      CREATE TABLE Users_password_fixed (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        password VARCHAR(255) NOT NULL, -- Most már NOT NULL
        admin TINYINT(1) NOT NULL DEFAULT 0,
        token VARCHAR(255),
        valid_thru DATETIME
      );
    `);

        // 4. Adatok másolása
        console.log('2️⃣ Adatok másolása...');
        await sequelize.query(`
      INSERT INTO Users_password_fixed (id, email, username, firstName, lastName, password, admin, token, valid_thru)
      SELECT id, email, username, firstName, lastName, password, admin, token, valid_thru
      FROM Users;
    `);

        // 5. Régi tábla törlése
        console.log('3️⃣ Régi tábla törlése...');
        await sequelize.query('DROP TABLE Users;');

        // 6. Új tábla átnevezése
        console.log('4️⃣ Új tábla átnevezése...');
        await sequelize.query('ALTER TABLE Users_password_fixed RENAME TO Users;');

        await sequelize.query('COMMIT;');

        console.log('\n✅ Siker! Minden felhasználónak van jelszava, és a mező újra kötelező (NOT NULL).');
        process.exit(0);
    } catch (error) {
        await sequelize.query('ROLLBACK;').catch(() => { });
        console.error('\n❌ Hiba a migráció során:', error.message);
        process.exit(1);
    }
}

migrate();
