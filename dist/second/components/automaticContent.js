"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAutomaticContent = void 0;
const discord_js_1 = require("discord.js");
const channels = {
    martine: '1139600091829776498',
    onlyNudes: '1139600102445551646'
};
const categories = {
    martine: '949861762902138941',
    martine2: '1141400243645190304',
    onlyNudes: '1141075333374804059'
};
const autoContentServerId = '949861760096145438';
async function ManageAutomaticContent(msg, client) {
    const { channelId, content } = msg;
    if (![channels.martine, channels.onlyNudes].some(s => s == channelId))
        return;
    const getAndSendContent = async (contentUrl, channel) => {
        if (contentUrl.slice(contentUrl.length - 7, contentUrl.length).includes('.')) {
            const response = await fetch(contentUrl);
            const imageBufer = await response.arrayBuffer();
            const buffer = Buffer.from(imageBufer);
            const MBs = (buffer.length / 1048576);
            const reverseUrl = contentUrl.split('').reverse().join('');
            const fileExtension = reverseUrl.slice(0, reverseUrl.indexOf('.')).split('').reverse().join('');
            // console.log({MBs, fileExtension})
            if (MBs > 25)
                return channel.send({ content: `**File:** ${contentUrl}` });
            console.log(MBs.toFixed(3) + ' MB');
            const fileNumber = (parseInt(channel.topic?.match(/\d+/g)?.[0] || '0')) + 1;
            channel.send({ content: `**MB:** ${MBs.toFixed(2)}`, files: [{ attachment: buffer, name: `file${fileNumber}.${fileExtension}` }] })
                .then(() => {
                channel.edit({ topic: fileNumber + '' });
            })
                .catch(e => console.error('Error in send file:', e));
        }
        else {
            channel.send({ content: `**File:** ${contentUrl}` });
        }
    };
    const handleSendContent = (categoryId, categoryName, contentUrl, lastCategoriId) => {
        const autoContentServer = client.getGuildById(autoContentServerId);
        const martineChannel = autoContentServer?.channels.cache.find(f => (f.parentId == categoryId || f.parentId == lastCategoriId) && f.name == categoryName);
        const firtCategoryChannels = autoContentServer?.channels.cache.filter(f => f.parentId == categoryId).size;
        if (martineChannel?.type == discord_js_1.ChannelType.GuildText) {
            getAndSendContent(contentUrl, martineChannel);
        }
        else {
            autoContentServer?.channels.create({ name: categoryName, parent: firtCategoryChannels == 50 ? lastCategoriId : categoryId, nsfw: true }).then(newChannel => {
                getAndSendContent(contentUrl, newChannel);
            });
        }
    };
    if (channelId == channels.martine) {
        const splitContent = content.replaceAll('`', '').split('\n');
        const categoryName = splitContent.find(f => f.toLowerCase().includes('category:'))?.split(/ +/g).pop();
        const contentUrl = splitContent.find(f => f.toLowerCase().includes('image:'))?.split(/ +/g).pop();
        // console.log({categoryName, contentUrl})
        if (categoryName && contentUrl)
            handleSendContent(categories.martine, categoryName.toLowerCase(), contentUrl, categories.martine2);
    }
    if (channelId == channels.onlyNudes) {
        const splitContent = content.split(/ +/g);
        const lastName = splitContent[3];
        const categoryName = splitContent[2] + (lastName.toLowerCase().includes('content') ? '' : '-' + lastName);
        const contentUrl = splitContent.find(f => f.includes('http'))?.replace(')', '').split('(').pop();
        if (categoryName && contentUrl)
            handleSendContent(categories.onlyNudes, categoryName.toLowerCase(), contentUrl);
    }
}
exports.ManageAutomaticContent = ManageAutomaticContent;