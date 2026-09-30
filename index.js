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

const rolesConfig = [
    ['━━━━━━━━ REITORIA ━━━━━━━━', '#2B2D31'],
    ['━━━━━━━━ DIRETORIA DA FACULDADE ━━━━━━━━', '#2B2D31'],
    ['━━━━━━━━ COORDENAÇÃO DE CURSOS ━━━━━━━━', '#2B2D31'],
    ['━━━━━━━━ CORPO DOCENTE ━━━━━━━━', '#2B2D31'],
    ['━━━━━━━━ CORPO DISCENTE ━━━━━━━━', '#2B2D31'],

    ['⚜️ Reitor da USP', '#C9A227'],
    ['⚜️ Vice-Reitor', '#B99427'],
    ['⚜️ Secretário-Geral da Reitoria', '#AA8628'],
    ['⚜️ Secretário Adjunto', '#9C7928'],
    ['⚜️ Diretor Tesoureiro', '#8E6D27'],

    ['✦ Diretor da Faculdade', '#B08A2A'],
    ['✦ Vice-Diretor', '#9F7D2B'],
    ['✦ Chefe de Departamento', '#90712C'],
    ['✦ Secretário Acadêmico', '#81652D'],
    ['✦ Bibliotecário', '#72592E'],

    ['📘 Coordenador do Curso de Direito', '#3F6385'],
    ['📘 Coordenador do Curso de Jornalismo', '#496F92'],
    ['📘 Coordenador do Curso de Magistratura', '#527A9F'],

    ['🖋️ Professor Titular', '#756126'],
    ['🖋️ Professor Adjunto', '#806D2D'],
    ['🖋️ Monitor/Assistente', '#8B7835'],

    ['⚖️ Veterano', '#596773'],
    ['⚖️ Graduando', '#667580'],
    ['⚖️ Calouro', '#74818B'],

    ['📘 Direito', '#3F6385'],
    ['📘 Jornalismo', '#496F92'],
    ['📘 Magistratura', '#527A9F'],

    ['👤 Cidadão', '#6B7280']
];

const structure = {
    '01 · INSTITUCIONAL': [
        ['┃ boas-vindas', 'text'],
        ['┃ comunicados', 'text'],
        ['┃ sobre-a-universidade', 'text'],
        ['┃ regulamento', 'text'],
        ['┃ calendário-acadêmico', 'text']
    ],

    '02 · PROCESSO SELETIVO': [
        ['┃ inscrições', 'text'],
        ['┃ edital', 'text'],
        ['┃ orientações', 'text'],
        ['┃ resultados', 'text']
    ],

    '03 · VIDA ACADÊMICA': [
        ['┃ comunicados-acadêmicos', 'text'],
        ['┃ cursos', 'text'],
        ['┃ cronograma', 'text'],
        ['┃ materiais', 'text'],
        ['┃ sala-dos-alunos', 'text']
    ],

    '04 · FACULDADE DE DIREITO': [
        ['┃ comunicados', 'text'],
        ['┃ cronograma', 'text'],
        ['┃ materiais', 'text'],
        ['┃ avaliações', 'text'],
        ['┃ sala-dos-alunos', 'text']
    ],

    '05 · FACULDADE DE JORNALISMO': [
        ['┃ comunicados', 'text'],
        ['┃ cronograma', 'text'],
        ['┃ materiais', 'text'],
        ['┃ avaliações', 'text'],
        ['┃ sala-dos-alunos', 'text']
    ],

    '06 · MAGISTRATURA': [
        ['┃ comunicados', 'text'],
        ['┃ cronograma', 'text'],
        ['┃ materiais', 'text'],
        ['┃ avaliações', 'text'],
        ['┃ sala-dos-alunos', 'text']
    ],

    '07 · CORPO DOCENTE': [
        ['┃ comunicados-internos', 'text'],
        ['┃ sala-dos-instrutores', 'text'],
        ['┃ planejamento', 'text'],
        ['┃ correção-de-aulas', 'text'],
        ['┃ controle-acadêmico', 'text']
    ],

    '08 · SECRETARIA ACADÊMICA': [
        ['┃ requerimentos', 'text'],
        ['┃ documentos', 'text'],
        ['┃ registros-acadêmicos', 'text'],
        ['┃ resultados', 'text'],
        ['┃ comunicados', 'text']
    ],

    '09 · AVALIAÇÕES': [
        ['┃ provas', 'text'],
        ['┃ gabaritos', 'text'],
        ['┃ resultados', 'text']
    ],

    '10 · ATENDIMENTO': [
        ['┃ central-de-atendimento', 'text']
    ],

    '11 · ADMINISTRAÇÃO': [
        ['┃ comunicados-internos', 'text'],
        ['┃ gestão', 'text'],
        ['┃ reuniões', 'text'],
        ['┃ documentos-internos', 'text']
    ],

    '12 · ARQUIVO': [
        ['┃ registros', 'text'],
        ['┃ documentos-arquivados', 'text'],
        ['┃ atendimentos-encerrados', 'text']
    ],

    '13 · SALAS ACADÊMICAS': [
        ['Sala 01', 'voice'],
        ['Sala 02', 'voice'],
        ['Sala 03', 'voice'],
        ['Auditório', 'voice']
    ]
};

const seniorRoles = [
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

const teachingRoles = [
    '🖋️ Professor Titular',
    '🖋️ Professor Adjunto',
    '🖋️ Monitor/Assistente'
];

const studentRoles = [
    '⚖️ Veterano',
    '⚖️ Graduando',
    '⚖️ Calouro'
];

const academicManagement = [
    ...seniorRoles,
    '📘 Coordenador do Curso de Direito',
    '📘 Coordenador do Curso de Jornalismo',
    '📘 Coordenador do Curso de Magistratura',
    '🖋️ Professor Titular',
    '🖋️ Professor Adjunto',
    '🖋️ Monitor/Assistente'
];

const courseConfig = {
    '04 · FACULDADE DE DIREITO': '📘 Direito',
    '05 · FACULDADE DE JORNALISMO': '📘 Jornalismo',
    '06 · MAGISTRATURA': '📘 Magistratura'
};

function findRole(guild, name) {
    return guild.roles.cache.find(role => role.name === name);
}

function overwrite(role, permissions) {
    return {
        id: role.id,
        allow: permissions
    };
}

function allow(role, permissions) {
    if (!role) return null;
    return overwrite(role, permissions);
}

function denyEveryone(guild, permissions) {
    return {
        id: guild.roles.everyone.id,
        deny: permissions
    };
}

async function ensureRoles(guild) {
    const result = {};

    for (const [name, color] of rolesConfig) {
        let role = findRole(guild, name);

        if (!role) {
            role = await guild.roles.create({
                name,
                color,
                reason: 'USP 2.0 • Estrutura institucional'
            });
        }

        result[name] = role;
    }

    return result;
}

function permissionsForCategory(guild, categoryName, roles) {
    const everyone = guild.roles.everyone;

    const base = {
        ViewChannel: true,
        ReadMessageHistory: true
    };

    const textPublic = {
        ...base,
        SendMessages: true
    };

    if (
        categoryName === '01 · INSTITUCIONAL' ||
        categoryName === '02 · PROCESSO SELETIVO' ||
        categoryName === '10 · ATENDIMENTO'
    ) {
        return [
            {
                id: everyone.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.SendMessages
                ]
            }
        ];
    }

    if (categoryName === '03 · VIDA ACADÊMICA') {
        return [
            denyEveryone(guild, PermissionFlagsBits.SendMessages),
            ...academicManagement
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (courseConfig[categoryName]) {
        const courseRole = roles[courseConfig[categoryName]];

        return [
            denyEveryone(
                guild,
                PermissionFlagsBits.SendMessages
            ),

            allow(courseRole, [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory
            ]),

            ...teachingRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages
                    ]
                ))
                .filter(Boolean),

            ...seniorRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageMessages
                    ]
                ))
                .filter(Boolean),

            ...studentRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '07 · CORPO DOCENTE') {
        return [
            denyEveryone(guild, PermissionFlagsBits.ViewChannel),

            ...academicManagement
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '08 · SECRETARIA ACADÊMICA') {
        return [
            denyEveryone(guild, PermissionFlagsBits.ViewChannel),

            ...seniorRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '09 · AVALIAÇÕES') {
        return [
            denyEveryone(guild, PermissionFlagsBits.ViewChannel),

            ...academicManagement
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '11 · ADMINISTRAÇÃO') {
        return [
            denyEveryone(guild, PermissionFlagsBits.ViewChannel),

            ...seniorRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageMessages
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '12 · ARQUIVO') {
        return [
            denyEveryone(guild, PermissionFlagsBits.ViewChannel),

            ...seniorRoles
                .map(name => allow(
                    roles[name],
                    [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                ))
                .filter(Boolean)
        ];
    }

    if (categoryName === '13 · SALAS ACADÊMICAS') {
        return [
            {
                id: everyone.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak
                ]
            }
        ];
    }

    return [everyone];
}

async function setupServer() {
    const guild = await client.guilds.fetch(GUILD_ID);

    await guild.roles.fetch();
    await guild.channels.fetch();

    console.log(`[USP] Servidor: ${guild.name}`);
    console.log('[USP] Criando cargos...');

    const roles = await ensureRoles(guild);

    console.log('[USP] Criando categorias e canais...');

    for (const [categoryName, channels] of Object.entries(structure)) {
        let category = guild.channels.cache.find(
            channel =>
                channel.type === ChannelType.GuildCategory &&
                channel.name === categoryName
        );

        const overwrites = permissionsForCategory(
            guild,
            categoryName,
            roles
        );

        if (!category) {
            category = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: overwrites,
                reason: 'USP 2.0 • Estrutura institucional'
            });
        } else {
            await category.permissionOverwrites.set(overwrites);
        }

        for (const [channelName, type] of channels) {
            let channel = guild.channels.cache.find(
                channel =>
                    channel.parentId === category.id &&
                    channel.name === channelName
            );

            if (!channel) {
                channel = await guild.channels.create({
                    name: channelName,
                    type:
                        type === 'voice'
                            ? ChannelType.GuildVoice
                            : ChannelType.GuildText,
                    parent: category.id,
                    reason: 'USP 2.0 • Estrutura institucional'
                });
            }

            await channel.permissionOverwrites.set(overwrites);
        }
    }

    console.log('================================');
    console.log('USP 2.0 • ESTRUTURA CONCLUÍDA');
    console.log('================================');
    console.log(`Servidor: ${guild.name}`);
    console.log(`Cargos: ${guild.roles.cache.size}`);
    console.log(`Canais: ${guild.channels.cache.size}`);
    console.log('Permissões: OK');
    console.log('Estrutura acadêmica: OK');
    console.log('================================');
}

client.once('clientReady', async () => {
    console.log('================================');
    console.log('USP • UNIVERSIDADE DE SÃO PAULO');
    console.log('================================');
    console.log(`Bot: ${client.user.tag}`);
    console.log(`Servidores: ${client.guilds.cache.size}`);
    console.log('================================');

    try {
        await setupServer();
    } catch (error) {
        console.error('[SETUP]', error);
    }
});

client.on('guildMemberAdd', async member => {
    try {
        const role = findRole(member.guild, '👤 Cidadão');

        if (role) {
            await member.roles.add(
                role,
                'USP 2.0 • Entrada institucional'
            );

            console.log(
                `[ENTRADA] ${member.user.tag} → ${role.name}`
            );
        }
    } catch (error) {
        console.error('[ENTRADA]', error);
    }
});

client.on('error', error => {
    console.error('[DISCORD]', error);
});

process.on('unhandledRejection', error => {
    console.error('[UNHANDLED]', error);
});

process.on('uncaughtException', error => {
    console.error('[UNCAUGHT]', error);
});

if (!process.env.TOKEN) {
    console.error('[ERRO] TOKEN não configurado.');
    process.exit(1);
}

if (!process.env.GUILD_ID) {
    console.error('[ERRO] GUILD_ID não configurado.');
    process.exit(1);
}

client.login(process.env.TOKEN);
