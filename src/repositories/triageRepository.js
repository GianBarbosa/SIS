import db from "../db.js";

export default function triageRepository() {

    async function getPhase1TriageData() {
        const conn = await db.connect();
        const [rows] = await conn.query("SELECT * FROM TriagePhase1;");
        return rows;
    }

    async function getPhase2TriageData() {
        const conn = await db.connect();
        const [rows] = await conn.query("SELECT * FROM TriagePhase2;");
        return rows;
    }

    async function getPhase3TriageData() {
        const conn = await db.connect();
        const [rows] = await conn.query("SELECT * FROM TriagePhase3;");
        return rows;
    }

    return {
        getPhase1TriageData,
        getPhase2TriageData,
        getPhase3TriageData
    }
}