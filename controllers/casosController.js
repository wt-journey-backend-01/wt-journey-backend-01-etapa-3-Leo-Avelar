const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { casoSchema } = require('../utils/errorHandler');

async function verifyAgente(agenteId) {
    if (!agenteId) return false;
    const agente = await agentesRepository.findById(agenteId);
    return !!agente;
}

async function getAll(req, res) {
	let casos = await casosRepository.findAll();
	if (req.query.status) casos = casos.filter(caso => caso.status == req.query.status);
	if (req.query.agente_id) casos = casos.filter(caso => caso.agente_id == req.query.agente_id);
	res.status(200).json(casos);
}

async function getById(req, res) {
	const { id } = req.params;
    
    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });
    
    const caso = await casosRepository.findById(idNum);
    if (!caso) return res.status(404).json({ message: `Não foi possível encontrar o caso de Id: ${idNum}.` });
    res.status(200).json(caso);
}

async function getAgenteOfCaso(req, res) {
    const { id } = req.params;

    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });

    const caso = await casosRepository.findById(idNum);
    if (!caso) return res.status(404).json({ message: `Não foi possível encontrar o caso de Id: ${idNum}.` });

    const agente = await agentesRepository.findById(caso.agente_id);
    if (!agente) return res.status(404).json({ message: `Não foi possível encontrar casos correspondentes ao agente de Id: ${caso.agente_id}.` });
    res.status(200).json(agente);
}

async function search(req, res) {
    const search = req.query.q;
    if (!search || search.trim() === '') return res.status(404).json({ message: "Parâmetro de pesquisa 'q' não encontrado" });

    const searchedCasos = await casosRepository.search(search.trim());
    if (searchedCasos.length === 0) return res.status(404).json({ message: `Não foi possível encontrar casos relacionados à pesquisa: ${search}.` });
    res.status(200).send(searchedCasos);
}

async function create(req, res, next) {
    try {
        const data = casoSchema.parse(req.body);
        if (!(await verifyAgente(data.agente_id))) return res.status(404).json({ message: `Não foi possível encontrar o agente de id: ${data.agente_id}.` });
        const createdCaso = await casosRepository.create(data);
        if (!createdCaso) return res.status(400).json({ message: 'Erro ao criar caso.' });
        res.status(201).json(createdCaso);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const { id } = req.params;
    
    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });
    
    try {
        const data = casoSchema.parse(req.body);
        if (!(await verifyAgente(data.agente_id))) return res.status(404).json({ message: `Não foi possível encontrar o agente de id: ${data.agente_id}.` });

        const updated = await casosRepository.update(idNum, data);
        if (!updated) return res.status(404).json({ message: `Não foi possível atualizar o caso de id: ${idNum}.` });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

async function partialUpdate(req, res, next) {
    const { id } = req.params;
    
    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });
    
    try{
        const data = casoSchema.partial().parse(req.body);
        if(data.agente_id){
            if (!(await verifyAgente(data.agente_id))) return res.status(404).json({ message: `Não foi possível encontrar o agente de id: ${data.agente_id}.` });
        }
        const updatedCaso = await casosRepository.update(idNum, data);
        if (!updatedCaso) return res.status(404).json({ message: `Não foi possível atualizar o caso de id: ${idNum}.` });
        res.status(200).json(updatedCaso);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res) {
    const { id } = req.params;
    
    const idNum = Number(id);
    if (isNaN(idNum)) return res.status(400).json({ message: 'ID inválido.' });
    
    const caso = await casosRepository.findById(idNum);
    if (!caso) return res.status(404).json({ message: `Não foi possível encontrar o caso de Id: ${idNum}.` });
    await casosRepository.delete(idNum);
    res.status(204).send();
}

module.exports = {
    search,
    getAll,
    getById,
    getAgenteOfCaso,
    create,
    update,
	partialUpdate,
    delete: remove,
};