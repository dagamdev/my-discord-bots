import { connect } from "mongoose";
import { connectMongo } from "./config";
import colors from "colors"
import { BotDB } from "./types"

colors
connect(connectMongo || '').then(()=> console.log('Conectado corectamente a la base de datos'.green))
.catch((err)=> console.error('Ocurrió un error al conectarse a la DB'.red, err))


export const botDB: BotDB = {
  prefix: '||',
  serverId: '773249398431809586',
  creatorId: '717420870267830382',
  owners: ['717420870267830382', '825186118050775052'],
  mainRoles: ["823372926707171358","887450254826418236","852684847901704192","830260569012699146","840704377962758204","887443737804931122","885301022677942272","887443742469029961"],
  levelRoles: ['831671368776024104', '831671377396367360', '838498326512140329', '838498329650003969', '876273805494988821', '876273903452975134', '876274096990724097', '876274137239265340', '891446815700967434', '891446820851564584', '891446820851564584', '971515112567476354', '971515118837956699', '971515126144442448'],
  emoji: {
    cat: '<a:gatito:909919946140684288>',
    like: '<:blueLike:946826193032851516>',
    loop: '<a:loop:964162886865944617>',
    exit: '<:salir12:879519859694776360>',
    staff: '<:staff:925429848380428339>',
    money: '<:money:832307999871598602>',
    ticket: '<:ticket:962122515348590623>',
    status: '<:status:957353077650886716>',
    twitch: '<:TwitchEmblema:855167274193125396>',
    discord: '<a:DiscordLogo:973995348974505984>',
    twitter: '<:TwitterLogo:855168545566490664>',
    dislike: '<:redDislike:946826212960010251>',
    youTube: '<:YouTube:1027686980840071209>',
    warning: '<:advertencia:929204500739268608>',
    confetti: '<a:confeti:974801702307901490>',
    tickTock: '<:Mamadatok:855167926875979837>',
    addition: '<:addition:1041412594931605606>',
    leftArrow: '<a:LeftArrow:942155020017754132>',
    rightArrow: '<a:RightArrow:942154978859044905>',
    ping30ms: '<:30ms:917227036890791936',
    ping60ms: '<:60ms:917227058399162429>',
    ping100ms: '<:150ms:917227075243503626>',
    negative: '<a:negativo:856967325505159169>',
    instagram: '<:instagram:855169028376494080>',
    afirmative: '<a:afirmativo:856966728806432778>',
    invitation: '<:invitacion:1027688019123249243>',
    subtraction: '<:subtraction:1041412540774756362>',
    information: '<a:Info:926972188018479164>',
    animateBoost: '<a:BoostAnimado:931289485700911184>',
  },
  color: {
    blue: '#0095F7',
    afirmative: '#00ff00',
    negative: '#ff0000',
    yellow: '#F8CB01'
  }
}