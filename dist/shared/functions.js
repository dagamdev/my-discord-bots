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
Object.defineProperty(exports, "__esModule", { value: true });
exports.presences = exports.selectMultipleRoles = exports.selectRole = exports.setSlashErrors = exports.setSlashError = exports.setErrors = exports.setError = exports.createEmbedMessage = exports.sendMessageSlash = exports.sendMessageText = exports.defaultReady = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const db_1 = require("../pcem/db");
const { color, emoji } = db_1.botDB;
const defaultReady = (client, channelId, rcolor) => {
    var _a;
    if (!client.user)
        return;
    const readyChannel = client.channels.cache.get(channelId);
    console.log(`|> ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}: i'm ready`);
    const ReadyEb = new discord_js_1.EmbedBuilder()
        .setTitle(`${emoji.afirmative} I'm ready`)
        .setColor(rcolor)
        .setDescription('Connected again');
    if (!config_1.isDevelopment && (readyChannel === null || readyChannel === void 0 ? void 0 : readyChannel.isTextBased())) {
        readyChannel.sendTyping();
        setTimeout(() => readyChannel.send({ embeds: [ReadyEb] }), 4000);
    }
};
exports.defaultReady = defaultReady;
const sendMessageText = (msg, optionsMessage) => {
    setTimeout(() => {
        msg.reply(optionsMessage);
    }, 4000);
};
exports.sendMessageText = sendMessageText;
const sendMessageSlash = (int, optionsMessage) => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield int.editReply(optionsMessage);
    }), 3000);
};
exports.sendMessageSlash = sendMessageSlash;
const createEmbedMessage = (title, description, color) => {
    return new discord_js_1.EmbedBuilder({ title, description }).setColor(color);
};
exports.createEmbedMessage = createEmbedMessage;
const setError = (msg, description) => {
    msg.channel.sendTyping();
    setTimeout(() => {
        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [(0, exports.createEmbedMessage)(`${emoji.negative} Error`, description, color.negative)] }).then(tnt => setTimeout(() => {
            tnt.delete().catch(() => '');
            msg.delete().catch(() => '');
        }, 20000));
    }, 4000);
};
exports.setError = setError;
const setErrors = (msg, descriptionsAndConditions) => {
    let res = false;
    for (const dac of descriptionsAndConditions) {
        if (dac[0]) {
            (0, exports.setError)(msg, typeof dac[1] == 'boolean' ? '' : dac[1]);
            res = true;
            break;
        }
    }
    return res;
};
exports.setErrors = setErrors;
const setSlashError = (int, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield int.deferReply({ ephemeral: true });
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield int.editReply({ embeds: [(0, exports.createEmbedMessage)(`${emoji.negative} Error`, description, color.negative)] });
    }), 3000);
});
exports.setSlashError = setSlashError;
const setSlashErrors = (int, descriptionsAndConditions) => {
    let res = false;
    for (const dac of descriptionsAndConditions) {
        if (dac[0]) {
            (0, exports.setSlashError)(int, typeof dac[1] == 'boolean' ? '' : dac[1]);
            res = true;
            break;
        }
    }
    return res;
};
exports.setSlashErrors = setSlashErrors;
const selectRole = (int, value, dictionary, author) => {
    var _a, _b;
    const { locale } = int, inEnglish = locale == 'en-US';
    dictionary.forEach(element => {
        if (author.roles.cache.has(element.rol)) {
            author.roles.remove(element.rol);
            element.status = 'remove';
        }
        else if (element.value == value) {
            author.roles.add(element.rol);
            element.status = 'add';
        }
    });
    const addRoles = dictionary.filter(f => f.status == 'add'), removeRoles = dictionary.filter(f => f.status == 'remove');
    const title = addRoles.length > 0 && removeRoles.length > 0 ? inEnglish ? '🔁 Role reversal' : `🔁 Intercambio de roles` : addRoles.length > 0 ? `${emoji.addition} ${inEnglish ? 'Added role' : 'Rol agregado'}` : `${emoji.subtraction} ${inEnglish ? 'Role removed' : 'Rol eliminado'}`;
    const description = addRoles.length > 0 && removeRoles.length > 0 ? `${inEnglish ? 'You can only have one role of this type therefore I have eliminated you' : 'Solo puedes tener un rol de este tipo por lo tanto te he eliminado'} ${removeRoles.length > 1 ? `${inEnglish ? 'the roles' : 'los roles'} ` + removeRoles.map((m) => `**<@&${m.rol}>**`).join(', ') : `${inEnglish ? 'the rol' : 'el rol'} **<@&${(_a = removeRoles[0]) === null || _a === void 0 ? void 0 : _a.rol}>**`} ${inEnglish ? 'and I have added the role' : 'y te he agregado el rol'} **<@&${(_b = addRoles[0]) === null || _b === void 0 ? void 0 : _b.rol}>** ${inEnglish ? 'which one have you chosen now?' : 'el cual has elegido ahora'}.` : addRoles.length > 0 ? `${inEnglish ? 'The role was added' : 'Se te agrego el rol'} **<@&${addRoles[0].rol}>**.` : `${inEnglish ? 'Your role is removed' : 'Se te elimino el rol'} **<@&${removeRoles[0].rol}>**.`;
    const rolStatusEb = new discord_js_1.EmbedBuilder({ title, description })
        .setColor(addRoles.length > 0 && removeRoles.length > 0 ? color.yellow : addRoles.length > 0 ? color.afirmative : color.negative);
    int.reply({ ephemeral: true, embeds: [rolStatusEb] });
};
exports.selectRole = selectRole;
const selectMultipleRoles = (int, values, dictionary, author) => {
    const { locale } = int, inEnglish = locale == 'en-US';
    values.forEach(value => {
        const element = dictionary.find(f => f.value == value);
        if (element) {
            if (!(author === null || author === void 0 ? void 0 : author.roles.cache.has(element.rol))) {
                author === null || author === void 0 ? void 0 : author.roles.add(element.rol);
                element.status = 'add';
            }
            else {
                author.roles.remove(element.rol);
                element.status = 'remove';
            }
        }
    });
    const addRoles = dictionary.filter(f => f.status == 'add'), removeRoles = dictionary.filter(f => f.status == 'remove');
    const title = addRoles.length > 0 && removeRoles.length > 0 ? `🔁 ${inEnglish ? 'Roles added and removed' : 'Roles agregados y eliminados'}` : addRoles.length > 0 ? `${emoji.addition} ${inEnglish ? 'Added roles' : 'Roles agregados'}` : `${emoji.subtraction} ${inEnglish ? 'Deleted roles' : 'Roles eliminados'}`;
    const rolStatusEb = new discord_js_1.EmbedBuilder({ title })
        .setDescription(`${addRoles.length > 0 ? `${inEnglish ? 'Roles added to you' : 'Roles que se te agregaron'}:\n${addRoles.map((m, i) => `${i + 1}. <@&${m.rol}>`).join('\n')}\n\n` : ''} ${removeRoles.length > 0 ? `${inEnglish ? 'Roles that have been removed' : 'Roles que se te eliminaron'}:\n${removeRoles.map((m, i) => `${i + 1}. <@&${m.rol}>`).join('\n')}` : ''}`)
        .setColor(addRoles.length > 0 && removeRoles.length > 0 ? color.yellow : addRoles.length > 0 ? color.afirmative : color.negative);
    int.reply({ ephemeral: true, embeds: [rolStatusEb] });
};
exports.selectMultipleRoles = selectMultipleRoles;
const presences = (dayStates, nightStates, client) => {
    var _a, _b;
    const tiempo = new Date();
    if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
        (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({ status: "idle", activities: [nightStates[Math.floor(Math.random() * nightStates.length)]] });
    }
    else {
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({ status: "online", activities: [dayStates[Math.floor(Math.random() * dayStates.length)]] });
    }
};
exports.presences = presences;