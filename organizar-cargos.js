require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const GUILD_ID = process.env.GUILD_ID;

const grupos = [
    {
        divisoria: '━━━━━━━━ REITORIA ━━━━━━━━',
        cargos: [
            '⚜️ Reitor da USP',
            '⚜️ Vice-Reitor',
            '⚜️ Secretário-Geral da Reitoria',
            '⚜️ Secretário Adjunto',
            '⚜️ Diretor Tesoureiro'
        ]
    },
    {
        divisoria: '━━━━━━━━ DIRETORIA DA FACULDADE ━━━━━━━━',
        cargos: [
            '✦ Diretor da Faculdade',
            '✦ Vice-Diretor',
            '✦ Chefe de Departamento',
            '✦ Secretário Acadêmico',
            '✦ Bibliotecário'
        ]
    },
    {
        divisoria: '━━━━━━━━ COORDENAÇÃO DE CURSOS ━━━━━━━━',
        cargos: [
            '📘 Coordenador do Curso de Direito',
            '📘 Coordenador do Curso de Jornalismo',
            '📘 Coordenador do Curso de Magistratura'
        ]
    },
    {
        divisoria: '━━━━━━━━ CORPO DOCENTE ━━━━━━━━',
        cargos: [
            '🖋️ Professor Titular',
            '🖋️ Professor Adjunto',
            '🖋️ Monitor/Assistente'
        ]
    },
    {
        divisoria: '━━━━━━━━ CORPO DISCENTE ━━━━━━━━',
        cargos: [
            '⚖️ Veterano',
            '⚖️ Graduando',
            '⚖️ Calouro'
        ]
    }
];

client.once('ready', async () => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.roles.fetch();

        const botRole = guild.members.me.roles.highest;

        const encontrados = [];

        for (const grupo of grupos) {
            const divisoria = guild.roles.cache.find(
                role => role.name === grupo.divisoria
            );

            if (!divisoria) {
                console.log(`❌ Divisória não encontrada: ${grupo.divisoria}`);
                continue;
            }

            for (const nome of grupo.cargos) {
                const cargo = guild.roles.cache.find(
                    role => role.name === nome
                );

                if (!cargo) {
                    console.log(`❌ Cargo não encontrado: ${nome}`);
                    continue;
                }

                encontrados.push({
                    role: cargo,
                    divisoria
                });
            }
        }

        // Ordena tudo respeitando a ordem institucional.
        // Discord coloca posições maiores acima.
        let posicao = botRole.position - 1;

        for (const grupo of grupos) {
            const divisoria = guild.roles.cache.find(
                role => role.name === grupo.divisoria
            );

            if (!divisoria) continue;

            for (let i = grupo.cargos.length - 1; i >= 0; i--) {
                const cargo = guild.roles.cache.find(
                    role => role.name === grupo.cargos[i]
                );

                if (!cargo) continue;

                if (cargo.managed || cargo.id === guild.id) continue;

                if (cargo.position >= botRole.position) {
                    console.log(`⚠️ Não posso mover: ${cargo.name}`);
                    continue;
                }

                await cargo.setPosition(posicao);
                posicao--;
            }

            if (!divisoria.managed && divisoria.id !== guild.id) {
                if (divisoria.position < botRole.position) {
                    await divisoria.setPosition(posicao);
                    posicao--;
                }
            }
        }

        console.log('');
        console.log('================================');
        console.log('USP • HIERARQUIA ORGANIZADA');
        console.log('================================');
        console.log('Divisórias e cargos reorganizados.');
        console.log('================================');

    } catch (error) {
        console.error('ERRO:', error);
    } finally {
        client.destroy();
    }
});

client.login(process.env.TOKEN);
