const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
 
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setTitle(`Botinfo`)
  .setThumbnail(`${client.user.displayAvatarURL}`)
  .addField("Info", `**Creation Date**: ${moment.utc(client.user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}\n**ID**: ${message.client.user.id}\n**Owner**: [H1]franchisco\n**Version**: 1.2\n**Support Server**: https://discord.gg/FcTgBzz`)
  .addField("script language:", `***javascript***`)
  .addField("guilds", `***${client.guilds.size}***`,true)
  .addField("users", `***${client.users.size}***`,true)
    .addField("channels", `***${client.channels.size}***`,true)
    .addField(`ping`,` ${Math.round(client.ping)}ms`,true)
  message.channel.send(embed);
}

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],  // just delete this aliases and enabled and guildonly dont workin for u maybe
    permLevel: "User"
  };

  exports.help = {
    name: "botinfo",
    category: "Info",
    description: "Botinfo",
    usage: "botinfo"
  };