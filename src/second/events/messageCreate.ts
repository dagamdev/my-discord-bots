import { ChannelType, EmbedBuilder, Message } from 'discord.js'
import { getVerifiedsData, updateVerifiedsData } from '../lib/services'
import { Announcements, Moderation, Reactions } from '../components'
import { getSnackData } from '../lib/notion'
import { type SecondClientData } from '..'
import { ManageAutomaticContent } from '../components/automaticContent'
import { type EventName } from '../..'

export const name: EventName = 'messageCreate'

export async function execute(msg: Message<boolean>, client: SecondClientData) {
  const { channel, channelId, guildId } = msg
  const { prefix, serverId, backupServerId, owners, verifiedsCooldown} = client.data

  //* Components
  Announcements(msg, client)
  Moderation(msg, client)
  Reactions(msg)
  ManageAutomaticContent(msg, client)

  if(msg.author.bot) return

  if(guildId == backupServerId){
    if(channel.type != ChannelType.GuildText) return
    const { parentId } = channel
    if(['1028793497295261828', '1054489737097908364', '1061436780500496394', '1112154577811275776'].some(s=> s==parentId)){
      const server = client.guilds.cache.get(serverId), channelName = channel.name, serverChannel = server?.channels.cache.find((f)=>  f.name == channelName) 
      if(serverChannel?.type == ChannelType.GuildText) serverChannel.send({content: msg.content || ' ', files: msg.attachments.map(m=> m)})
    }
  }

  const SnackeData = await getSnackData()
  
  if(guildId == serverId){
    if(!msg.channel.isTextBased()) return
    

    if(channel.type == ChannelType.GuildText){
      //! Backup files
      if(msg.attachments.size && msg.attachments.some(s=> s.size < 25000000)){
        const backupServer = client.guilds.cache.get(backupServerId), channelName = channel.name, backupChannel = backupServer?.channels.cache.find(f=>  f.name == channelName) 
        if(backupChannel?.type == ChannelType.GuildText) backupChannel.send({content: `${msg.author} | \`\`${msg.author.id}\`\``, files: msg.attachments.filter(f=> f.size < 25000000).map(m=> m)})
      }

      if(channel.parentId == '1053401639454773338' && channel.nsfw){
        
        //? Verifieds system
        if(msg.member?.roles.cache.has(SnackeData.roles.verified)){
          const verifiedsData = await getVerifiedsData(client)
          const now = Date.now()

          if(msg.mentions.everyone){
            const channelLog = client.channels.cache.get('1100110861244301382')
            
            channel.permissionOverwrites.edit(msg.author.id, {MentionEveryone: false})
            const verifiedUser = verifiedsData?.find(f=> f.id == msg.author.id)

            if(verifiedUser){
              verifiedUser.ping = false
              verifiedUser.pinedAt = now
              verifiedUser.lastActivityAt = now
              verifiedUser.lastMentionAt = now
              if(!verifiedUser.channelId) verifiedUser.channelId = channelId

              if(verifiedUser.contentHidden) {
                verifiedUser.contentHidden = false 
                channel.permissionOverwrites.edit(serverId, { ReadMessageHistory: true }) 
              }
              if(verifiedUser.channelHidden) {
                verifiedUser.channelHidden = false 
                channel.permissionOverwrites.edit(serverId, { ViewChannel: true }) 
              }
            
            }else{
              verifiedsData?.push({
                id: msg.author.id,
                ping: false,
                pinedAt: now,
                channelId: channelId,
                verifiedAt: now,
                contentHidden: false,
                channelHidden: false,
                lastMentionAt: now,
                lastActivityAt: now
              })
            }
      
            if(verifiedsData) await updateVerifiedsData(client, verifiedsData)
            const VerifiedLog = new EmbedBuilder()
            .setAuthor({name: `New ping for ${msg.author.username}`, iconURL: msg.author.displayAvatarURL()})
            .setDescription(`${msg.author} podrás utilizar nuevamente ping <t:${Math.floor((now+verifiedsCooldown) / 1000)}:R>`)
            .setColor('Yellow')
            if(channelLog?.isTextBased()) channelLog.send({embeds: [VerifiedLog]})

          }else if(msg.content.length > 3 || msg.attachments.size) {

            const verifiedUser = verifiedsData?.find(v=> v.id == msg.author.id)
            if(verifiedUser){
              verifiedUser.lastActivityAt = now
              if(!verifiedUser.channelId) verifiedUser.channelId = channelId

              if(verifiedUser.contentHidden) {
                verifiedUser.contentHidden = false
                channel.permissionOverwrites.edit(serverId, { ReadMessageHistory: true }) 
              }
              if(verifiedUser.channelHidden) {
                verifiedUser.channelHidden = false
                channel.permissionOverwrites.edit(serverId, { ViewChannel: true }) 
              }
              
              if(!verifiedUser.ping && verifiedUser.pinedAt && verifiedUser.pinedAt < Math.floor(now - (60*60000)) && verifiedUser.lastMentionAt && verifiedUser.lastMentionAt < now - (8*60000)){
                msg.reply({allowedMentions: { repliedUser: false, roles: [SnackeData.roles.verifiedSpeech] }, content: `**<@&${SnackeData.roles.verifiedSpeech}>**`})
                verifiedUser.lastMentionAt = now
              }


              if(verifiedsData) await updateVerifiedsData(client, verifiedsData)

            }else{
              msg.reply({allowedMentions: { repliedUser: false, roles: [SnackeData.roles.verifiedSpeech] }, content: `**<@&${SnackeData.roles.verifiedSpeech}>**`})
              
              if(!msg.member.permissions.has('Administrator')){
                verifiedsData?.push({
                  id: msg.author.id,
                  ping: false,
                  channelId: channelId,
                  verifiedAt: now,
                  contentHidden: false,
                  channelHidden: false,
                  lastMentionAt: now,
                  lastActivityAt: now
                })
              }
            }
          }
        }
      }
    }
  }

  if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const commandName = args.shift()?.toLowerCase()

  if(commandName){
    const command = client.textCommands.get(commandName) || client.textCommands.find(f=> f.struct.aliases?.some(s=> s == commandName))
    
    if(command){
      if(command.struct.users){
        if(command.struct.users.some(s=> s == msg.author.id)) command.execute({message: msg, args, client})
      
      }else command.execute({message: msg, args, client})
    }
  }
}