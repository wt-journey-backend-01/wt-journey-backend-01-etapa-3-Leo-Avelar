const agentesRepository = require('../repositories/agentesRepository');
const { agenteSchema } = require('../utils/errorHandler');

async function getAll(req, res) {
    const {cargo, sort} = req.query;

    if (sort && !['dataDeIncorporacao', '-dataDeIncorporacao'].includes(sort)) {
        return res.status(400).json({message: "O parâmetro 'sort' deve ser 'dataDeIncorporacao' ou '-dataDeIncorporacao'."});
    }

    const agentes = await agentesRepository.findAll({ cargo, sort});
    res.status(200).json(agentes);
}

async function getById(req, res) {
	const { id } = req.params;
    
    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });
    
    const agente = await agentesRepository.findById(idNum);
    if (!agente) return res.status(404).json({ message: `Não foi possível encontrar o agente de Id: ${idNum}` });
    res.status(200).json(agente);
}

async function create(req, res, next) {
    try {
        const data = agenteSchema.parse(req.body);
        const agente = await agentesRepository.create(data);

        if (!agente) return res.status(400).json({ message: 'Erro ao criar agente.' });
        res.status(201).json(agente);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.params;
        const data = agenteSchema.parse(req.body);

        const updated = await agentesRepository.update(id, data);
        if (!updated) return res.status(404).json({ message: 'Agente não encontrado.' });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

async function partialUpdate(req, res, next) {
    const { id } = req.params;
    try {
        const data = agenteSchema.partial().parse(req.body);
        const updatedAgente = await agentesRepository.update(id, data);
        if (!updatedAgente) return res.status(404).json({ message: 'Agente não encontrado.' });
        res.status(200).json(updatedAgente);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res) {
	const { id } = req.params;
	const deleted = await agentesRepository.delete(id);

	if (!deleted) return res.status(404).json({ message: 'Agente não encontrado.' });
	res.status(204).send();
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    partialUpdate,
    delete: remove,
};