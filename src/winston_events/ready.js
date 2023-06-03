const { joinVoiceChannel } = require("@discordjs/voice");
const client = global.client;
const db = client.db;
module.exports = () => {

let fiveVoiceChannel = db.get("five-channel-voice");
if(fiveVoiceChannel) {
const winston_kanal = client.channels.cache.get(fiveVoiceChannel);
if(!winston_kanal)return console.log(`${fiveVoiceChannel} ID'li Ses Kanal'ı Bulunamadı`)
joinVoiceChannel({
channelId: winston_kanal.id,
guildId: winston_kanal.guild.id,
adapterCreator: winston_kanal.guild.voiceAdapterCreator,
selfDeaf: true,
selfMute:true
});
}

}
module.exports.conf = {
name: "ready"
}