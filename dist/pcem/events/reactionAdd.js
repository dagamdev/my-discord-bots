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
exports.reactionAddEvent = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const reactionAddEvent = (reaction, user, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { serverId, emoji } = db_1.botDB;
    if (reaction.message.guildId != serverId || user.bot)
        return;
    //? Sistema de encuestas
    let dataEnc = yield models_1.surveysModel.findById(serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.surveys;
    if ((arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.filter(f => f.active).some(s => s.id == reaction.message.id)) && ((_a = arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.find(f => f.id == reaction.message.id)) === null || _a === void 0 ? void 0 : _a.options.some(s => s.emoji == reaction.emoji.name))) {
        const encuesta = arrayEn.find(f => f.id == reaction.message.id);
        let totalVotos = 0, tabla = [];
        encuesta === null || encuesta === void 0 ? void 0 : encuesta.options.filter(f => f.emoji != reaction.emoji.name).map(m => { var _a; return (_a = reaction.message.reactions.cache.get(m.emoji)) === null || _a === void 0 ? void 0 : _a.users.remove(user.id); });
        if (encuesta) {
            for (let c of encuesta.options) {
                const reactionCounts = (((_b = reaction.message.reactions.cache.get(c.emoji)) === null || _b === void 0 ? void 0 : _b.count) || 2);
                if (c.emoji != reaction.emoji.name && ((_c = reaction.message.reactions.cache.get(c.emoji)) === null || _c === void 0 ? void 0 : _c.users.cache.has(user.id))) {
                    totalVotos += reactionCounts - 2;
                    c.votes = reactionCounts - 2;
                }
                else {
                    totalVotos += reactionCounts - 1;
                    c.votes = reactionCounts - 1;
                }
            }
            yield models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            for (let o of encuesta.options) {
                const porcentaje = (o.votes * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ";
                let diseño = "";
                for (let i = 0; i < 20; i++) {
                    if (i < parseInt(porcentaje) / 100 * 20)
                        diseño = diseño.concat(carga);
                    else
                        diseño = diseño.concat(vacio);
                }
                tabla.push(`${o.emoji} ${o.option} *(${o.votes})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`);
            }
        }
        const embed = reaction.message.embeds[0];
        embed.fields[0].value = tabla.join("\n\n");
        reaction.message.edit({ embeds: [embed] });
    }
    //? Sistema de sorteos
    const dataSor = yield models_1.rafflesModel.findById(serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.raffles;
    if ((arraySo === null || arraySo === void 0 ? void 0 : arraySo.filter(f => f.active).some(s => s.id == reaction.message.id)) && reaction.emoji.id == (dataSor === null || dataSor === void 0 ? void 0 : dataSor.data.emojiId)) {
        const sorteo = arraySo === null || arraySo === void 0 ? void 0 : arraySo.find(f => f.id == reaction.message.id);
        if (!(sorteo === null || sorteo === void 0 ? void 0 : sorteo.participants.some(s => s == user.id))) {
            sorteo === null || sorteo === void 0 ? void 0 : sorteo.participants.push(user.id);
            yield models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
        }
    }
});
exports.reactionAddEvent = reactionAddEvent;
