require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const GUILD_ID = process.env.GUILD_ID;

/* =========================================================
   CARGOS
========================================================= */

const ROLE_NAMES = [
    '⚜️ Reitor da USP',
    '⚜️ Vice-Reitor',
    '⚜️ Secretário-Geral da Reitoria',
    '⚜️ Secretário Adjunto',
    '⚜️ Diretor Tesoureiro',

    '✦ Diretor da Faculdade',
    '✦ Vice-Diretor',
    '✦ Chefe de Departamento',
    '✦ Secretário Acadêmico',
    '✦ Bibliotecário',

    '📘 Coordenador do Curso de Direito',
    '📘 Coordenador do Curso de Jornalismo',
    '📘 Coordenador do Curso de Magistratura',

    '🖋️ Professor Titular',
    '🖋️ Professor Adjunto',
    '🖋️ Monitor/Assistente',

    '⚖️ Veterano',
    '⚖️ Graduando',
    '⚖️ Calouro',

    '📘 Direito',
    '📘 Jornalismo',
    '📘 Magistratura',

    '👤 Cidadão'
];

/* =========================================================
   CATEGORIAS
========================================================= */

const CATEGORY_NAMES = [
    '01 · INSTITUCIONAL',
    '02 · PROCESSO SELETIVO',
    '03 · VIDA ACADÊMICA',
    '04 · FACULDADE DE DIREITO',
    '05 · FACULDADE DE JORNALISMO',
    '06 · MAGISTRATURA',
    '07 · CORPO DOCENTE',
    '08 · SECRETARIA ACADÊMICA',
    '09 · AVALIAÇÕES',
    '10 · ATENDIMENTO',
    '11 · ADMINISTRAÇÃO',
    '12 · ARQUIVO',
    '13 · SALAS ACADÊMICAS'
];

/* =========================================================
   FUNÇÕES
========================================================= */

function role(guild, name) {
    return guild.roles.cache.find(r => r.name === name);
}

function category(guild, name) {
    return guild.channels.cache.find(
        c =>
            c.type === ChannelType.GuildCategory &&
            c.name === name
    );
}

function permissions(id, allow = [], deny = []) {
    return {
        id,
        allow,
        deny
    };
}

function getTextChannels(guild, categoryName) {
    const cat = category(guild, categoryName);

    if (!cat) return [];

    return guild.channels.cache.filter(
        c =>
            c.parentId === cat.id &&
            c.type === ChannelType.GuildText
    );
}

function getVoiceChannels(guild, categoryName) {
    const cat = category(guild, categoryName);

    if (!cat) return [];

    return guild.channels.cache.filter(
        c =>
            c.parentId === cat.id &&
            c.type === ChannelType.GuildVoice
    );
}

/* =========================================================
   GRUPOS DE CARGOS
========================================================= */

function reitoria(roles) {
    return [
        roles['⚜️ Reitor da USP'],
        roles['⚜️ Vice-Reitor'],
        roles['⚜️ Secretário-Geral da Reitoria'],
        roles['⚜️ Secretário Adjunto'],
        roles['⚜️ Diretor Tesoureiro']
    ].filter(Boolean);
}

function diretoria(roles) {
    return [
        roles['✦ Diretor da Faculdade'],
        roles['✦ Vice-Diretor'],
        roles['✦ Chefe de Departamento'],
        roles['✦ Secretário Acadêmico'],
        roles['✦ Bibliotecário']
    ].filter(Boolean);
}

function coordenacao(roles) {
    return [
        roles['📘 Coordenador do Curso de Direito'],
        roles['📘 Coordenador do Curso de Jornalismo'],
        roles['📘 Coordenador do Curso de Magistratura']
    ].filter(Boolean);
}

function docentes(roles) {
    return [
        roles['🖋️ Professor Titular'],
        roles['🖋️ Professor Adjunto'],
        roles['🖋️ Monitor/Assistente']
    ].filter(Boolean);
}

function discentes(roles) {
    return [
        roles['⚖️ Veterano'],
        roles['⚖️ Graduando'],
        roles['⚖️ Calouro']
    ].filter(Boolean);
}

function administracao(roles) {
    return [
        ...reitoria(roles),
        ...diretoria(roles)
    ];
}

function gestaoAcademica(roles) {
    return [
        ...reitoria(roles),
        ...diretoria(roles),
        ...coordenacao(roles),
        ...docentes(roles)
    ];
}

/* =========================================================
   PERMISSÕES DE CATEGORIA
========================================================= */

async function setCategoryPermissions(cat, overwrites) {
    if (!cat) return;

    await cat.permissionOverwrites.set(overwrites);
}

/* =========================================================
   01 · INSTITUCIONAL
========================================================= */

async function configurarInstitucional(guild, roles) {
    const cat = category(guild, '01 · INSTITUCIONAL');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages
            ]
        )
    ];

    await setCategoryPermissions(cat, overwrites);

    const channels = getTextChannels(guild, '01 · INSTITUCIONAL');

    for (const channel of channels.values()) {
        if (
            channel.name === '┃ comunicados' ||
            channel.name === '┃ sobre-a-universidade' ||
            channel.name === '┃ regulamento' ||
            channel.name === '┃ calendário-acadêmico'
        ) {
            await channel.permissionOverwrites.edit(
                guild.roles.everyone.id,
                {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: false
                }
            );

            for (const r of reitoria(roles)) {
                await channel.permissionOverwrites.edit(r.id, {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: true,
                    ManageMessages: true
                });
            }
        }
    }
}

/* =========================================================
   02 · PROCESSO SELETIVO
========================================================= */

async function configurarProcessoSeletivo(guild, roles) {
    const cat = category(guild, '02 · PROCESSO SELETIVO');
    if (!cat) return;

    await setCategoryPermissions(cat, [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages
            ]
        )
    ]);

    const channels = getTextChannels(
        guild,
        '02 · PROCESSO SELETIVO'
    );

    for (const channel of channels.values()) {
        if (
            channel.name === '┃ edital' ||
            channel.name === '┃ orientações' ||
            channel.name === '┃ resultados'
        ) {
            await channel.permissionOverwrites.edit(
                guild.roles.everyone.id,
                {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: false
                }
            );

            for (const r of gestaoAcademica(roles)) {
                await channel.permissionOverwrites.edit(r.id, {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: true,
                    ManageMessages: true
                });
            }
        }
    }
}

/* =========================================================
   03 · VIDA ACADÊMICA
========================================================= */

async function configurarVidaAcademica(guild, roles) {
    const cat = category(guild, '03 · VIDA ACADÊMICA');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory
            ],
            [
                PermissionFlagsBits.SendMessages
            ]
        )
    ];

    for (const r of [
        ...reitoria(roles),
        ...diretoria(roles),
        ...coordenacao(roles),
        ...docentes(roles)
    ]) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    for (const r of discentes(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);

    const channels = getTextChannels(
        guild,
        '03 · VIDA ACADÊMICA'
    );

    const sala = channels.find(
        c => c.name === '┃ sala-dos-alunos'
    );

    if (sala) {
        for (const r of discentes(roles)) {
            await sala.permissionOverwrites.edit(r.id, {
                ViewChannel: true,
                ReadMessageHistory: true,
                SendMessages: true
            });
        }
    }
}

/* =========================================================
   04/05/06 · CURSOS
========================================================= */

async function configurarCurso(guild, roles, categoryName, course) {
    const cat = category(guild, categoryName);
    if (!cat) return;

    const courseRole = roles[`📘 ${course}`];

    const coordinator =
        roles[`📘 Coordenador do Curso de ${course}`];

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ReadMessageHistory
            ],
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages
            ]
        )
    ];

    if (courseRole) {
        overwrites.push(
            permissions(
                courseRole.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    for (const r of discentes(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    if (coordinator) {
        overwrites.push(
            permissions(
                coordinator.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    for (const r of reitoria(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    for (const r of diretoria(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    for (const r of docentes(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);

    const channels = getTextChannels(guild, categoryName);

    for (const channel of channels.values()) {
        if (channel.name === '┃ sala-dos-alunos') {
            for (const r of discentes(roles)) {
                await channel.permissionOverwrites.edit(r.id, {
                    ViewChannel: true,
                    ReadMessageHistory: true,
                    SendMessages: true
                });
            }

            if (courseRole) {
                await channel.permissionOverwrites.edit(
                    courseRole.id,
                    {
                        ViewChannel: true,
                        ReadMessageHistory: true,
                        SendMessages: true
                    }
                );
            }
        }
    }
}

/* =========================================================
   07 · CORPO DOCENTE
========================================================= */

async function configurarCorpoDocente(guild, roles) {
    const cat = category(guild, '07 · CORPO DOCENTE');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [],
            [PermissionFlagsBits.ViewChannel]
        )
    ];

    for (const r of [
        ...reitoria(roles),
        ...diretoria(roles),
        ...coordenacao(roles),
        ...docentes(roles)
    ]) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   08 · SECRETARIA ACADÊMICA
========================================================= */

async function configurarSecretaria(guild, roles) {
    const cat = category(guild, '08 · SECRETARIA ACADÊMICA');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [],
            [PermissionFlagsBits.ViewChannel]
        )
    ];

    for (const r of [
        ...reitoria(roles),
        ...diretoria(roles)
    ]) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    for (const r of coordenacao(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   09 · AVALIAÇÕES
========================================================= */

async function configurarAvaliacoes(guild, roles) {
    const cat = category(guild, '09 · AVALIAÇÕES');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [],
            [PermissionFlagsBits.ViewChannel]
        )
    ];

    for (const r of gestaoAcademica(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   10 · ATENDIMENTO
========================================================= */

async function configurarAtendimento(guild, roles) {
    const cat = category(guild, '10 · ATENDIMENTO');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages
            ]
        )
    ];

    for (const r of [
        ...reitoria(roles),
        ...diretoria(roles),
        ...coordenacao(roles)
    ]) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   11 · ADMINISTRAÇÃO
========================================================= */

async function configurarAdministracao(guild, roles) {
    const cat = category(guild, '11 · ADMINISTRAÇÃO');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [],
            [PermissionFlagsBits.ViewChannel]
        )
    ];

    for (const r of administracao(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.ManageChannels
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   12 · ARQUIVO
========================================================= */

async function configurarArquivo(guild, roles) {
    const cat = category(guild, '12 · ARQUIVO');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [],
            [PermissionFlagsBits.ViewChannel]
        )
    ];

    for (const r of administracao(roles)) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   13 · SALAS ACADÊMICAS
========================================================= */

async function configurarSalas(guild, roles) {
    const cat = category(guild, '13 · SALAS ACADÊMICAS');
    if (!cat) return;

    const overwrites = [
        permissions(
            guild.roles.everyone.id,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak
            ]
        )
    ];

    for (const r of [
        ...reitoria(roles),
        ...diretoria(roles),
        ...coordenacao(roles),
        ...docentes(roles),
        ...discentes(roles)
    ]) {
        overwrites.push(
            permissions(
                r.id,
                [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak
                ]
            )
        );
    }

    await setCategoryPermissions(cat, overwrites);
}

/* =========================================================
   EXECUÇÃO
========================================================= */

client.once('clientReady', async () => {
    try {
        console.log('');
        console.log('========================================');
        console.log('USP • CONFIGURAÇÃO DE PERMISSÕES');
        console.log('========================================');

        const guild = await client.guilds.fetch(GUILD_ID);

        await guild.roles.fetch();
        await guild.channels.fetch();

        const roles = {};

        for (const name of ROLE_NAMES) {
            const found = role(guild, name);

            if (!found) {
                console.log(`⚠️ Cargo não encontrado: ${name}`);
            } else {
                roles[name] = found;
            }
        }

        console.log('');
        console.log('[1/10] Institucional...');
        await configurarInstitucional(guild, roles);

        console.log('[2/10] Processo seletivo...');
        await configurarProcessoSeletivo(guild, roles);

        console.log('[3/10] Vida acadêmica...');
        await configurarVidaAcademica(guild, roles);

        console.log('[4/10] Direito...');
        await configurarCurso(
            guild,
            roles,
            '04 · FACULDADE DE DIREITO',
            'Direito'
        );

        console.log('[5/10] Jornalismo...');
        await configurarCurso(
            guild,
            roles,
            '05 · FACULDADE DE JORNALISMO',
            'Jornalismo'
        );

        console.log('[6/10] Magistratura...');
        await configurarCurso(
            guild,
            roles,
            '06 · MAGISTRATURA',
            'Magistratura'
        );

        console.log('[7/10] Corpo docente...');
        await configurarCorpoDocente(guild, roles);

        console.log('[8/10] Secretaria e avaliações...');
        await configurarSecretaria(guild, roles);
        await configurarAvaliacoes(guild, roles);

        console.log('[9/10] Atendimento e administração...');
        await configurarAtendimento(guild, roles);
        await configurarAdministracao(guild, roles);
        await configurarArquivo(guild, roles);

        console.log('[10/10] Salas acadêmicas...');
        await configurarSalas(guild, roles);

        console.log('');
        console.log('========================================');
        console.log('PERMISSÕES APLICADAS COM SUCESSO');
        console.log('========================================');

    } catch (error) {
        console.error('');
        console.error('ERRO AO APLICAR PERMISSÕES:');
        console.error(error);
    } finally {
        client.destroy();
    }
});

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
