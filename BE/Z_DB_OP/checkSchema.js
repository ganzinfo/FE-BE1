// checkSchema.js - Ellenőrzi az adatbázis sémát
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

async function checkSchema() {
    try {
        await sequelize.authenticate();

        // Lekérdezzük a Users tábla sémáját
        const [results] = await sequelize.query("PRAGMA table_info(Users);");

        console.log('📋 Users tábla séma:\n');
        results.forEach(column => {
            console.log(`  - ${column.name} (${column.type})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba:', error);
        process.exit(1);
    }
}

checkSchema();
