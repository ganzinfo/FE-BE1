const { connectToDatabase, models } = require('./repositories/db');
const { User } = models;
const bcrypt = require('bcrypt');
const userService = require('./services/userService');

async function fixPasswords() {
    try {
        await connectToDatabase();
        console.log('🔄 Felhasználói jelszavak újra-hash-elése...');

        const users = await User.findAll();
        const totalUsers = users.length;
        console.log(`👥 Összesen ${totalUsers} felhasználó betöltve.`);

        const defaultPassword = 'password123';
        const batchSize = 10;

        for (let i = 0; i < totalUsers; i += batchSize) {
            const batch = users.slice(i, i + batchSize);

            await Promise.all(batch.map(async (user) => {
                const newHash = await userService.hashPassword(defaultPassword);
                await user.update({ password: newHash });
            }));

            console.log(`📝 ${Math.min(i + batchSize, totalUsers)}/${totalUsers} felhasználó frissítve...`);
        }

        console.log(`\n✅ Sikeresen frissítve az összes felhasználó jelszava.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba a jelszavak frissítése során:', error);
        process.exit(1);
    }
}

fixPasswords();
