const {Client } = require('discord.js')
const commands = require('./commands')
require('dotenv').config()


const client = new Client({intents: ['GUILD_MESSAGES','GUILDS'],partials: ['MESSAGE','CHANNEL']})
let invoker = /<@903631415818723349> \w+[\w ]*/g


let rateLimit = {}

client.on('ready',(c)=> {
    console.log('ready!')
    invoker = new RegExp(`<@!{0,1}${c.user.id}> \\w+[\\w ]*`)
})

client.on('messageCreate', (msg) => {
    
    let command = msg.content.match(invoker)
    if (command?.length) {
        command = command[0].slice(23,999)
        let commandName = command.split(' ')[0]
        if (commands[commandName]) {
        if (!(Date.now() < rateLimit[msg.author.id]))  {


            let arguments = command.split(' ').slice(1)
            const commandObject = commands[commandName]
            commandObject.run(msg,arguments)
            rateLimit[msg.author.id] = Date.now() + (commandObject.ratelimit  * 1)
        } else {msg.channel.send(`you are being rate limited!`)}

        

        }
        
        
    }
})



client.login(process.env.BOT_TOKEN)