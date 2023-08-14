import { Role } from 'discord.js'
import { FrogDb } from '../db'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'roleDelete'

export async function execute(role: Role, client: PepeFrogClient) {
  const { serverId, backupServerId } = FrogDb
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.cache.find(f=> f.name == role.name)?.delete()
}