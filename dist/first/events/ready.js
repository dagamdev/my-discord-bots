"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../data");
const utils_1 = require("../utils");
const functions_1 = require("../../shared/functions");
const __1 = require("../..");
class ReadyEvent extends __1.BotEvent {
    constructor() {
        super('ready');
    }
    async execute(client) {
        if (!client.user)
            return;
        const guildsDB = await (0, utils_1.getGuildsData)(client);
        if (guildsDB)
            data_1.botDB.guilds = guildsDB;
        const dataBot = await (0, utils_1.getBotData)(client);
        // console.log(botDB)
        (0, functions_1.defaultReady)(client, dataBot?.logs.connections || '', data_1.botDB.color.afirmative);
        data_1.botDB.color = { ...data_1.botDB.color, ...dataBot?.color };
        const servidor = client.guilds.cache.get(data_1.botDB.serverId);
        function presencias() {
            const estadosDia = [
                {
                    name: data_1.botDB.prefix + "ayuda",
                    type: discord_js_1.ActivityType.Listening
                },
                {
                    name: "/ayuda",
                    type: discord_js_1.ActivityType.Listening
                },
                {
                    name: `${client.users.cache.size.toLocaleString()} users.`,
                    type: discord_js_1.ActivityType.Watching
                },
                {
                    name: `moderar con ${client.users.cache.get('935707268090056734')?.username}`,
                    type: discord_js_1.ActivityType.Playing
                }
            ];
            const estadosNoche = [
                {
                    name: `mis sueños.`,
                    type: discord_js_1.ActivityType.Watching
                },
                {
                    name: `zzz`,
                    type: discord_js_1.ActivityType.Playing
                }
            ];
            let tiempo = new Date();
            if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
                client.user?.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] });
            }
            else {
                client.user?.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] });
            }
        }
        presencias();
        setInterval(async () => {
            presencias();
        }, 60 * 60000);
        setInterval(async () => {
        }, 30 * 60000);
        // console.log(svInteractionCommands.map(m=> m))
        // console.log(interactionCommands.map(m=> ({name: m.struct.name, pr: m.struct.default_member_permissions})))
        // ;[...client.slashCommands.map(sc=> sc), ...client.contextCommands.map(cc=> cc)].forEach(async cmd=> {
        //   if(!(await client.application?.commands.fetch())?.some(c=> c.name == cmd.struct.name)){
        //     client.application?.commands.create(cmd.struct)
        //   }
        // })
        // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
        // console.log((await client.application?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
        // const command = svInteractionCommands.get('crear')?.struct.options as ApplicationCommandOptionData[] | undefined
        // (await servidor?.commands.fetch('971218630631129168', {force: true}))?.edit({options: command}).then(c=> console.log('Comando actualizado'))
        // (await servidor?.commands.fetch('974763995837894687', {force: true}))?.delete().then(c=> console.log(`Comando ${c.name} eliminado`))
        //! Public
        // const command = interactionCommands.get('set')
        // (await client.application?.commands.fetch('1076941760753840200', {force: true}))?.edit({options: command?.struct.options, defaultMemberPermissions: PermissionFlagsBits.ManageGuild}).then(c=> console.log(`Comando publico ${c.name} actualizado`))
        // (await client.application?.commands.fetch('1076941760753840200', {force: true}))?.delete().then(c=> console.log(`Comando publico ${c.name} eliminado`))
    }
}
exports.default = ReadyEvent;
