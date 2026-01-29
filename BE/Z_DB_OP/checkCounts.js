const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function checkFile(filename) {
    const filePath = path.join(__dirname, '..', filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: filePath,
        logging: false,
    });

    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        email: DataTypes.STRING
    }, { tableName: 'Users', timestamps: false });

    const Task = sequelize.define('Task', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        title: DataTypes.STRING
    }, { tableName: 'Tasks', timestamps: false });

    try {
        const userCount = await User.count().catch(() => 'Error/No table');
        const taskCount = await Task.count().catch(() => 'Error/No table');
        console.log(`File: ${filename} | Users: ${userCount} | Tasks: ${taskCount}`);
    } catch (e) {
        console.log(`File: ${filename} | Error: ${e.message}`);
    } finally {
        await sequelize.close();
    }
}

async function run() {
    console.log('--- Database Record Count Check ---');
    await checkFile('database.sqlite');
    await checkFile('../database.sqlite');
    await checkFile('database másolata.sqlite');
    await checkFile('database másolata (2).sqlite');
}

run();
