const client = global.client;
const db = client.db;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits, SelectMenuBuilder, ActivityType } = require("discord.js");
const winston_config = require("../../winston_config");
const ms = require('ms');
module.exports = async (oldUser,newUser) => {
    let familyRoles = await db.get("five-family-roles") || [];
    let tagData = await db.get("five-tags") || [];
    let logChannel = await db.get("five-channel-log");
    let chatChannel = await db.get("five-channel-chat");
    if (!tagData.length > 0 || !familyRoles.length > 0 || !logChannel || !chatChannel) return;
    if (oldUser.tag == newUser.tag || oldUser.bot || newUser.bot) return;

    let log = client.channels.cache.get(logChannel)
    let chat = client.channels.cache.get(chatChannel)

    let Guild = client.guilds.cache.get(winston_config.guildID)
    let Member = Guild.members.cache.get(oldUser.id)
    if (tagData && tagData.some(tag => oldUser.tag.includes(tag)) && !tagData.some(tag => newUser.tag.includes(tag))) {
        if(log)log.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsminden \`Tagımızı\` Çıkarttı Ailemizden Ayrıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.tag}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.tag}\`**`).setColor(`#ff0000`)] })
       if(Member.displayName.includes(winston_config.tagSymbol) && Member.manageable) await Member.setNickname(Member.displayName.replace(winston_config.tagSymbol,winston_config.normalSymbol)) 
        let role = Guild.roles.cache.get(familyRoles[0]);
        let roles = Member.roles.cache.clone().filter(e => e.managed || e.position < role.position);
        await Member.roles.set(roles).catch();
    }
    if (tagData && !tagData.some(tag => oldUser.tag.includes(tag)) && tagData.some(tag => newUser.tag.includes(tag))) {
        Member.roles.add(familyRoles[0])
        if(Member.displayName.includes(winston_config.normalSymbol) && Member.manageable) await Member.setNickname(Member.displayName.replace(winston_config.normalSymbol,winston_config.tagSymbol)) 
        if(log)log.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsmine \`Tagımızı\` Alarak Ailemize Katıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.tag}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.tag}\`**`).setColor(`#00ff00`)] })
        if(chat)chat.send(`> **🎉 Tebrikler, ${newUser} Tag Alarak Ailemize Katıldı! Hoşgeldin.**`)
    }
    

}
module.exports.conf = { 
name: "userUpdate"
}