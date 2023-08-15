import { ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../lib/services";
import { MessageProp, TextCommand } from "../..";
import { PepeFrogClient } from "../../client";

export default class GirlsCommand extends TextCommand {
  constructor() {
    super({
      name: 'girls'
    })
  }

  public async execute({message: msg, client}: {
    message: MessageProp
    client: PepeFrogClient
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1139620168998326362',
      language: 'es'
    })+''
  
    defaultInfoMessageBody(msg, {
      title: `<a:info_animate:1052698007562375219> Información`,
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
}