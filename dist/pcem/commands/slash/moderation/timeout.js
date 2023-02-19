"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutSlashCommand = exports.timeoutScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const ms_1 = __importDefault(require("ms"));
exports.timeoutScb = new discord_js_1.SlashCommandBuilder()
    .setName('timeout')
    .setNameLocalization('es-ES', 'espera')
    .setDescription('⏲️ Timeout for the member')
    .setDescriptionLocalization('es-ES', '⏲️ Tiempo de espera para el miembro')
    .addUserOption(member => member.setName('member')
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 Provide the member.`)
    .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro.`)
    .setRequired(true))
    .addStringOption(time => time.setName('time')
    .setNameLocalization('es-ES', 'tiempo')
    .setDescription(`🔢 Provides the waiting time.`)
    .setDescriptionLocalization('es-ES', `🔢 Proporciona el tiempo de espera.`)
    .setMaxLength(2)
    .setMaxLength(10)
    .setRequired(true))
    .addStringOption(reazon => reazon.setName('reazon')
    .setNameLocalization('es-ES', 'razón')
    .setDescription(`📝 Provide the reason for the member timeout.`)
    .setDescriptionLocalization('es-ES', `📝 Proporciona la razón para el tiempo de espera.`)
    .setMinLength(4)
    .setMaxLength(800)
    .setRequired(true))
    .addAttachmentOption(image => image.setName('image')
    .setNameLocalization('es-ES', 'imagen')
    .setDescription('🖼️ Image of evidence')
    .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
    .toJSON();
const timeoutSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser('member', true).id), time = options.getString('time', true), reazon = options.getString("reazon", true), image = options.getAttachment('image');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)),
            (isEnglish ? `The member you provided *(${member})* is me, I can't set a timeout for myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no puedo establecer un tiempo de espera para mi.`)
        ],
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == user.id),
            (isEnglish ? `The member you provided *(${member})* is yourself, you cannot assign yourself a timeout.` : `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes asignar un tiempo de espera.`)
        ],
        [
            Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
            (isEnglish ? `The member you provided *(${member})* is a bot, I can't assign timeout for a bot.` : `El miembro que ha proporcionado *(${member})* es un bot, no puedo asignar tiempo de espera para un bot.`)
        ],
        [
            Boolean((guild === null || guild === void 0 ? void 0 : guild.ownerId) == (member === null || member === void 0 ? void 0 : member.id)),
            (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
        ],
        [
            Boolean((user.id != (guild === null || guild === void 0 ? void 0 : guild.ownerId)) && member && ((author === null || author === void 0 ? void 0 : author.roles.highest.comparePositionTo(member.roles.highest)) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role or more higher than yours, you can't assign timeout.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no le puedes asignar tiempo de espera.`)
        ],
        [
            Boolean(!(0, ms_1.default)(time)),
            (isEnglish ? `The time you provided *(${time})* is not valid.\n\n**Examples:**\n10 minutes = **10m**\n2 hours = **2h**\n5 days = **5d**` : `El tiempo que has proporcionado *(${time})* no es valido.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
        ],
        [
            Boolean((0, ms_1.default)(time) < (0, ms_1.default)('2m')),
            (isEnglish ? `The time you provided *(${time})* is less than **2** minutes, please provide a longer timeout.` : `El tiempo que has proporcionado *(${time})* es menor a **2** minutos, proporciona un tiempo de espera mayor.`)
        ],
        [
            Boolean((0, ms_1.default)(time) > (0, ms_1.default)('20d')),
            (isEnglish ? `The time you provided *(${time})* is greater than **20** days, please provide a shorter wait time.` : `El tiempo que has proporcionado *(${time})* es mayor a **20** días, proporciona un tiempo de espera menor.`)
        ],
        [
            Boolean(image && ((_b = image.contentType) === null || _b === void 0 ? void 0 : _b.split('/')[0]) != 'image'),
            (isEnglish ? `The file provided is not an image, please provide an image as evidence.` : `El archivo proporcionado no es una imagen, proporciona una imagen como evidencia.`)
        ],
        [
            Boolean(image && image.size >= 8000000),
            (isEnglish ? `The image weight is equal to or greater than **8MB**, it provides a lighter image.` : `El peso de la imagen es igual o mayor a **8MB**, proporciona una imagen mas ligera.`)
        ]
    ]))
        return;
    const WarnEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
        .setTitle(`<:aislacion:947965052772814848> ` + (isEnglish ? 'Timeout member' : `Miembro aislado`))
        .setDescription(`🧑 **${isEnglish ? 'Member' : 'Miembro'}:** ${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
        .setThumbnail((member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 1024, extension: ((_c = member.avatar) === null || _c === void 0 ? void 0 : _c.includes('a_')) ? 'gif' : 'png' })) || null)
        .setColor("#0283F6")
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setTimestamp();
    const WarnDMEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setThumbnail((guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || null)
        .setTitle(`<:aislacion:947965052772814848> Has sido aislado/a`)
        .setDescription(`**en:** ${guild === null || guild === void 0 ? void 0 : guild.name}\n\n📑 **Razón:** ${reazon}`)
        .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setColor("#0283F6")
        .setTimestamp();
    if (image) {
        image.name = `evidence.${(_d = image.contentType) === null || _d === void 0 ? void 0 : _d.split('/')[1]}`;
        WarnEb.setImage('attachment://' + image.name);
        WarnDMEb.setImage('attachment://' + image.name);
    }
    const timeoutReazon = `${reazon} | ${isEnglish ? `Timeout member` : `Miembro aislado`}: ${member === null || member === void 0 ? void 0 : member.user.tag} | ${isEnglish ? 'Moderator' : 'Moderador'}: ${user.tag} ID: ${user.id}`;
    yield int.deferReply();
    member === null || member === void 0 ? void 0 : member.timeout((0, ms_1.default)(time), timeoutReazon).then(() => {
        member === null || member === void 0 ? void 0 : member.send({ embeds: [WarnDMEb], files: image ? [image] : [] }).catch(() => {
            if (WarnEb.data.footer)
                WarnEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member === null || member === void 0 ? void 0 : member.user.tag}`;
        }).finally(() => {
            (0, functions_1.sendMessageSlash)(int, { embeds: [WarnEb], files: image ? [image] : [] });
        });
    });
});
exports.timeoutSlashCommand = timeoutSlashCommand;