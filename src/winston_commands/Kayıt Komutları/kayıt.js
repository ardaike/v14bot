const { ActionRowBuilder,StringSelectMenuBuilder,PermissionFlagsBits } = require("discord.js");
const client = global.client;
const db = client.db;
const winston_config = require("../../../winston_config")
module.exports = {
name: "kayıt",
usage:"kayıt [@winston / ID] <isim> <yaş>",
aliases: ["k", "girl", "woman","e", "boy", "man","Man","Girl","Woman","woman","Boy","kız","erkek","KAYIT","Kayıt"],
execute: async (client, message, args, winston_embed) => {
    let staffData = await db.get("five-register-staff") || [];
    let tagData = await db.get("five-tags") || [];
    let manRoles = await db.get("five-man-roles") || [];
    let womanRoles = await db.get("five-woman-roles") || [];
    let familyRoles = await db.get("five-family-roles") || [];
    let chatChannel = await db.get("five-channel-chat");

    if(!staffData.length > 0)throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
    if(!manRoles.length > 0)throw new SyntaxError("Erkek Rolleri Ayarlı Değil!");
    if(!womanRoles.length > 0)throw new SyntaxError("Kadın Rolleri Ayarlı Değil!");
    if(!familyRoles.length > 0)throw new SyntaxError("Family Rolleri Ayarlı Değil!");
    if(!chatChannel)throw new SyntaxError("Genel Chat Kanalı Ayarlı Değil!");


    if(!staffData.some(winston => message.member.roles.cache.get(winston)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [winston_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);


const winston_dropdown = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
.setCustomId('winston_kayıt_command')
.setPlaceholder(`Cinsiyet Seçim!`)
.addOptions([
{label:`Erkek`,description:`Erkek Olarak Kayıt Et!`,value:`man`,emoji:`${winston_config.manemoji}`},
{label:`Kız`,description:`Kız Olarak Kayıt Et!`,value:`woman`,emoji:`${winston_config.womanemoji}`},
{label:`İptal`,description:`Kayıt İşlemini İptal Et!`,value:`exit`,emoji:`❌`}
])) 

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
let name = args[1]
let age = args[2]
if (!member) return message.reply({ embeds:[winston_embed.setDescription(`> **Geçerli Bir User Belirt!**`)]}).sil(5);
if(member.id == message.author.id) return message.reply({ embeds: [winston_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
if(member.user.bot) return message.reply({ embeds: [winston_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
if(db.has("five-welcome-tagmode")){
if (db.has("five-welcome-tagmode") && !tagData.some(tag => member.user.tag.includes(tag))) {
return message.reply({ embeds: [winston_embed.setDescription(`> **Taglı Alım Açık Olduğu İçin Sadece Taglı Kullanıcılar Kayıt Edilebilir!**`)] }).sil(5)
}}
if (!name) return message.reply({ embeds:[winston_embed.setDescription(`> **Geçerli Bir İsim Belirt!**`)]}).sil(5);
if (name.lenght > 12)  return message.reply({embeds:[winston_embed.setDescription(`> **İsim uzunluğu 12'den Büyük Olamaz!**`)]}).sil(5);
if (age && isNaN(age)) return message.reply({embeds:[winston_embed.setDescription(`> **Yaşı Lütfen Sayı İle Belirt!**`)] }).sil(5);
if (age && age < winston_config.minageAge)return message.reply({embeds:[winston_embed.setDescription(`> **Kullanıcının Yaşı Geçerli Yaştan Küçük!**`)]}).sil(5);
let Name2 = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);
if (member.roles.cache.get(manRoles[0]) || member.roles.cache.get(womanRoles[0])) return message.reply({ embeds: [winston_embed.setDescription(`> **Kayıtlı Bir Kullanıcıyı Tekrar Kayıt Edemezsin!**`)]}).sil(5);
if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [winston_embed.setDescription(`> **İşlem Geçersiz Senden Üst/Aynı Pozisyonda Birisini Kayıt Edemezsin!**`)] }).sil(5);
const names = db.get(`isimler_${member.id}`)
let mesajwinston;
if(names){
mesajwinston = message.reply({ embeds: [winston_embed.setDescription(`> **Kullanıcının ismi** \`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` **Olarak Değiştirilecek!**\n> **Butonlardan Kullanıcının Cinsiyetini Seçiniz.**\n\n> **Kullanıcının Toplamda " ${names.length} " İsim Kayıtı Mevcut.**\n${names.slice(0,10).map((data, n) => `${data}`).join("\n")}`)], components: [winston_dropdown] })
} 
if(!names){
mesajwinston = message.reply({ embeds: [winston_embed.setDescription(`> **Kullanıcının ismi** \`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` **Olarak Değiştirilecek!**\n> **Butonlardan Kullanıcının Cinsiyetini Seçiniz.**`)], components: [winston_dropdown] })}
const kyapan = await client.users.fetch(message.author.id) 
mesajwinston.then(b2 => {
const filter = i => i.user.id === message.member.id;
const collector = b2.createMessageComponentCollector({filter:filter, time: 30000 });
collector.on('collect', async b => {
if (!b.isStringSelectMenu()) return;
const value = b.values[0]

if (value === "man") {
db.add(`erkek-${message.author.id}`, 1)
db.push(`isimler-${member.id}`, `\`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` (${manRoles.map((winston) => `<@&${winston}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
db.push(`kayıtlar-${message.author.id}`, `\`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` (${manRoles.map((winston) => `<@&${winston}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);
if (tagData && tagData.some(tag => member.user.tag.includes(tag))) {

await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...manRoles,...familyRoles]) : member.roles.set([...manRoles,...familyRoles])
await member.setNickname(`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}`).catch(e => { })

} else {

await member.setNickname(`${winston_config.normalSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}`).catch(e => { })

await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...manRoles]) : member.roles.set([...manRoles])}
message.reply({ embeds: [winston_embed.setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${winston_config.manemoji} ${manRoles.map((winston) => `<@&${winston}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)]})
if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send(`> **${winston_config.manemoji} ${member} Aramıza Hoşgeldin!**`).sil(20);

}
if (value === "woman") {

db.add(`kadın-${message.author.id}`, 1)
db.push(`isimler-${member.id}`, `\`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` (${womanRoles.map((winston) => `<@&${winston}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
db.push(`kayıtlar-${message.author.id}`, `\`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` (${womanRoles.map((winston) => `<@&${winston}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);

if (tagData && tagData.some(tag => member.user.tag.includes(tag))) {
await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...womanRoles,...familyRoles]) : member.roles.set([...womanRoles,...familyRoles]);
await member.setNickname(`${winston_config.tagSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}`).catch(e => { })

} else {

await member.setNickname(`${winston_config.normalSymbol} ${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}`).catch(e => { })
await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...womanRoles]) : member.roles.set([...womanRoles])}
message.reply({ embeds: [winston_embed.setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${Name2}${age ? ` ${winston_config.symbolwinston} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${winston_config.womanemoji} ${womanRoles.map((winston) => `<@&${winston}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)]})
if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send(`> **${winston_config.womanemoji} ${member} Aramıza Hoşgeldin!**`).sil(20);

}
if (value === "exit") {
message.delete();
if(winston_config.kayitsizHesapIsim.length > 0)await member.setNickname(winston_config.kayitsizHesapIsim)
message.channel.send({ embeds: [winston_embed.setDescription(`> **İşlem Başarıyla İptal Edildi!**`)]}).sil(10)
}
collector.stop()
b.message.delete().catch(e => { console.error(e) })

})
})
}
}