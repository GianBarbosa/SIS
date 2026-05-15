import * as SQLite from 'expo-sqlite';
import {
    healthUnitSeeds,
    triagePhase1Seeds,
    triagePhase2Seeds,
    triagePhase3Seeds,
} from './database/seeds.js';

const DATABASE_NAME = 'sis.db';

let databasePromise;
let initializationPromise;

async function seedHealthUnits(database) {
    const row = await database.getFirstAsync('SELECT COUNT(*) AS total FROM HealthUnits;');

    if (row?.total > 0) {
        return;
    }

    for (const unit of healthUnitSeeds) {
        await database.runAsync(
            `
                INSERT INTO HealthUnits (
                    nome,
                    type,
                    addressStreet,
                    addressCity,
                    addressState,
                    addressZip,
                    locationLat,
                    locationLng,
                    services,
                    phone,
                    openingHours
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                unit.nome,
                unit.type,
                unit.addressStreet,
                unit.addressCity,
                unit.addressState,
                unit.addressZip,
                unit.locationLat,
                unit.locationLng,
                unit.services,
                unit.phone,
                unit.openingHours,
            ]
        );
    }
}

async function seedTriagePhase1(database) {
    const row = await database.getFirstAsync('SELECT COUNT(*) AS total FROM TriagePhase1;');

    if (row?.total > 0) {
        return;
    }

    for (const entry of triagePhase1Seeds) {
        await database.runAsync(
            'INSERT INTO TriagePhase1 (id, question, `next`) VALUES (?, ?, ?);',
            [entry.id, entry.question, entry.next]
        );
    }
}

async function seedTriagePhase2(database) {
    const row = await database.getFirstAsync('SELECT COUNT(*) AS total FROM TriagePhase2;');
    const legacyRows = await database.getFirstAsync(
        "SELECT COUNT(*) AS total FROM TriagePhase2 WHERE id LIKE 'R_%' OR question LIKE 'Classificacao preliminar:%';"
    );

    const shouldReseed = (row?.total ?? 0) === 0 || (legacyRows?.total ?? 0) > 0;

    if (!shouldReseed) {
        return;
    }

    if ((row?.total ?? 0) > 0) {
        await database.runAsync('DELETE FROM TriagePhase2;');
    }

    for (const entry of triagePhase2Seeds) {
        await database.runAsync(
            'INSERT INTO TriagePhase2 (id, question, nextPositive, nextNegative, baseRiskDegree, baseRiskPositive, baseRiskNegative) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [
                entry.id,
                entry.question,
                entry.nextPositive,
                entry.nextNegative,
                entry.baseRiskDegree ?? 0,
                entry.baseRiskPositive ?? null,
                entry.baseRiskNegative ?? null,
            ]
        );
    }
}

async function seedTriagePhase3(database) {
    const row = await database.getFirstAsync('SELECT COUNT(*) AS total FROM TriagePhase3;');

    if (row?.total > 0) {
        return;
    }

    for (const entry of triagePhase3Seeds) {
        await database.runAsync(
            'INSERT INTO TriagePhase3 (id, question, nextPositive, nextNegative, riskDegreeIncrease) VALUES (?, ?, ?, ?, ?);',
            [entry.id, entry.question, entry.nextPositive, entry.nextNegative, entry.riskDegreeIncrease]
        );
    }
}

async function initializeDatabase(database) {
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS HealthUnits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                type TEXT NOT NULL,
                addressStreet TEXT NOT NULL,
                addressCity TEXT NOT NULL,
                addressState TEXT NOT NULL,
                addressZip TEXT,
                locationLat REAL,
                locationLng REAL,
                services TEXT,
                phone TEXT,
                openingHours TEXT
            );

            CREATE TABLE IF NOT EXISTS TriagePhase1 (
                id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                \`next\` TEXT
            );

            CREATE TABLE IF NOT EXISTS TriagePhase2 (
                id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                nextPositive TEXT,
                nextNegative TEXT,
                baseRiskDegree INTEGER NOT NULL DEFAULT 0,
                baseRiskPositive INTEGER,
                baseRiskNegative INTEGER
            );

            CREATE TABLE IF NOT EXISTS TriagePhase3 (
                id TEXT PRIMARY KEY,
                question TEXT NOT NULL,
                nextPositive TEXT,
                nextNegative TEXT,
                riskDegreeIncrease INTEGER NOT NULL DEFAULT 0
            );
        `);

        try {
            await database.execAsync('ALTER TABLE TriagePhase2 ADD COLUMN baseRiskPositive INTEGER;');
        } catch (_error) {
            // Column already exists in previously initialized databases.
        }

        try {
            await database.execAsync('ALTER TABLE TriagePhase2 ADD COLUMN baseRiskNegative INTEGER;');
        } catch (_error) {
            // Column already exists in previously initialized databases.
        }

        await seedHealthUnits(database);
        await seedTriagePhase1(database);
        await seedTriagePhase2(database);
        await seedTriagePhase3(database);
    })();

    return initializationPromise;
}

async function connect() {
    if (!databasePromise) {
        databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
    }

    const database = await databasePromise;
    await initializeDatabase(database);

    return {
        async query(sql, params = []) {
            const normalizedSql = sql.trim().toUpperCase();

            if (normalizedSql.startsWith('SELECT') || normalizedSql.startsWith('PRAGMA')) {
                const rows = await database.getAllAsync(sql, params);
                return [rows];
            }

            const result = await database.runAsync(sql, params);
            return [[result]];
        }
    };
}

export default { connect };
