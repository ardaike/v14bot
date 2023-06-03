const client = global.client;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits, SelectMenuBuilder, ActivityType } = require("discord.js");
const winston_config = require("../../winston_config");
const ms = require('ms');
const db = client.db;
module.exports = async (message) => {
    if (winston_config.prefix && !message.content.startsWith(winston_config.prefix))return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    const winston_embed = new EmbedBuilder()
    .setColor(`#2f3136`)
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: winston_config.footer ? winston_config.footer : `winston Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

    if (cmd) {
        cmd.execute(client, message, args, winston_embed);
    }
}

module.exports.conf = { 
name: "messageCreate"
}