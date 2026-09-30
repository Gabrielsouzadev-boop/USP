const { inicializarPainelAdministrativo } = require('./painel-administrativo');
require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const GUILD_ID = process.env.GUILD_ID;

/* =========================================================
   CONFIGURAÇÃO DE CARGOS
========================================================= */

const ROLE_GROUPS = [
    {
        divider: '━━━━━━━━ REITORIA ━━━━━━━━',
        roles: [
            ['⚜️ Reitor da USP', '#C9A227'],
            ['⚜️ Vice-Reitor', '#B99427'],
            ['⚜️ Secretário-Geral da Reitoria', '#AA8628'],
            ['⚜️ Secretário Adjunto', '#9C7928'],
            ['⚜️ Diretor Tesoureiro', '#8E6D27']
        ]
    },
    {
        divider: '━━━━━━━━ DIRETORIA DA FACULDADE ━━━━━━━━',
        roles: [
            ['✦ Diretor da Faculdade', '#B08A2A'],
            ['✦ Vice-Diretor', '#9F7D2B'],
            ['✦ Chefe de Departamento', '#90712C'],
            ['✦ Secretário Acadêmico', '#81652D'],
            ['✦ Bibliotecário', '#72592E']
        ]
    },
    {
        divider: '━━━━━━━━ COORDENAÇÃO DE CURSOS ━━━━━━━━',
        roles: [
            ['📘 Coordenador do Curso de Direito', '#3F6385'],
            ['📘 Coordenador do Curso de Jornalismo', '#496F92'],
            ['📘 Coordenador do Curso de Magistratura', '#527A9F']
        ]
    },
    {
        divider: '━━━━━━━━ CORPO DOCENTE ━━━━━━━━',
        roles: [
            ['🖋️ Professor Titular', '#756126'],
            ['🖋️ Professor Adjunto', '#806D2D'],
            ['🖋️ Monitor/Assistente', '#8B7835']
        ]
    },
    {
        divider: '━━━━━━━━ CORPO DISCENTE ━━━━━━━━',
        roles: [
            ['⚖️ Veterano', '#596773'],
            ['⚖️ Graduando', '#667580'],
            ['⚖️ Calouro', '#74818B']
        ]
    },
    {
        divider: '━━━━━━━━ CARGOS ACADÊMICOS ━━━━━━━━',
        roles: [
            ['📘 Direito', '#34495E'],
            ['📘 Jornalismo', '#405A72'],
            ['📘 Magistratura', '#4A647D']
        ]
    }
];

const SPECIAL_ROLE = ['👤 Cidadão', '#6B7280'];

const ALL_ROLE_NAMES = [
    ...ROLE_GROUPS.flatMap(group => [
        group.divider,
        ...group.roles.map(role => role[0])
    ]),
    SPECIAL_ROLE[0]
];

/* =========================================================
   ESTRUTURA DO SERVIDOR
========================================================= */

const CATEGORIES = [
    {
        name: '01 · INSTITUCIONAL',
        type: 'public',
        channels: [
            '┃ boas-vindas',
            '┃ comunicados',
            '┃ sobre-a-universidade',
            '┃ regulamento',
            '┃ calendário-acadêmico'
        ]
    },
    {
        name: '02 · PROCESSO SELETIVO',
        type: 'public',
        channels: [
            '┃ inscrições',
            '┃ edital',
            '┃ orientações',
            '┃ resultados'
        ]
    },
    {
        name: '03 · VIDA ACADÊMICA',
        type: 'academic',
        channels: [
            '┃ comunicados-acadêmicos',
            '┃ cursos',
            '┃ cronograma',
            '┃ materiais',
            '┃ sala-dos-alunos'
        ]
    },
    {
        name: '04 · FACULDADE DE DIREITO',
        type: 'course',
        course: 'Direito',
        channels: [
            '┃ comunicados',
            '┃ cronograma',
            '┃ materiais',
            '┃ avaliações',
            '┃ sala-dos-alunos'
        ]
    },
    {
        name: '05 · FACULDADE DE JORNALISMO',
        type: 'course',
        course: 'Jornalismo',
        channels: [
            '┃ comunicados',
            '┃ cronograma',
            '┃ materiais',
            '┃ avaliações',
            '┃ sala-dos-alunos'
        ]
    },
    {
        name: '06 · MAGISTRATURA',
        type: 'course',
        course: 'Magistratura',
        channels: [
            '┃ comunicados',
            '┃ cronograma',
            '┃ materiais',
            '┃ avaliações',
            '┃ sala-dos-alunos'
        ]
    },
    {
        name: '07 · CORPO DOCENTE',
        type: 'staff',
        channels: [
            '┃ comunicados-internos',
            '┃ sala-dos-instrutores',
            '┃ planejamento',
            '┃ correção-de-aulas',
            '┃ controle-acadêmico'
        ]
    },
    {
        name: '08 · SECRETARIA ACADÊMICA',
        type: 'secretaria',
        channels: [
            '┃ requerimentos',
            '┃ documentos',
            '┃ registros-acadêmicos',
            '┃ resultados',
            '┃ comunicados'
        ]
    },
    {
        name: '09 · AVALIAÇÕES',
        type: 'avaliacoes',
        channels: [
            '┃ provas',
            '┃ gabaritos',
            '┃ resultados'
        ]
    },
    {
        name: '10 · ATENDIMENTO',
        type: 'public',
        channels: [
            '┃ central-de-atendimento'
        ]
    },
    {
        name: '11 · ADMINISTRAÇÃO',
        type: 'admin',
        channels: [
            '┃ comunicados-internos',
            '┃ gestão',
            '┃ reuniões',
            '┃ documentos-internos'
        ]
    },
    {
        name: '12 · ARQUIVO',
        type: 'archive',
        channels: [
            '┃ registros',
            '┃ documentos-arquivados',
            '┃ atendimentos-encerrados'
        ]
    },
    {
        name: '13 · SALAS ACADÊMICAS',
        type: 'voice',
        channels: [
            '🔊 Sala 01',
            '🔊 Sala 02',
            '🔊 Sala 03',
            '🔊 Auditório'
        ]
    }
];

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function findRole(guild, name) {
    return guild.roles.cache.find(role => role.name === name);
}

function overwrite(id, allow = [], deny = []) {
    return {
        id,
        allow,
        deny
    };
}

/* =========================================================
   LIMPEZA
========================================================= */

async function clearServer(guild) {
    console.log('[1/6] Limpando canais e categorias...');

    const channels = [...guild.channels.cache.values()];

    for (const channel of channels) {
        try {
            await channel.delete('Reconstrução completa da estrutura USP');
        } catch (error) {
            console.log(`Não foi possível excluir ${channel.name}: ${error.message}`);
        }
    }

    console.log('[OK] Canais e categorias removidos.');

    console.log('[2/6] Limpando cargos personalizados...');

    const roles = [...guild.roles.cache.values()];

    for (const role of roles) {
        if (role.id === guild.id) continue;
        if (role.managed) continue;

        try {
            await role.delete('Reconstrução completa da hierarquia USP');
        } catch (error) {
            console.log(`Não foi possível excluir ${role.name}: ${error.message}`);
        }
    }

    console.log('[OK] Cargos personalizados removidos.');
}

/* =========================================================
   CARGOS
========================================================= */

async function createRoles(guild) {
    console.log('[3/6] Criando cargos...');

    const roles = {};

    for (const group of ROLE_GROUPS) {
        const divider = await guild.roles.create({
            name: group.divider,
            color: '#2B2D31',
            permissions: [],
            mentionable: false,
            hoist: true,
            reason: 'Estrutura institucional USP'
        });

        roles[group.divider] = divider;

        for (const [name, color] of group.roles) {
            const permissions = [];

            if (name === '⚜️ Reitor da USP') {
                permissions.push(PermissionFlagsBits.Administrator);
            }

            const role = await guild.roles.create({
                name,
                color,
                permissions,
                mentionable: true,
                hoist: true,
                reason: 'Estrutura institucional USP'
            });

            roles[name] = role;
        }
    }

    const citizen = await guild.roles.create({
        name: SPECIAL_ROLE[0],
        color: SPECIAL_ROLE[1],
        permissions: [],
        mentionable: true,
        hoist: false,
        reason: 'Cargo padrão de cidadãos'
    });

    roles[SPECIAL_ROLE[0]] = citizen;

    console.log('[OK] Cargos criados.');

    return roles;
}

/* =========================================================
   HIERARQUIA
========================================================= */

async function organizeRoles(guild, roles) {
    console.log('[4/6] Organizando hierarquia...');

    const orderedTopToBottom = [];

    for (const group of ROLE_GROUPS) {
        for (const [name] of group.roles) {
            orderedTopToBottom.push(name);
        }

        orderedTopToBottom.push(group.divider);
    }

    orderedTopToBottom.push(SPECIAL_ROLE[0]);

    const botMember = await guild.members.fetchMe();
    const botRole = botMember.roles.highest;

    const positions = [];

    let position = botRole.position - 1;

    for (const name of orderedTopToBottom) {
        const role = roles[name];

        if (!role) continue;

        if (position <= 0) break;

        positions.push({
            role: role.id,
            position
        });

        position--;
    }

    await guild.roles.setPositions(positions);

    console.log('[OK] Hierarquia organizada.');
}

/* =========================================================
   PERMISSÕES
========================================================= */

function buildPublicPermissions(guild) {
    return [
        overwrite(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages
            ]
        )
    ];
}

function buildAcademicPermissions(guild, roles) {
    return [
        overwrite(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory
            ],
            [
                PermissionFlagsBits.SendMessages
            ]
        ),

        overwrite(
            roles['⚜️ Reitor da USP'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['⚜️ Vice-Reitor'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['✦ Diretor da Faculdade'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['✦ Vice-Diretor'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['📘 Coordenador do Curso de Direito'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['📘 Coordenador do Curso de Jornalismo'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['📘 Coordenador do Curso de Magistratura'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages
            ]
        ),

        overwrite(
            roles['🖋️ Professor Titular'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
            ]
        ),

        overwrite(
            roles['🖋️ Professor Adjunto'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
            ]
        ),

        overwrite(
            roles['🖋️ Monitor/Assistente'].id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
            ]
        )
    ];
}

function buildCoursePermissions(guild, roles, course) {
    const courseRole = roles[`📘 ${course}`];

    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ReadMessageHistory
            ],
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages
            ]
        ),

        overwrite(
            courseRole.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory
            ]
        )
    ];

    const academicManagement = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        `📘 Coordenador do Curso de ${course}`
    ];

    for (const name of academicManagement) {
        if (roles[name]) {
            permissions.push(
                overwrite(
                    roles[name].id,
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages
                    ]
                )
            );
        }
    }

    const teachers = [
        '🖋️ Professor Titular',
        '🖋️ Professor Adjunto',
        '🖋️ Monitor/Assistente'
    ];

    for (const name of teachers) {
        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    const students = [
        '⚖️ Veterano',
        '⚖️ Graduando',
        '⚖️ Calouro'
    ];

    for (const name of students) {
        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    return permissions;
}

function buildStaffPermissions(guild, roles) {
    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [],
            [
                PermissionFlagsBits.ViewChannel
            ]
        )
    ];

    const staff = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '⚜️ Secretário-Geral da Reitoria',
        '⚜️ Secretário Adjunto',
        '⚜️ Diretor Tesoureiro',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        '✦ Chefe de Departamento',
        '✦ Secretário Acadêmico',
        '📘 Coordenador do Curso de Direito',
        '📘 Coordenador do Curso de Jornalismo',
        '📘 Coordenador do Curso de Magistratura',
        '🖋️ Professor Titular',
        '🖋️ Professor Adjunto',
        '🖋️ Monitor/Assistente'
    ];

    for (const name of staff) {
        if (!roles[name]) continue;

        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    return permissions;
}

function buildSecretariaPermissions(guild, roles) {
    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [],
            [
                PermissionFlagsBits.ViewChannel
            ]
        )
    ];

    const allowed = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '⚜️ Secretário-Geral da Reitoria',
        '⚜️ Secretário Adjunto',
        '⚜️ Diretor Tesoureiro',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        '✦ Secretário Acadêmico',
        '📘 Coordenador do Curso de Direito',
        '📘 Coordenador do Curso de Jornalismo',
        '📘 Coordenador do Curso de Magistratura'
    ];

    for (const name of allowed) {
        if (!roles[name]) continue;

        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    return permissions;
}

function buildEvaluationPermissions(guild, roles) {
    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [],
            [
                PermissionFlagsBits.ViewChannel
            ]
        )
    ];

    const allowed = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        '✦ Chefe de Departamento',
        '📘 Coordenador do Curso de Direito',
        '📘 Coordenador do Curso de Jornalismo',
        '📘 Coordenador do Curso de Magistratura',
        '🖋️ Professor Titular',
        '🖋️ Professor Adjunto',
        '🖋️ Monitor/Assistente'
    ];

    for (const name of allowed) {
        if (!roles[name]) continue;

        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    return permissions;
}

function buildAdminPermissions(guild, roles) {
    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [],
            [
                PermissionFlagsBits.ViewChannel
            ]
        )
    ];

    const allowed = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '⚜️ Secretário-Geral da Reitoria',
        '⚜️ Secretário Adjunto',
        '⚜️ Diretor Tesoureiro',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        '✦ Chefe de Departamento',
        '✦ Secretário Acadêmico'
    ];

    for (const name of allowed) {
        if (!roles[name]) continue;

        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.ManageChannels
                ]
            )
        );
    }

    return permissions;
}

function buildArchivePermissions(guild, roles) {
    const permissions = [
        overwrite(
            guild.roles.everyone.id,
            [],
            [
                PermissionFlagsBits.ViewChannel
            ]
        )
    ];

    const allowed = [
        '⚜️ Reitor da USP',
        '⚜️ Vice-Reitor',
        '⚜️ Secretário-Geral da Reitoria',
        '⚜️ Secretário Adjunto',
        '⚜️ Diretor Tesoureiro',
        '✦ Diretor da Faculdade',
        '✦ Vice-Diretor',
        '✦ Chefe de Departamento',
        '✦ Secretário Acadêmico'
    ];

    for (const name of allowed) {
        if (!roles[name]) continue;

        permissions.push(
            overwrite(
                roles[name].id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    return permissions;
}

function buildVoicePermissions(guild) {
    return [
        overwrite(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak
            ]
        )
    ];
}

/* =========================================================
   CRIAÇÃO DE CATEGORIAS E CANAIS
========================================================= */

async function createServerStructure(guild, roles) {
    console.log('[5/6] Criando categorias e canais...');

    for (const categoryConfig of CATEGORIES) {
        let permissionOverwrites;

        switch (categoryConfig.type) {
            case 'public':
                permissionOverwrites = buildPublicPermissions(guild);
                break;

            case 'academic':
                permissionOverwrites = buildAcademicPermissions(guild, roles);
                break;

            case 'course':
                permissionOverwrites = buildCoursePermissions(
                    guild,
                    roles,
                    categoryConfig.course
                );
                break;

            case 'staff':
                permissionOverwrites = buildStaffPermissions(guild, roles);
                break;

            case 'secretaria':
                permissionOverwrites = buildSecretariaPermissions(guild, roles);
                break;

            case 'avaliacoes':
                permissionOverwrites = buildEvaluationPermissions(guild, roles);
                break;

            case 'admin':
                permissionOverwrites = buildAdminPermissions(guild, roles);
                break;

            case 'archive':
                permissionOverwrites = buildArchivePermissions(guild, roles);
                break;

            case 'voice':
                permissionOverwrites = buildVoicePermissions(guild);
                break;

            default:
                permissionOverwrites = buildPublicPermissions(guild);
        }

        const category = await guild.channels.create({
            name: categoryConfig.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites,
            reason: 'Reconstrução da estrutura institucional USP'
        });

        console.log(`  ✓ ${categoryConfig.name}`);

        for (const channelName of categoryConfig.channels) {
            const isVoice = categoryConfig.type === 'voice';

            const channel = await guild.channels.create({
                name: channelName,
                type: isVoice
                    ? ChannelType.GuildVoice
                    : ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites,
                reason: 'Reconstrução da estrutura institucional USP'
            });

            /*
             * Salas dos alunos:
             * estudantes podem visualizar e escrever.
             */
            if (
                !isVoice &&
                channelName === '┃ sala-dos-alunos'
            ) {
                const studentRoles = [
                    '⚖️ Veterano',
                    '⚖️ Graduando',
                    '⚖️ Calouro'
                ];

                await channel.permissionOverwrites.edit(
                    guild.roles.everyone.id,
                    {
                        ViewChannel: false,
                        SendMessages: false,
                        ReadMessageHistory: true
                    }
                );

                for (const name of studentRoles) {
                    await channel.permissionOverwrites.edit(
                        roles[name].id,
                        {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true
                        }
                    );
                }

                if (categoryConfig.type === 'course') {
                    await channel.permissionOverwrites.edit(
                        roles[`📘 ${categoryConfig.course}`].id,
                        {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true
                        }
                    );
                }
            }
        }
    }

    console.log('[OK] Estrutura criada.');
}

/* =========================================================
   CARGO CIDADÃO
========================================================= */

async function configureMemberRole(guild, roles) {
    client.on('guildMemberAdd', async member => {
        try {
            const citizen = roles['👤 Cidadão'];

            if (!citizen) return;

            await member.roles.add(
                citizen,
                'Cargo padrão de cidadão USP'
            );

            console.log(`[MEMBRO] ${member.user.tag} recebeu 👤 Cidadão.`);
        } catch (error) {
            console.error(
                `[MEMBRO] Erro ao adicionar cargo: ${error.message}`
            );
        }
    });
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

client.once('clientReady', async () => {
    try {
        console.log('');
        console.log('========================================');
        console.log('USP • SISTEMA INSTITUCIONAL');
        console.log('========================================');

        const guild = await client.guilds.fetch(GUILD_ID);

        await guild.channels.fetch();
        await guild.roles.fetch();

        await inicializarPainelAdministrativo(guild);

        console.log(`[OK] Servidor carregado: ${guild.name}`);
        console.log(`[OK] Canais encontrados: ${guild.channels.cache.size}`);
        console.log(`[OK] Cargos encontrados: ${guild.roles.cache.size}`);

        const roles = {};

        for (const role of guild.roles.cache.values()) {
            roles[role.name] = role;
        }

        await organizeRoles(guild, roles);
        await configureMemberRole(guild, roles);

        console.log('');
        console.log('========================================');
        console.log('USP • SISTEMA ONLINE');
        console.log('========================================');
        console.log('A estrutura existente foi preservada.');
        console.log('Nenhum canal ou cargo será apagado automaticamente.');
        console.log('========================================');

    } catch (error) {
        console.error('');
        console.error('========================================');
        console.error('ERRO NA INICIALIZAÇÃO');
        console.error('========================================');
        console.error(error);
    }
});

/* =========================================================
   ERROS
========================================================= */

client.on('error', error => {
    console.error('[DISCORD ERROR]', error);
});

process.on('unhandledRejection', error => {
    console.error('[UNHANDLED REJECTION]', error);
});

process.on('uncaughtException', error => {
    console.error('[UNCAUGHT EXCEPTION]', error);
});

client.login(process.env.TOKEN);
