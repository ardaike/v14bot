const {PermissionFlagsBits} = require("discord.js");
const winston_config = require("../../../winston_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "yardım",
    usage:"yardım",
    aliases: ["help","yardm","helps"],
    execute: async (client, message, args, winston_embed) => {
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [winston_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

    let commandsFive = client.commands.filter(winston => winston.usage).map((fivesowinston) => `> \`${winston_config.prefix}${fivesowinston.usage}\``).join("\n");

     message.reply({ embeds: [winston_embed.setDescription(`${commandsFive}`).setThumbnail(message.guild.iconURL({dynamic:true})).setTitle(`Yardım Menüsü`).setURL(`https://linktr.ee/beykant`)] });

    }
}