"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'channelCreate';
async function execute(channel, client) {
    const { serverId, backupServerId } = client.data;
    if (channel.guildId != serverId)
        return;
    const principalServer = client.guilds.cache.get(backupServerId);
    const prinCategory = principalServer?.channels.cache.find(f => f.name == channel.parent?.name);
    principalServer?.channels.create({ name: channel.name, parent: prinCategory?.id, position: channel.position, type: channel.type });
}
exports.execute = execute;