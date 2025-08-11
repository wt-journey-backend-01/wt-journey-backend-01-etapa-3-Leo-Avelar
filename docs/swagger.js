const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Departamento de Polícia',
            version: '1.0.0',
            description: 'API para gerenciar informações de um departamento de polícia, casos e agentes',
            contact: {
                name: 'Leo Avelar',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Ambiente de desenvolvimento',
            },
        ],
        tags: [
            {
                name: 'Agentes',
                description: 'Endpoints para gerenciamento de agentes policiais'
            },
            {
                name: 'Casos',
                description: 'Endpoints para gerenciamento de casos policiais'
            }
        ],
        components: {
            schemas: {
                Agente: {
                    type: 'object',
                    required: ['nome', 'dataDeIncorporacao', 'cargo'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do agente (adicionado automaticamente)'
                        },
                        nome: {
                            type: 'string',
                            description: 'Nome do agente'
                        },
                        dataDeIncorporacao: {
                            type: 'string',
                            format: 'date',
                            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                            example: '2003-01-01',
                            description: 'Data de incorporação do agente (formato YYYY-MM-DD)'
                        },
                        cargo: {
                            type: 'string',
                            description: 'Cargo/Função do agente'
                        }
                    },
                    example: {
                        id: 1,
                        nome: 'Jorge da Silva',
                        dataDeIncorporacao: '2003-01-01',
                        cargo: 'Investigador'
                    }
                },
                Caso: {
                    type: 'object',
                    required: ['titulo', 'descricao', 'status', 'agente_id'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do caso (adicionado automaticamente)'
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título do caso'
                        },
                        descricao: {
                            type: 'string',
                            description: 'Descrição detalhada do caso'
                        },
                        status: {
                            type: 'string',
                            enum: ['aberto', 'solucionado'],
                            description: 'Status do caso (aberto ou solucionado)'
                        },
                        agente_id: {
                            type: 'integer',
                            description: 'ID do agente responsável pelo caso'
                        }
                    },
                    example: {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        titulo: 'Roubo à mão armada',
                        descricao: 'Roubo ocorrido no centro da cidade às 15:30',
                        status: 'aberto',
                        agente_id: 1
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'integer',
                            description: 'Código do status HTTP'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        },
                        errors: {
                            type: 'object',
                            description: 'Detalhes específicos dos erros de validação'
                        }
                    }
                }
            }
        },
        paths: {
            '/agentes': {
                get: {
                    tags: ['Agentes'],
                    summary: 'Lista todos os agentes ou realiza busca com filtros',
                    description: 'Retorna uma lista de agentes com possibilidade de filtrar por cargo e ordenar por data de incorporação',
                    parameters: [
                        {
                            in: 'query',
                            name: 'cargo',
                            required: false,
                            schema: {
                                type: 'string'
                            },
                            description: 'Filtra agentes pelo cargo'
                        },
                        {
                            in: 'query',
                            name: 'sort',
                            required: false,
                            schema: {
                                type: 'string',
                                enum: ['dataDeIncorporacao', '-dataDeIncorporacao']
                            },
                            description: 'Ordena pela data de incorporação (dataDeIncorporacao = crescente, -dataDeIncorporacao = decrescente)'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de agentes encontrados com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Agente'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno do servidor',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Agentes'],
                    summary: 'Cria um novo agente',
                    description: 'Cadastra um novo agente no sistema',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['nome', 'dataDeIncorporacao', 'cargo'],
                                    properties: {
                                        nome: {
                                            type: 'string',
                                            description: 'Nome do agente'
                                        },
                                        dataDeIncorporacao: {
                                            type: 'string',
                                            format: 'date',
                                            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                                            description: 'Data de incorporação (formato YYYY-MM-DD)'
                                        },
                                        cargo: {
                                            type: 'string',
                                            description: 'Cargo do agente'
                                        }
                                    }
                                },
                                example: {
                                    nome: 'Jorge da Silva',
                                    dataDeIncorporacao: '2003-01-01',
                                    cargo: 'Investigador'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Agente criado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Agente'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/agentes/{id}': {
                get: {
                    tags: ['Agentes'],
                    summary: 'Busca um agente por ID',
                    description: 'Retorna os dados de um agente específico',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do agente'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Agente encontrado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Agente'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: ['Agentes'],
                    summary: 'Atualiza completamente um agente',
                    description: 'Atualiza todos os dados de um agente existente',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do agente'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['nome', 'dataDeIncorporacao', 'cargo'],
                                    properties: {
                                        nome: {
                                            type: 'string'
                                        },
                                        dataDeIncorporacao: {
                                            type: 'string',
                                            format: 'date'
                                        },
                                        cargo: {
                                            type: 'string'
                                        }
                                    }
                                },
                                example: {
                                    nome: 'Jorge Oliveira',
                                    dataDeIncorporacao: '2005-01-01',
                                    cargo: 'Agente'
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Agente atualizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Agente'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                patch: {
                    tags: ['Agentes'],
                    summary: 'Atualiza parcialmente um agente',
                    description: 'Atualiza apenas os campos informados de um agente existente',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            description: 'ID do agente'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: {
                                            type: 'string'
                                        },
                                        dataDeIncorporacao: {
                                            type: 'string',
                                            format: 'date'
                                        },
                                        cargo: {
                                            type: 'string'
                                        }
                                    }
                                },
                                example: {
                                    cargo: 'Investigador'
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Agente atualizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Agente'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Agentes'],
                    summary: 'Remove um agente',
                    description: 'Remove um agente do sistema',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do agente'
                        }
                    ],
                    responses: {
                        204: {
                            description: 'Agente removido com sucesso'
                        },
                        404: {
                            description: 'Agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/casos': {
                get: {
                    tags: ['Casos'],
                    summary: 'Lista todos os casos ou realiza busca com filtros',
                    description: 'Retorna uma lista de casos com possibilidade de filtrar por status e agente responsável',
                    parameters: [
                        {
                            in: 'query',
                            name: 'status',
                            required: false,
                            schema: {
                                type: 'string',
                                enum: ['aberto', 'solucionado']
                            },
                            description: 'Filtra casos pelo status'
                        },
                        {
                            in: 'query',
                            name: 'agente_id',
                            required: false,
                            schema: {
                                type: 'integer',
                            },
                            description: 'Filtra casos pelo ID do agente responsável'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de casos encontrados com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Caso'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno do servidor',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Casos'],
                    summary: 'Cria um novo caso',
                    description: 'Cadastra um novo caso no sistema',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['titulo', 'descricao', 'status', 'agente_id'],
                                    properties: {
                                        titulo: {
                                            type: 'string',
                                            description: 'Título do caso'
                                        },
                                        descricao: {
                                            type: 'string',
                                            description: 'Descrição detalhada do caso'
                                        },
                                        status: {
                                            type: 'string',
                                            enum: ['aberto', 'solucionado'],
                                            description: 'Status do caso'
                                        },
                                        agente_id: {
                                            type: 'integer',
                                            description: 'ID do agente responsável'
                                        }
                                    }
                                },
                                example: {
                                    titulo: 'Roubo à mão armada',
                                    descricao: 'Roubo ocorrido no centro da cidade às 15:30',
                                    status: 'aberto',
                                    agente_id: 1
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Caso criado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Caso'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/casos/search': {
                get: {
                    tags: ['Casos'],
                    summary: 'Busca casos por palavra-chave',
                    description: 'Realiza uma busca full-text nos campos título e descrição dos casos',
                    parameters: [
                        {
                            in: 'query',
                            name: 'q',
                            required: false,
                            schema: {
                                type: 'string'
                            },
                            description: 'Palavra-chave para busca nos casos',
                            example: 'homicidio'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de casos filtrados por palavra-chave',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Caso'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno do servidor',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/casos/{id}': {
                get: {
                    tags: ['Casos'],
                    summary: 'Busca um caso por ID',
                    description: 'Retorna os dados de um caso específico',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do caso'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Caso encontrado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Caso'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Caso não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: ['Casos'],
                    summary: 'Atualiza completamente um caso',
                    description: 'Atualiza todos os dados de um caso existente',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do caso'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['titulo', 'descricao', 'status', 'agente_id'],
                                    properties: {
                                        titulo: {
                                            type: 'string'
                                        },
                                        descricao: {
                                            type: 'string'
                                        },
                                        status: {
                                            type: 'string',
                                            enum: ['aberto', 'solucionado']
                                        },
                                        agente_id: {
                                            type: 'integer'
                                        }
                                    }
                                }
                            },
                            example: {
                                titulo: 'Roubo à mão armada - Atualizado',
                                descricao: 'Descrição atualizada do caso',
                                status: 'solucionado',
                                agente_id: 1
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Caso atualizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Caso'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Caso não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                patch: {
                    tags: ['Casos'],
                    summary: 'Atualiza parcialmente um caso',
                    description: 'Atualiza apenas os campos informados de um caso existente',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do caso'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        titulo: {
                                            type: 'string'
                                        },
                                        descricao: {
                                            type: 'string'
                                        },
                                        status: {
                                            type: 'string',
                                            enum: ['aberto', 'solucionado']
                                        },
                                        agente_id: {
                                            type: 'integer'
                                        }
                                    }
                                },
                                example: {
                                    titulo: 'Roubo à mão armada - Atualizado',
                                    descricao: 'Descrição atualizada do caso'
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Caso atualizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Caso'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Caso não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Casos'],
                    summary: 'Remove um caso',
                    description: 'Remove um caso do sistema',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do caso'
                        }
                    ],
                    responses: {
                        204: {
                            description: 'Caso removido com sucesso'
                        },
                        404: {
                            description: 'Caso não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/casos/{id}/agente': {
                get: {
                    tags: ['Casos'],
                    summary: 'Busca o agente responsável por um caso',
                    description: 'Retorna os dados completos do agente responsável por um caso específico',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer',
                            },
                            description: 'ID do caso'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Agente encontrado com sucesso',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Agente'
                                    },
                                    example: {
                                        id: 1,
                                        nome: 'Jorge da Silva',
                                        dataDeIncorporacao: '2003-01-01',
                                        cargo: 'Investigador'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Caso ou agente não encontrado',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno do servidor',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;