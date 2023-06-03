const winston_config = require("../../winston_config");
const client = global.client;
const db = client.db;
const canvafy = require("canvafy");
module.exports = async (member) => {
if(member.guild.id !== winston_config.guildID || member.user.bot)return;
let staffData = await db.get("five-register-staff") || [];
let unregisterRoles = await db.get("five-unregister-roles") || [];
let fiveImage = await db.get("five-welcome-image");
let fiveMentions = await db.get("five-welcome-mentions");
let tagData = await db.get("five-tags") || [];
let welcomeChannel = await db.get("five-channel-welcome");
let jailRoles = await db.get("five-jail-roles") || [];

if(!staffData.length > 0)throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
if(!unregisterRoles.length > 0)throw new SyntaxError("Kayıtsız Rolleri Ayarlı Değil!");
if(!jailRoles.length > 0)throw new SyntaxError("Jail Rolleri Ayarlı Değil!");
if(!welcomeChannel)throw new SyntaxError("Welcome / Hoşgeldin Kanalı Ayarlı Değil!");

if(!member.guild.channels.cache.get(welcomeChannel)){
console.log(`[ 🚨 ] Welcome / Hoşgeldin Kanalı Bulunamadı,Kanalın Varlığını Kontrol Edin; ${member.user.tag} Kullanıcısı Sunucuya Katıldı`)
return;
}
var kurulus = (Date.now() - member.user.createdTimestamp);
var üyesayısı = member.guild.memberCount.toString().replace(/ /g, "    ")
var üs = üyesayısı.match(/([0-9])/g)
üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
if(üs) {üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
return {
'0': winston_config.sayılarEmoji.sıfır,
'1': winston_config.sayılarEmoji.bir,
'2': winston_config.sayılarEmoji.iki,
'3': winston_config.sayılarEmoji.üç,
'4': winston_config.sayılarEmoji.dört,
'5': winston_config.sayılarEmoji.winston,
'6': winston_config.sayılarEmoji.altı,
'7': winston_config.sayılarEmoji.yedi,
'8': winston_config.sayılarEmoji.sekiz,
'9': winston_config.sayılarEmoji.dokuz}[d];
})}

let winstonWelcomeMessage = `**🎉 Merhabalar ${member}, Seninle Beraber Sunucumuz ${üyesayısı} Üye Sayısına Ulaştı!**\n\n **Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> Tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Önce Oluşturulmuş,Sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> Giriş Yaptın!**\n\n **Kayıt Olduktan Sonra Kurallar Kanalını Okuduğunuzu Kabul Edeceğiz Ve İçeride Yapılacak Cezalandırma İşlemlerini Bunu Göz Önünde Bulundurarak Yapacağız.**\n\n **${tagData.length > 0 ? `Tagımız: \`\`${tagData ? tagData.map((five) => `${five}`).join(",") : "winston_Error"}\`\`'ı Alarak Bize Destek Olabilirsin, ` : ""}İyi Sohbetler Dileriz.**${fiveMentions ? `\n${staffData.length > 0 ? `||${staffData.map((five) => `<@&${five}>`).join(",")}||`:""}`:""}`;


if (kurulus > 604800000) {
if(!member.user.bot && unregisterRoles.length > 0)member.roles.set([...unregisterRoles])


member.setNickname(winston_config.kayitsizHesapIsim);
if(fiveImage){
const welcome = await new canvafy.WelcomeLeave()
.setAvatar(member.user.avatarURL({forceStatic:true,extension:"png"}))
.setBackground("image", winston_config.welcomeResimURL)
.setTitle(`${member.user.username}`)
.setDescription("Sunucumuza Hoşgeldin!")
.setBorder(winston_config.welcomeResimRenk)
.setAvatarBorder(winston_config.welcomeResimRenk)
.setOverlayOpacity(0.65)
.build();
member.guild.channels.cache.get(welcomeChannel).send({files:[{attachment: welcome.toBuffer(),name: `winston_welcome_${member.id}.png`}],content:winstonWelcomeMessage});
}else{
member.guild.channels.cache.get(welcomeChannel).send({content:winstonWelcomeMessage});
}
} else {
if(jailRoles.length > 0)member.roles.set([...jailRoles]);
member.setNickname(winston_config.supheliHesapIsim);
member.guild.channels.cache.get(welcomeChannel).send({ content: `**⚠ ${member}, Kullanıcısı Sunucuya Katıldı Hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Önce Açıldığı İçin Şüpheli Rolü Verildi.**\n**Sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> Zamanında Giriş Yaptı!**`})}


}
module.exports.conf = {
name: "guildMemberAdd"
}
