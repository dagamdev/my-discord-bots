import { Client, Message, ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../utils/functions";

export const girlsCommand = async (msg: Message<boolean>, client: Client) => {
  const description = await getInfoMessage({
    client,
    channelId: '1053399734582263938',
    language: 'es'
  })+''

  defaultInfoMessageBody(msg, {
    title: `<a:animate_info:1058179015938158592> Información`,
    description,
    name: 'verifieds',
    extraButtons: [
      new ButtonBuilder()
      .setCustomId('verifieds-btn')
      .setLabel('Verificadas')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success)
    ]
  })
}