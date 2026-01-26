// seed.js - Tesztadatok feltöltése az adatbázisba
const { connectToDatabase, models } = require('./repositories/db');
const { User } = models;

// Magyar nevek listája
const magyarKeresztnevek = [
    'István', 'László', 'Gábor', 'Péter', 'János', 'András', 'Zoltán', 'Tamás',
    'Anna', 'Katalin', 'Éva', 'Mária', 'Eszter', 'Judit', 'Ágnes', 'Zsófia'
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

async function seedDatabase() {
    try {
        // Kapcsolódás az adatbázishoz
        await connectToDatabase();
        console.log('🌱 Seed script indítása...\n');

        // Összes felhasználó lekérdezése
        const users = await User.findAll();
        console.log(`📊 Talált felhasználók száma: ${users.length}\n`);

        let updatedCount = 0;

        // Végigmegyünk a felhasználókon és frissítjük a hiányzó neveket
        for (const user of users) {
            if (!user.firstName || !user.lastName) {
                const { firstName, lastName } = getRandomName();

                await user.update({
                    firstName: user.firstName || firstName,
                    lastName: user.lastName || lastName
                });

                console.log(`✅ Frissítve: ${user.email} -> ${firstName} ${lastName}`);
                updatedCount++;
            } else {
                console.log(`⏭️  Átugorva: ${user.email} (már van neve: ${user.firstName} ${user.lastName})`);
            }
        }

        console.log(`\n🎉 Seed befejezve! ${updatedCount} felhasználó frissítve.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba a seed során:', error);
        process.exit(1);
    }
}

// Script futtatása
seedDatabase();
