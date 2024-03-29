"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../data");
const utils_1 = require("../utils");
const __1 = require("../..");
class GuildDeleteEvent extends __1.BotEvent {
    constructor() {
        super('guildDelete');
    }
    async execute(guild, client) {
        const botData = await (0, utils_1.getBotData)(client);
        const usersData = await (0, utils_1.getUsersData)(client);
        if (usersData) {
            const user = usersData?.find(f => f.guilds.some(s => s == guild.id)), rol = '851577906828148766';
            const server = client.guilds.cache.get(data_1.botDB.serverId);
            if (user) {
                user.guilds.splice(user.guilds.indexOf(guild.id), 1);
                const member = server?.members.cache.get(user.userId);
                if (user.guilds.length == 0 && member) {
                    if (member.roles.cache.has(rol))
                        member.roles.remove(rol);
                }
            }
            await (0, utils_1.updateUsersData)(client, usersData);
        }
        const owner = guild.members.cache.get(guild.ownerId), channelLog = client.channels.cache.get(botData?.logs.guildDelete || '');
        const guildRoles = guild.roles.cache.filter(f => !f.managed && f.id != guild.id).map(m => ({ posicion: m.position, nombre: m.name })).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ");
        const GuildDeleteEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: owner?.user.tag || '', iconURL: owner?.user.displayAvatarURL() })
            .setThumbnail(guild.iconURL({ size: 2048 }))
            .setImage(guild.bannerURL({ size: 2048 }))
            .setTitle("➖ Kicked from a server")
            .setDescription(`${guild.name}\n${guild.description || '*No description*'}`)
            .setFields({ name: `<:wer:920166217086537739> **Guild:**`, value: `🆔 ID: ${guild.id}\n📅 Created at <t:${Math.floor(guild.createdAt.valueOf() / 1000)}:F> *(<t:${Math.floor(guild.createdAt.valueOf() / 1000)}:R>)*`, inline: true }, { name: `👥 **Members:** ${guild.members.cache.size.toLocaleString()}`, value: `👤 Users: ${guild.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true }, { name: `🌈 **Roles:** ${guild.roles.cache.size}`, value: `${guildRoles || 'unkowow'}`, inline: true }, { name: `👑 **Owner:**`, value: `${owner?.user.tag}\n🆔 ${owner?.id}` })
            .setColor('Red')
            .setTimestamp();
        if (channelLog?.isTextBased())
            channelLog.send({ embeds: [GuildDeleteEb] });
    }
}
exports.default = GuildDeleteEvent;
