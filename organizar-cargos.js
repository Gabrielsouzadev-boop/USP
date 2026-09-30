require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const GUILD_ID = process.env.GUILD_ID;

const ORDEM = [
    '━━━━━━━━ REITORIA ━━━━━━━━',
    '⚜️ Reitor da USP',
    '⚜️ Vice-Reitor',
    '⚜️ Secretário-Geral da Reitoria',
    '⚜️ Secretário Adjunto',
    '⚜️ Diretor Tesoureiro',

    '━━━━━━━━ DIRETORIA DA FACULDADE ━━━━━━━━',
    '✦ Diretor da Faculdade',
    '✦ Vice-Diretor',
    '✦ Chefe de Departamento',
    '✦ Secretário Acadêmico',
    '✦ Bibliotecário',

    '━━━━━━━━ COORDENAÇÃO DE CURSOS ━━━━━━━━',
    '📘 Coordenador do Curso de Direito',
    '📘 Coordenador do Curso de Jornalismo',
    '📘 Coordenador do Curso de Magistratura',

    '━━━━━━━━ CORPO DOCENTE ━━━━━━━━',
    '🖋️ Professor Titular',
    '🖋️ Professor Adjunto',
    '🖋️ Monitor/Assistente',

    '━━━━━━━━ CORPO DISCENTE ━━━━━━━━',
    '⚖️ Veterano',
    '⚖️ Graduando',
    '⚖️ Calouro',

    '━━━━━━━━ CARGOS ACADÊMICOS ━━━━━━━━',
    '📘 Direito',
    '📘 Jornalismo',
    '📘 Magistratura',

    '👤 Cidadão'
];

client.once('clientReady', async () => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.roles.fetch();
        const me = await guild.members.fetchMe();

        console.log('================================');
        console.log('USP • ORGANIZAÇÃO DE CARGOS');
        console.log('================================');

        const botRole = me.roles.highest;

        console.log(`Cargo do bot: ${botRole.name}`);
        console.log(`Posição do bot: ${botRole.position}`);
        console.log('');

        /*
         * O Discord só permite que o bot mova cargos abaixo
         * do cargo mais alto que ele possui.
         */
        const rolesToMove = [];

        for (const name of ORDEM) {
            const role = guild.roles.cache.find(
                r => r.name === name
            );

            if (!role) {
                console.log(`⚠️ Não encontrado: ${name}`);
                continue;
            }

            if (role.managed) {
                console.log(`⚠️ Gerenciado pelo Discord: ${name}`);
                continue;
            }

            if (role.id === guild.id) {
                continue;
            }

            if (role.position >= botRole.position) {
                console.log(`❌ Acima do bot: ${name}`);
                continue;
            }

            rolesToMove.push(role);
        }

        /*
         * Mantemos todos os cargos abaixo do bot.
         * O primeiro da lista fica mais próximo do bot,
         * e os seguintes descem progressivamente.
         */
        let position = botRole.position - 1;

        for (const role of rolesToMove) {
            if (position <= 0) break;

            await role.setPosition(position);

            console.log(
                `✓ ${role.name} → posição ${position}`
            );

            position--;
        }

        console.log('');
        console.log('================================');
        console.log('HIERARQUIA ORGANIZADA');
        console.log('================================');

        await guild.roles.fetch();

        for (const name of ORDEM) {
            const role = guild.roles.cache.find(
                r => r.name === name
            );

            if (role) {
                console.log(
                    `${role.position.toString().padStart(3, ' ')} | ${role.name}`
                );
            }
        }

        console.log('================================');

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        client.destroy();
    }
});

client.login(process.env.TOKEN);
