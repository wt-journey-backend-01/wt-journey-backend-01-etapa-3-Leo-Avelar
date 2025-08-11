const agentesRepository = require('../repositories/agentesRepository');
const { agenteSchema } = require('../utils/errorHandler');

async function getAll(req, res) {
    const {cargo, sort} = req.query;

    const agentes = await agentesRepository.findAll({ cargo, sort});
    res.status(200).json(agentes);
}

async function getById(req, res) {
	const { id } = req.params;
    const agente = await agentesRepository.findById(id);
    if (!agente) return res.status(404).json({ message: `Não foi possível encontrar o agente de Id: ${id}` });
    res.status(200).json(agente);
}

async function create(req, res) {
    const data = agenteSchema.parse(req.body);
    const agente = await agentesRepository.create(data);

    if (!agente) return res.status(400).json({ message: 'Erro ao criar agente.' });
    res.status(201).json(agente);
}

async function update(req, res) {
    const { id } = req.params;
    const data = agenteSchema.parse(req.body);

    const updated = await agentesRepository.update(id, data);
    if (!updated) return res.status(404).json({ message: 'Agente não encontrado.' });
    res.status(200).json(updated);
}

async function partialUpdate(req, res) {
    const { id } = req.params;
    const data = agenteSchema.partial().parse(req.body);

    const updatedAgente = await agentesRepository.update(id, data);
    if (!updatedAgente) return res.status(404).json({ message: 'Agente não encontrado.' });
    res.status(200).json(updatedAgente);
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