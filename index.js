const {Client } = require('discord.js')
const commands = require('./commands')
require('dotenv').config()

const http = require('http')
var log = []

if (!process.env.disableserver) {

   const server = http.createServer((request, response) => { 
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.write(log.join('\n'))
        response.end()
    })

    server.listen(80)

}


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

            log.push(`${commandName}, ${msg.content.replace(invoker,`${arguments}`)}`)

            const commandObject = commands[commandName]
            try {
            commandObject.run(msg,arguments) } catch (e) {
                msg.channel.send({content:` an error happened while running your command: ${e}`}).catch(() => {})
                log.push(e.toString())
            }
            rateLimit[msg.author.id] = Date.now() + (commandObject.ratelimit  * 1)
        } else {msg.channel.send(`you are being rate limited!`)} // TODO: make rate limiting actually work

        

        }
        
        
    }
})


client.login(process.env.BOT_TOKEN)