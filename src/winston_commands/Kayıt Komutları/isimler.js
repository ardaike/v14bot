const {PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const winston_config = require("../../../winston_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: 'isimler',
    usage:"isimler [@winston / ID]",
    aliases: ["names", "nicknames"],
    execute: async (client, message, args, winston_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       let staffData = await db.get("five-register-staff") || [];
       if(!staffData.length > 0)throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
        if(!staffData.some(winston => message.member.roles.cache.get(winston)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [winston_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if (!member) return message.reply({ embeds: [winston_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.user.bot) return message.reply({ embeds: [winston_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        let names = await db.get(`isimler-${member.id}`);
        if (!names) return message.reply({ embeds: [winston_embed.setDescription(`> **${member} Kullanıcısının İsim Verisi Bulunmamakta!**`)] }).sil(5);
        if(names && names.length <= 10){
        message.reply({ embeds: [winston_embed.setTitle("Kullanıcının Geçmiş Verileri").setDescription(names.map((data, n) => `${data}`).join("\n"))] })
        }else {
       let pages = 1;
       const winston_buttons = new ActionRowBuilder()
      .addComponents(
		new ButtonBuilder()
        .setCustomId("winston_back")
        .setLabel("⬅️")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("winston_exit")
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId("winston_skip")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Secondary)
		);
       let mesaj = await message.reply({components:[winston_buttons], embeds: [
        winston_embed.setTitle("Kullanıcının Geçmiş Verileri").setDescription(`${names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).map((data, n) => `${data}`).join("\n")}`).setFooter({text:`Sayfa #${pages}`})] })
        
        const filter = i => i.user.id === message.member.id;
        const collector = mesaj.createMessageComponentCollector({filter:filter, time: 120000});
        collector.on("collect",async (winston) => {
            if (winston.customId == "winston_skip") {
                if (names.slice((pages + 1) * 10 - 10, (pages + 1) * 10).length <= 0)return winston.reply({ephemeral:true,content:`> **❌ Daha Fazla Veri Bulunmamakta!**`});
                pages += 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
                await winston.update({components:[winston_buttons], embeds: [
                winston_embed.setTitle("Kullanıcının Geçmiş Verileri").setDescription(newData).setFooter({text:`Sayfa #${pages}`})] })
            }else
            if (winston.customId == "winston_back") {
                if (pages == 1)return winston.reply({ephemeral:true,content:`> **❌ İlk Sayfadasın, Geriye Gidemezsin!**`});
                pages -= 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
                await winston.update({components:[winston_buttons], embeds: [
                winston_embed.setTitle("Kullanıcının Geçmiş Verileri").setDescription(newData).setFooter({text:`Sayfa #${pages}`})] })
            }else  if (winston.customId == "winston_exit") {
            winston.reply({ephemeral:true,content:`> **🗑️ Panel Başarıyla Silindi!**`})
            mesaj.delete().catch((winston) => { })
            message.delete().catch((winston) => { })
            }
        })
    }

    }
}