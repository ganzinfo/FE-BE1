// seed_tasks_hu.js - 100 magyar feladat generálása
const { connectToDatabase, models } = require('./repositories/db');
const { Task } = models;

const igek = [
    'Megvenni', 'Elintézni', 'Megjavítani', 'Kitakarítani', 'Megfőzni',
    'Kiüríteni', 'Megírni', 'Elolvasni', 'Megnézni', 'Frissíteni',
    'Tesztelni', 'Megszervezni', 'Lefoglalni', 'Kicserélni', 'Ellenőrizni',
    'Elküldeni', 'Befejezni', 'Kezdeményezni', 'Módosítani', 'Létrehozni'
];

const foNevek = [
    'a bevásárlást', 'az autót', 'a kertet', 'a lakást', 'a projektet',
    'a jelentést', 'a könyvet', 'az e-mailt', 'a szoftvert', 'az adatbázist',
    'az ebédet', 'az ajándékot', 'a kerítést', 'az ablakot', 'a szemeteskosarat',
    'a nyaralást', 'a repjegyet', 'a találkozót', 'a hűtőt', 'a televíziót',
    'a dokumentációt', 'a kódot', 'a szervert', 'a hálózatot', 'a kávét'
];

const helyszinek = [
    'itthon', 'az irodában', 'a boltban', 'a garázsban', 'a konyhában',
    'a nappaliban', 'a kertben', 'a városban', 'a konditeremben', 'a könyvtárban'
];

const jelzok = [
    'gyorsan', 'alaposan', 'még ma', 'holnapig', 'sürgősen',
    'figyelmesen', 'közösen', 'egyedül', 'időben', 'pontosan'
];

function generateHungarianTask() {
    const ige = igek[Math.floor(Math.random() * igek.length)];
    const foNev = foNevek[Math.floor(Math.random() * foNevek.length)];
    const helyszin = helyszinek[Math.floor(Math.random() * helyszinek.length)];
    const jelzo = jelzok[Math.floor(Math.random() * jelzok.length)];

    const title = `${ige} ${foNev}`;
    const description = `${ige} ${foNev} ${helyszin}, ${jelzo}. Ez egy automatikusan generált magyar feladat leírása.`;

    return {
        title,
        description,
        isDone: Math.random() > 0.8
    };
}

async function seedTasks() {
    try {
        await connectToDatabase();
        console.log('🌱 Magyar feladatok seedelése indítva...\n');

        // Régi feladatok törlése
        const deletedCount = await Task.destroy({ where: {} });
        console.log(`🗑️  Régi feladatok törölve: ${deletedCount}`);

        const newTasks = [];
        for (let i = 0; i < 100; i++) {
            newTasks.push(generateHungarianTask());
        }

        await Task.bulkCreate(newTasks);
        console.log(`\n🎉 Sikeresen létrehozva 100 magyar feladat!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Hiba a feladatok seedelése során:', error);
        process.exit(1);
    }
}

seedTasks();
