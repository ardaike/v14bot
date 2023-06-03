const { EmbedBuilder,Partials, resolveColor, Client, Collection, GatewayIntentBits, ActivityType,OAuth2Scopes } = require("discord.js");
const winston_config = require("./winston_config")
const client = global.client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent],
    scopes:[
    OAuth2Scopes.Bot,
    OAuth2Scopes.ApplicationsCommands
  ],partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.GuildScheduledEvent
  ],
    presence: {
      activities: [{
        name: winston_config && winston_config.botDurum.length > 0 ? winston_config.botDurum : "winston Was Here",
        type: ActivityType.Streaming,
        url:"https://www.twitch.tv/winston_exe"
      }],
      status: 'dnd'
    }
  });

const {YamlDatabase} = require('five.db')
const db = client.db = new YamlDatabase();

const { readdir } = require("fs");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();

readdir("./src/winston_commands/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        readdir("./src/winston_commands/" + f, (err2, files2) => {
            if (err2) console.log(err2)
            files2.forEach(file => {
                let winston_prop = require(`./src/winston_commands/${f}/` + file);
                console.log(`🧮 [winston - COMMANDS] ${winston_prop.name} Yüklendi!`);
                commands.set(winston_prop.name, winston_prop);
                winston_prop.aliases.forEach(alias => { aliases.set(alias, winston_prop.name); });
            });
        });
    });
});


readdir("./src/winston_events", (err, files) => {
    if (err) return console.error(err);
    files.filter((file) => file.endsWith(".js")).forEach((file) => {
        let winston_prop = require(`./src/winston_events/${file}`);
        if (!winston_prop.conf) return;
        client.on(winston_prop.conf.name, winston_prop);
        console.log(`📚 [winston _ EVENTS] ${winston_prop.conf.name} Yüklendi!`);
    });
});


Collection.prototype.array = function () { return [...this.values()] }

const {emitWarning} = process;
process.emitWarning = (warning, ...args) => {
if (args[0] === 'ExperimentalWarning') {return;}
if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {return;}
return emitWarning(warning, ...args);
};

Promise.prototype.sil = function (time) {
if (this) this.then(s => {
      if (s.deletable) {
        setTimeout(async () => {
          s.delete().catch(e => { });
        }, time * 1000)
      }
    });
  };


client.login(winston_config.token).then(() => 
console.log(`🟢 ${client.user.tag} Başarıyla Giriş Yaptı!`)
).catch((winston_err) => console.log(`🔴 Bot Giriş Yapamadı / Sebep: ${winston_err}`));