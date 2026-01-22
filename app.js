// 1. Importáljuk az Express modult
const express = require('express');
const { connectToDatabase, models } = require('./repositories/db'); // Adatbázis modul importálása

// Útvonalak importálása
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// 2. Létrehozzuk az alkalmazás példányát
const app = express();
//middleware a JSON body-k kezeléséhez
app.use(express.json());

// 3. Beállítunk egy portot, amit a szerver figyelni fog
const PORT = 3000;


// 4. Alkalmazás inicializálása és szerver indítása
async function initializeApp() {
  await connectToDatabase(); // Kapcsolódás az adatbázishoz
  app.listen(PORT, () => {
    console.log(`A Szerver fut a http://localhost:${PORT} címen.`);
  });
}

initializeApp();

// 5. Root endpoint - API információk
app.get('/', (req, res) => {
  res.json({
    message: 'Üdvözöllek az API-ban!',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      tasks: '/tasks',
      users: '/users'
    },
    timestamp: new Date().toISOString()
  });
});

// 6. Útvonalak "bekötése"
// A /tasks kezdetű kéréseket a taskRoutes kezeli
app.use('/tasks', taskRoutes);
// A /users kezdetű kéréseket a userRoutes kezeli
app.use('/users', userRoutes);
