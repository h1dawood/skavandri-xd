const Discord = require('discord.js'),arraySort = require('array-sort');
module.exports.run = async (client, message, args, tools) => {
    try{
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has('EMBED_LINKS')) {
        return message.reply("I need Permissions `EMBED_LINKS`")}
    let invites = await message.guild.fetchInvites().catch(error => { 
        console.log(`${error}`)
        return message.channel.send('Sorry, I don\'t have the proper permissions to view invites!');
        
    }) 

    invites = invites.array();

    arraySort(invites, 'uses', { reverse: true }); 

    let possibleinvites = [];
    let index = 0;
    invites.forEach(function(invites) {
        possibleinvites.push(`${++index}. \`${invites.inviter.tag}\` Have **${invites.uses}** invites`)
    })

    if(!possibleinvites[0]) return message.channel.send({embed: {
        description: `No invite in tis server`,
        author: {
          name: `${message.guild.name} Server invites`
          },
        }});
              if(!possibleinvites[10]) return message.channel.send({embed: {
            description: `${possibleinvites.join('\n')}`,
            author: {
              name: `${message.guild.name} Server invites`
              },
            }});
       let queuelist = possibleinvites.slice(11).map(inv => `${inv}`).join('\n')
       const embed = new Discord.RichEmbed()
      .sstDescription(`${queuelist}`);
      message.channel.send(embed);
        }catch(e){
        return message.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
        }
    }
exports.conf = {
    aliases: ["topinv","topinvites"],
    guildOnly: true
    };
    exports.help = {
    name: 'invites',
    };