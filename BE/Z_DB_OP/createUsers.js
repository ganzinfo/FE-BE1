// createUsers.js - 150 új felhasználó létrehozása
const { connectToDatabase, models } = require('../repositories/db');
const { User } = models;
const bcrypt = require('bcrypt');

// Magyar nevek listája
const magyarKeresztnevek = [
    'István', 'László', 'Gábor', 'Péter', 'János', 'András', 'Zoltán', 'Tamás',
    'Anna', 'Katalin', 'Éva', 'Mária', 'Eszter', 'Judit', 'Ágnes', 'Zsófia',
    'Balázs', 'Dávid', 'Máté', 'Levente', 'Bence', 'Ádám', 'Márk', 'Richárd',
    'Réka', 'Viktória', 'Krisztina', 'Andrea', 'Mónika', 'Beatrix', 'Erika', 'Petra'
];

const magyarVezeteknevek = [
    'Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár',
    'Németh', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász', 'Lakatos', 'Mészáros',
    'Oláh', 'Simon', 'Rácz', 'Fekete', 'Szilágyi', 'Török', 'Fehér', 'Balázs',
    'Gál', 'Kis', 'Szűcs', 'Kocsis', 'Orsós', 'Pintér'
];

// Véletlenszerű név generálása
function getRandomName() {
    const firstName = magyarKeresztnevek[Math.floor(Math.random() * magyarKeresztnevek.length)];
    const lastName = magyarVezeteknevek[Math.floor(Math.random() * magyarVezeteknevek.length)];
    return { firstName, lastName };
}

// Username generálása firstName és lastName alapján
function generateUsername(firstName, lastName, index) {
    const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    return `${base}${index}`;
}

// Email generálása
function generateEmail(username) {
    return `${username}@example.com`;
}

async function createUsers() {
    try {
        await connectToDatabase();
        console.log('🌱 150 új felhasználó létrehozása...\n');

        const defaultPasswordHash = await bcrypt.hash('password123', 10);
        const usersToCreate = [];

        for (let i = 1; i <= 150; i++) {
            const { firstName, lastName } = getRandomName();
            const username = generateUsername(firstName, lastName, i);
            const email = generateEmail(username);

            usersToCreate.push({
                email,
                username,
                firstName,
                lastName,
                password: defaultPasswordHash,
                admin: false
            });

            if (i % 30 === 0) {
                console.log(`📝 ${i} felhasználó előkészítve...`);
            }
        }

        // Bulk insert in batches of 25
        const batchSize = 25;
        let createdCount = 0;

        for (let i = 0; i < usersToCreate.length; i += batchSize) {
            const batch = usersToCreate.slice(i, i + batchSize);
            await User.bulkCreate(batch, {
                validate: true,
                fields: ['email', 'username', 'firstName', 'lastName', 'password', 'admin']
            });
            createdCount += batch.length;
            console.log(`✅ ${createdCount}/${usersToCreate.length} felhasználó létrehozva...`);
        }

        console.log(`\n🎉 Összesen ${usersToCreate.length} felhasználó sikeresen létrehozva!`);
        console.log(`📧 Példa email: ${usersToCreate[0].email}`);
        console.log(`👤 Példa username: ${usersToCreate[0].username}`);
        console.log(`🔑 Alapértelmezett jelszó: password123\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba a felhasználók létrehozása során:', error);
        process.exit(1);
    }
}

createUsers();
