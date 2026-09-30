const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');
const path = require('path');

const PAINEL_TITULO = '🏛️ PAINEL ADMINISTRATIVO';

const ADMIN_ROLES = [
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
    '📘 Coordenador do Curso de Magistratura'
];

async function inicializarPainelAdministrativo(guild) {
    const categoria = guild.channels.cache.find(
        channel =>
            channel.type === 4 &&
            channel.name === '11 · ADMINISTRAÇÃO'
    );

    if (!categoria) {
        console.log('[PAINEL] Categoria 11 · ADMINISTRAÇÃO não encontrada.');
        return;
    }

    let canal = guild.channels.cache.find(
        channel =>
            channel.parentId === categoria.id &&
            (
                channel.name === '┃-painel-administrativo' ||
                channel.name === 'painel-administrativo'
            )
    );

    if (!canal) {
        canal = await guild.channels.create({
            name: '┃ painel-administrativo',
            type: 0,
            parent: categoria.id,
            reason: 'Criação do Painel Administrativo da USP'
        });

        console.log(`[PAINEL] Canal criado: ${canal.name}`);
    } else {
        console.log(`[PAINEL] Canal encontrado: ${canal.name}`);
    }

    const everyone = guild.roles.everyone;

    await canal.permissionOverwrites.edit(everyone, {
        ViewChannel: false
    });

    for (const roleName of ADMIN_ROLES) {
        const role = guild.roles.cache.find(
            role => role.name === roleName
        );

        if (!role) {
            console.log(`[PAINEL] Cargo não encontrado: ${roleName}`);
            continue;
        }

        await canal.permissionOverwrites.edit(role, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: true
        });
    }

    const mensagens = await canal.messages.fetch({
        limit: 50
    });

    const painelExistente = mensagens.find(
        message =>
            message.author.id === guild.client.user.id &&
            message.embeds.some(
                embed => embed.title === PAINEL_TITULO
            )
    );

    if (painelExistente) {
        console.log('[PAINEL] Painel já existe. Nenhuma mensagem duplicada criada.');
        return;
    }

    const imagem = path.join(
        process.cwd(),
        'assets',
        'usp-comunicado.png'
    );

    const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(PAINEL_TITULO)
        .setDescription(
            [
                'Central de gestão institucional da Universidade de São Paulo.',
                '',
                'Selecione abaixo o sistema que deseja acessar.',
                '',
                'Todos os módulos respeitam a hierarquia e as permissões administrativas.'
            ].join('\n')
        )
        .setImage('attachment://usp-comunicado.png')
        .setFooter({
            text: 'USP • Universidade de São Paulo'
        })
        .setTimestamp();

    const linha1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('usp_painel_comunicados')
            .setLabel('Comunicados')
            .setEmoji('📢')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_anuncios')
            .setLabel('Anúncios')
            .setEmoji('📣')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_moderacao')
            .setLabel('Moderação')
            .setEmoji('🛡️')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_atendimento')
            .setLabel('Atendimento')
            .setEmoji('🎫')
            .setStyle(ButtonStyle.Secondary)
    );

    const linha2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('usp_painel_academico')
            .setLabel('Acadêmico')
            .setEmoji('🎓')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_enquetes')
            .setLabel('Enquetes')
            .setEmoji('📊')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_logs')
            .setLabel('Logs')
            .setEmoji('📋')
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId('usp_painel_configuracoes')
            .setLabel('Configurações')
            .setEmoji('⚙️')
            .setStyle(ButtonStyle.Secondary)
    );

    await canal.send({
        embeds: [embed],
        files: [
            {
                attachment: imagem,
                name: 'usp-comunicado.png'
            }
        ],
        components: [
            linha1,
            linha2
        ]
    });

    console.log('[PAINEL] Painel Administrativo criado com sucesso.');
}

module.exports = {
    inicializarPainelAdministrativo
};
