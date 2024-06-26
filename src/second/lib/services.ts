import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, EmbedBuilder, Guild, GuildMember, Message, WebhookClient } from 'discord.js'
import type { ActivitiesOptions, TextChannel } from 'discord.js'
import { FrogDb } from '../data'
import { inDevelopment } from '../../config'
import { VerifiedsModel } from '../../models'
import { type SecondClientData } from '..'

const getCategoryChannels = (id: string, server: Guild | undefined) => {
  return server?.channels.cache.filter(f=> f.parentId == id).size.toLocaleString()
}

export const setGuildStatus = (client: SecondClientData) => {
  const snackServer = client.getGuildById(FrogDb.serverId)
  const online = snackServer?.members.cache.filter(f=> f.presence?.status == 'dnd' || f.presence?.status == 'idle' || f.presence?.status == 'online' || f.presence?.status == 'invisible').size
  const allMembers = snackServer?.memberCount, nsfwChannels = getCategoryChannels('1139599817568432292', snackServer)
  const vipChannels = getCategoryChannels('1139599819942400010', snackServer)

  const onlineName = `🟢│En linea: ${online?.toLocaleString()}`, 
    membersName = `👥│Todos: ${allMembers?.toLocaleString()}`, 
    nsfwName = `🔞│NSFW canales: ${nsfwChannels}`,
    vipName = `🌟│VIP canales: ${vipChannels}`

  const onlineChanel = snackServer?.channels.cache.get('1140009074851852328')
  const membersChanel = snackServer?.channels.cache.get('1140009240195518534')
  const nsfwChanel = snackServer?.channels.cache.get('1140009285988913322')
  const vipCahnnel = snackServer?.channels.cache.get('1139600255206293545')
   
  if(onlineChanel?.name != onlineName) onlineChanel?.edit({name: onlineName})
  if(membersChanel?.name != membersName) membersChanel?.edit({name: membersName})
  if(nsfwChanel?.name != nsfwName) nsfwChanel?.edit({name: nsfwName})
  if(vipCahnnel?.name != nsfwName) vipCahnnel?.edit({name: vipName})
}

export async function inspectVerifieds(client: SecondClientData) {
  const VerifiedsData = await VerifiedsModel.find()
  const { channels } = client.data
  const server = client.getGuildById(FrogDb.serverId)
  const channelLog = client.getChannelById(channels.verifiedLogs)
  
  for(let v of VerifiedsData) {
    const channel = client.getChannelById(v.channelId)
    const verifiedMember = server?.members.cache.get(v.userId)
    const day = 24*60*60000

    if(verifiedMember){
      if(channel?.type == ChannelType.GuildText) {
        if((!v.contentHidden) && v.lastActivityAt && v.lastActivityAt < Math.floor(Date.now() - (day*30))) await channel.permissionOverwrites.edit(FrogDb.serverId, {ReadMessageHistory: false}).then(ed=> {
          v.contentHidden = true
          
          const VerifiedLog = new EmbedBuilder()
          .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
          .setColor('Blue')
          if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.userId}>`, embeds: [VerifiedLog]}) 
        })
    
        if((!v.channelHidden) && v.lastActivityAt && v.lastActivityAt < Math.floor(Date.now() - (day*40))) await channel.permissionOverwrites.edit(FrogDb.serverId, {ViewChannel: false}).then(ed=> {
          v.channelHidden = true
          
          const VerifiedLog = new EmbedBuilder()
          .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
          .setColor('Orange')
          if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.userId}>`, embeds: [VerifiedLog]}) 
        })
      
        if(!v.ping) {
          if(v.pinedAt && Math.floor(v.pinedAt + (FrogDb.verifiedsCooldown)) <= Date.now()){
            if(channel?.type == ChannelType.GuildText) channel.permissionOverwrites.edit(v.userId, {MentionEveryone: true})
            v.ping = true
      
            const VerifiedLog = new EmbedBuilder()
            .setDescription(`Ya puedes utilizar ping en tu canal <#${v.channelId}>`)
            .setColor('Green')
            if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.userId}>`, embeds: [VerifiedLog]}) 
          }
        } 

        await v.save()
      }

    }else{
      if(channel?.type == ChannelType.GuildText) await channel.permissionOverwrites.edit(FrogDb.serverId, {ViewChannel: false}).then(async ()=> {
        await v.deleteOne()
        
        const VerifiedLog = new EmbedBuilder()
        .setDescription(`La verificada <@${v.userId}> no se encuentra en el servidor, ha sido eliminada de la base de datos y su canal ha sido cerrado.`)
        .setColor('Red')
        if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.userId}>`, embeds: [VerifiedLog]}) 
      })
    }
  }
}

type Languages = 'es' | 'en'

const messagesIndexByLanguages = {
  es: 1,
  en: 0
}

export async function getInfoMessage({client, channelId, language}: {
  client: SecondClientData
  channelId: string,
  language: Languages
}) {  
  const channel = client.channels.cache.get(channelId)

  if(channel?.type == ChannelType.GuildText) {
    const infoMessages = (await channel.messages.fetch({limit: 6})).map(m=> m)
    let index = messagesIndexByLanguages[language]

    return infoMessages?.find((_, i)=> i == index)?.content
  }
}

export function defaultInfoMessageBody(msg: Message<boolean>, {title, description, name, extraButtons}: {
  title: string
  description: string
  name: string,
  extraButtons?: ButtonBuilder[]
}) {
  const RulesEb = new EmbedBuilder()
  .setTitle(title)
  .setDescription(description)
  .setFooter({text: "you don't speak Spanish?, Click blue button below"})
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const RulesArb = new ActionRowBuilder<ButtonBuilder>()
  if(extraButtons){
    RulesArb.addComponents(
      new ButtonBuilder()
      .setCustomId(`en-${name}-btn`)
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary),
      ...extraButtons
    )

  }else{
    RulesArb.addComponents(
      new ButtonBuilder()
      .setCustomId(`en-${name}-btn`)
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary),
    )
  }

  msg.channel.send({embeds: [RulesEb], components: [RulesArb]})
}

export async function autoChangeNicknames(members: GuildMember[], client: SecondClientData) {
  const regex = /[!¡¿?]/
  const characters = ['!', '¡', '?', '¿']
  let updatedMembers = 0
  
  for (const member of members) {
    const userName = member.nickname || member.user.globalName || member.user.username
    
    if((!member.roles.cache.has(FrogDb.roles.prisoner)) && regex.test(userName) && characters.some(s=> userName.startsWith(s))){
      try {
        await member.edit({nick: userName.replace(regex, '').trim()})
        updatedMembers++
      } catch (error) {

      }
    }
  }

  if(updatedMembers){
    const UpdatedMembersEb = new EmbedBuilder()
    .setTitle('Update members nicknames')
    .setDescription(`Amount: **${updatedMembers}**`)
    .setColor('Blue')

    const channelLog = client.channels.cache.get(FrogDb.channels.logs)
    if(channelLog?.isTextBased()) channelLog.send({embeds: [UpdatedMembersEb]})
  }
}

export function handlePreviewChannels(this: {
  accessRoles: string[]
  previewRol: string
}, int: ButtonInteraction<CacheType>) {
  const { guild, user, locale } = int
  const inEnglish = locale == 'en-US'
  const author = guild?.members.cache.get(user.id)

  const VIPPreviewEb = new EmbedBuilder()
  .setTitle('👁️ '+(inEnglish ? 'Channels preview' : 'Vista previa de canales'))
  
  if(this.accessRoles.some(s=> author?.roles.cache.has(s))){
    VIPPreviewEb
    .setDescription(inEnglish ?
      `You already have access to all channels in this category, you have upgraded the server or you have paid for access.` :
      `Ya tienes acceso a todos los canales de esta categoría, has mejorado el servidor o has pagado por el acceso.`  
    )
    .setColor('Blurple')

  }else if(author?.roles.cache.has(this.previewRol)) {
    VIPPreviewEb
    .setDescription(inEnglish ?
      `You already have channel preview enabled for this category.` :
      `Ya tienes habilitada la vista previa de canales de este acategoría.`  
    )
    .setColor('Blurple')

  }else{
    author?.roles.add(this.previewRol).then(()=> setTimeout(()=> {
      if(guild?.members.cache.has(author.id)) author.roles.remove(this.previewRol)
    }, 10*60000))

    VIPPreviewEb
    .setDescription(inEnglish ?
      `You have been enabled to preview channels for this category, you can only see the channels, not the content.` :
      `Se the ha habilitado la vista previa de canales para esta categoría, solo puedes ver los canales no el contenido.`  
    )
    .setFooter({text: inEnglish ? 
      'The channel preview is disabled in 10 minutes' : 
      'La vista previa de canales se te deshabilita en 10 minutos'
    })
    .setColor('Yellow')
  }

  int.reply({ephemeral: true, embeds: [VIPPreviewEb]})
}

export function handlePresences(client: SecondClientData) {
  const NOW_TIME = new Date()
  const hourDiference = inDevelopment ? 0 : 6

  let hour = NOW_TIME.getHours()-hourDiference
  if(hour < 0) hour = 24-(-hour)
    
  if(hour == 0 || hour < 6){
    client.user?.setPresence({ status: 'invisible' })

  }else{
    const server = client.guilds.cache.get(FrogDb.serverId)

    const dayStates: ActivitiesOptions[] = [
      {
        name: 'moans',
        type: ActivityType.Listening
      },
      {
        name: 'orgasms',
        type: ActivityType.Watching
      },
      {
        name: 'with the girls',
        type: ActivityType.Playing
      },
      {
        name: server?.memberCount.toLocaleString()+' members.',
        type: ActivityType.Watching
      },
      {
        name: 'vaginas',
        type: ActivityType.Watching
      },
      {
        name: 'boobs',
        type: ActivityType.Watching
      },
      {
        name: 'ass',
        type: ActivityType.Watching
      },
    ]
  
    const nightStates: ActivitiesOptions[] = [
      {
        name: `naked women.`,
        type: ActivityType.Watching
      },
      {
        name: `moans.`,
        type: ActivityType.Listening
      },
      {
        name: 'the beauty of women',
        type: ActivityType.Watching
      }
    ]
  
    if (hour >= 16 && hour < 24) {
      client.user?.setPresence({ status: 'idle', activities: [nightStates[Math.floor(Math.random() * nightStates.length)]] })
    } else {
      client.user?.setPresence({ status: 'online', activities: [dayStates[Math.floor(Math.random() * dayStates.length)]] })
    }
  }

}

export function transformTime(time: number) {
  return Math.floor(time / 1000)
}

export async function getWebhookClientByChannel(channel: TextChannel) {
  const webhooks = await channel.fetchWebhooks() 
  const firstWebhook = webhooks.first()

  if(firstWebhook){
    const { url } = firstWebhook
    return new WebhookClient({url})
  }else {
    const { url } = await channel.createWebhook({name: 'snack'})
    return new WebhookClient({url})
  }
}
