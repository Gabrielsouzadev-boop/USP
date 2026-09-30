require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    ChannelType,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        await guild.channels.fetch();

        const categoria = guild.channels.cache.find(
            c =>
                c.type === ChannelType.GuildCategory &&
                c.name === '01 · INSTITUCIONAL'
        );

        if (!categoria) {
            throw new Error('Categoria "01 · INSTITUCIONAL" não encontrada.');
        }

        const existente = guild.channels.cache.find(
            c =>
                c.type === ChannelType.GuildText &&
                c.name === '┃ chat-geral' &&
                c.parentId === categoria.id
        );

        if (existente) {
            console.log('O canal ┃ chat-geral já existe.');
            process.exit(0);
        }

        const canal = await guild.channels.create({
            name: '┃ chat-geral',
            type: ChannelType.GuildText,
            parent: categoria.id,
            topic: 'Espaço geral para convivência e conversa entre os membros da USP.',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                }
            ]
        });

        console.log('========================================');
        console.log('CANAL CRIADO COM SUCESSO');
        console.log('========================================');
        console.log(`Canal: ${canal.name}`);
        console.log(`Categoria: ${categoria.name}`);
        console.log('Acesso: todos os membros');
        console.log('========================================');

        process.exit(0);

    } catch (error) {
        console.error('ERRO:', error);
        process.exit(1);
    }
});

client.login(process.env.TOKEN);
