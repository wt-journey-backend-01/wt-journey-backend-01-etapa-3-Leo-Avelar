const { z } = require('zod');

const errorHandler = (err, req, res, next) => {
    if (err.name === 'ZodError' || err.constructor.name === 'ZodError') {
        const errors = {};
        
        if (err.issues && Array.isArray(err.issues)) {
            err.issues.forEach(issue => {
                const field = issue.path.length > 0 ? issue.path.join('.') : 'root';
                errors[field] = issue.message;
            });
        }
        
        return res.status(400).json({
            status: 400,
            message: 'Parâmetros inválidos',
            errors
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';
    res.status(statusCode).json({
        status: statusCode,
        message,
    });
};

const casoSchema = z.object({
    id: z.any().refine(() => false, { message: "Id inválido, o id é criado automaticamente e não é alterável" }).optional(),

    titulo: z.string({ message: 'titulo é obrigatório (string)' }).min(1, 'titulo não pode ser vazio'),

    descricao: z.string({ message: 'descricao é obrigatória (string)' }).min(1, 'descricao não pode ser vazio'),

    status: z.enum(['aberto', 'solucionado'], {message: 'status é obrigatório (aberto ou solucionado)'}),

    agente_id: z.int({message: 'agente_id é obrigatório (Id de um agente existente - integer)'}).positive({message: 'agente_id deve ser um número inteiro positivo'}),
});


const agenteSchema = z.object({
    id: z.any().refine(() => false, { message: "Id inválido, o id é criado automaticamente e não é alterável" }).optional(),

    nome: z.string({ message: "nome é obrigatório (string)" }).min(1, { message: "nome não pode ser vazio" }),

    dataDeIncorporacao: z.string({ message: "dataDeIncorporacao é obrigatória (YYYY-MM-DD ou YYYY/MM/DD)" })
        .min(1, { message: "dataDeIncorporacao não pode ser vazia" })
        .transform((val) => val.replace(/\//g, '-'))
        .refine(
            (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)),
            { message: "dataDeIncorporacao deve estar em 'YYYY-MM-DD' ou 'YYYY/MM/DD'" }
        )
        .refine(
            (val) => new Date(val) <= new Date(),
            { message: "A dataDeIncorporacao não pode ser no futuro." }
        ),

    cargo: z.string({ message: "cargo é obrigatório (string)" }).min(1, { message: "cargo não pode ser vazio" }),
});

module.exports = {errorHandler, agenteSchema, casoSchema };