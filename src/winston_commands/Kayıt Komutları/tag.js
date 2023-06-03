const {PermissionFlagsBits} = require("discord.js");
const winston_config = require("../../../winston_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "tag",
    usage:"tag",
    aliases: ["tags","taglar"],
    execute: async (client, message, args, winston_embed) => {
    let tagData = await db.get("five-tags") || [];
    if(!tagData.length > 0) return message.reply({ embeds:[winston_embed.setDescription(`> **Bu Sunucuda Tag Bulunmamakta!**`)]}).sil(5);
    return message.reply({content:`> ${tagData.map((winston) => `**${winston}**`).join(",")}`});
    }
}