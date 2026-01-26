// fixMigration.js - Átnevezi a 'name' oszlopot 'username'-re (javított verzió)
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log
});

async function migrate() {
    try {
        console.log('🔄 Migráció indítása: name → username\n');

        // Ellenőrizzük a jelenlegi sémát
        const [beforeSchema] = await sequelize.query("PRAGMA table_info(Users);");
        console.log('📋 Jelenlegi séma:');
        beforeSchema.forEach(col => console.log(`  - ${col.name}`));
        console.log('');

        // Migráció lépésenként
        await sequelize.query('BEGIN TRANSACTION;');

        // 1. Új tábla létrehozása
        console.log('1️⃣ Új tábla létrehozása...');
        await sequelize.query(`
      CREATE TABLE Users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        admin TINYINT(1) NOT NULL DEFAULT 0,
        token VARCHAR(255),
        valid_thru DATETIME
      );
    `);

        // 2. Adatok másolása
        console.log('2️⃣ Adatok másolása...');
        await sequelize.query(`
      INSERT INTO Users_new (id, email, username, firstName, lastName, password, admin, token, valid_thru)
      SELECT id, email, name, firstName, lastName, password, admin, token, valid_thru
      FROM Users;
    `);

        // 3. Régi tábla törlése
        console.log('3️⃣ Régi tábla törlése...');
        await sequelize.query('DROP TABLE Users;');

        // 4. Új tábla átnevezése
        console.log('4️⃣ Új tábla átnevezése...');
        await sequelize.query('ALTER TABLE Users_new RENAME TO Users;');

        await sequelize.query('COMMIT;');

        // Ellenőrizzük az új sémát
        const [afterSchema] = await sequelize.query("PRAGMA table_info(Users);");
        console.log('\n✅ Migráció sikeres! Új séma:');
        afterSchema.forEach(col => console.log(`  - ${col.name}`));

        process.exit(0);
    } catch (error) {
        await sequelize.query('ROLLBACK;').catch(() => { });
        console.error('\n❌ Hiba a migráció során:', error.message);
        process.exit(1);
    }
}

migrate();
