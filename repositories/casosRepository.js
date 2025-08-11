const db = require('../db/db');

async function findAll(filters = {}) {
    try {
        const casos = db('casos');
        if (filters.agente_id) casos.where({ agente_id: filters.agente_id });
        if (filters.status) casos.where({ status: filters.status });
        return await casos;
    } catch (err) {
        return null;
    }
}

async function findById(id) {
    try {
        const caso = await db('casos').where({ id: id }).first();
        return caso ? caso : null;
    } catch (err) {
        return null;
    }
}

async function findByAgenteId(agente_id) {
    try {
        const casos = await db('casos').where({ agente_id: agente_id });
        return casos;
    } catch (err) {
        return null;
    }
}

async function create(caso) {
    try {
        const [createdCaso] = await db('casos').insert(caso, ['*']);
        return createdCaso;
    } catch (err) {
        return null;
    }
}

async function update(id, updatedCasoData) {
    try {
        const updatedCaso = await db('casos').where({ id: id }).update(updatedCasoData, ['*']);
        return !updatedCaso || updatedCaso.length === 0 ? null : updatedCaso[0];
    } catch (err) {
        return null;
    }
}

async function remove(id) {
    try {
        const deletedCaso = await db('casos').where({ id: id }).del();
        return !deletedCaso ? null : true;
    } catch (err) {
        return null;
    }
}

async function search(q) {
    return await db('casos').where(function () {
        this.whereILike('titulo', `%${q}%`).orWhereILike('descricao', `%${q}%`);
    });
}

module.exports = {
    findAll,
    findById,
    findByAgenteId,
    create,
    update,
    delete: remove,
    search,
};