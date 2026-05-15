import db from '../db.js';

export const HealthUnitTypes = ['ACUTE_CARE', 'PRIMARY_CARE', 'URGENT_CARE', 'SPECIALTY_CARE']

async function getHealthUnits() {
    const conn = await db.connect();
    const [rows] = await conn.query('SELECT * FROM HealthUnits;');
    return rows
}

async function getHealthUnitById(id) {
    const conn = await db.connect();
    const sql = "SELECT * FROM HealthUnits WHERE id=?";
    const [rows] = await conn.query(sql, [id]);
    return rows && rows.length > 0 ? rows[0] : {};
}

async function getHealthUnitsByType(type) {
    const conn = await db.connect();
    const sql = "SELECT * FROM HealthUnits WHERE type=?";
    const [rows] = await conn.query(sql, [type]);
    return rows;
}

async function createHealthUnit(healthUnit) {
    const conn = await db.connect();
    const sql =
        ```
            INSERT INTO HealthUnits(
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
            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?);
        ```;
    return await conn.query(sql, [
        healthUnit.nome,
        healthUnit.type,
        healthUnit.addressStreet,
        healthUnit.addressCity,
        healthUnit.addressState,
        healthUnit.addressZip,
        healthUnit.locationLat,
        healthUnit.locationLng,
        healthUnit.services,
        healthUnit.phone,
        healthUnit.openingHours
    ]);
}

async function updateHealthUnit(id, healthUnit) {
    const conn = await db.connect();
    const sql =
        ```
            UPDATE HealthUnits SET 
            nome=?, 
            type=?, 
            addressStreet=?, 
            addressCity=?, 
            addressState=?, 
            addressZip=?, 
            locationLat=?, 
            locationLng=?, 
            services=?, 
            phone=?, 
            openingHours=?
            WHERE id=?
        ```;
    return await conn.query(sql, [
        healthUnit.nome,
        healthUnit.type,
        healthUnit.addressStreet,
        healthUnit.addressCity,
        healthUnit.addressState,
        healthUnit.addressZip,
        healthUnit.locationLat,
        healthUnit.locationLng,
        healthUnit.services,
        healthUnit.phone,
        healthUnit.openingHours,
        id
    ])
}

async function deleteHealthUnit(id) {
    const conn = await db.connect();
    return await conn.query("DELETE FROM HealthUnits WHERE id=?;", [id]);
}

export default {
    getHealthUnits,
    getHealthUnitById,
    getHealthUnitsByType,
    createHealthUnit,
    updateHealthUnit,
    deleteHealthUnit
}