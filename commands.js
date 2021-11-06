const { Util } = require("discord.js");
const aliases = require("./data/aliases.json");
const job_runner = require("./job_runner");
// const html2pic = require("./html");

const tip_maker = () => {
  return Math.random();
};
const code_block_finder = /`{1,3}[\s\S]+`{1,3}/;
const start_code_alias = /\w+(?=\n)/gm;

class Command {
  /**
   *
   * @param {string} name
   * @param {string} description
   * @param {number} rateLimit
   * @param {Array<string>} arg
   * @param {example_run_function} run
   */
  constructor(name, description, rateLimit, arg, run) {
    this.name = name;
    this.description = description;
    this.ratelimit = rateLimit;
    this.arguments = arg;
    this.run = run;
  }

  run(msg, arg) {
    return this.run(msg, arg);
  }
}

module.exports = {
  help: new Command(
    "help",
    "Displays command information",
    0,
    ["command"],
    (msg, arg) => {
      let cmd = module.exports[arg];
      if (cmd) {
        msg.channel.send({
          embeds: [
            {
              title: cmd.name,
              description: cmd.description,
              footer: cmd.rateLimit
                ? `Command is rate limited by ${cmd.rateLimit}s!`
                : cmd.name + "`" + cmd.arguments.join("` ") + "`",
            },
          ],
        });
      } else {
        msg.channel.send({
          embeds: [
            {
              thumbnail: msg.client.user.avatarURL({ size: 128 }),
              description: "Let you run all sorts of code right in Discord!",
            },
          ],
        });
      }
    }
  ),
  ping: new Command("ping", "ping pong", 0, [], (msg) => {
    msg.channel.send(`ping pong bot works nice`);
  }),

  eval: new Command(
    "eval",
    "The main command, lets you run code you give in message",
    20,
    ["code?"],
    (msg, arg) => {
      let language = "";
      let code = "";

      msg.channel.sendTyping();

      if (arg && aliases[arg[0]]) {
        language = aliases[arg[0]];
      }

      let code_try = msg.content.match(code_block_finder);
      if (code_try?.length) {
        code = code_try[0];
        if (code.startsWith("```")) {
          let test_alias = code.slice(3);
          let alias = test_alias.match(start_code_alias);
          if (alias) {
            alias = aliases[alias[0]];
            if (alias) language = alias;
          }
        }
        // Cleans out the ``` code characters
        code = code.replace(/```[\w]+\n(?=[\s\S]*```)/g, "");
        code = code.replace(/^`{1,3}/g, "");
        code = code.replace(/(`{1,3})$/g, "");

        if (language) {
          job_runner(language, code).then((log) => {
            let output = Util.cleanCodeBlockContent(log);
              if (!(output?.length > 1)) {
                output = `🕸 Empty response`
              } else output = '```' + output + '```'
            output = output.slice(0, 4095);
            
              if (msg.deleted) output = "Error: Your message was deleted"// prevents bypassing a filter some mod bots might have set up

            msg.channel.send({
              embeds: [
                {
                  description: output,
                },
              ],
            });
          });
        } else {
          msg.reply(
            "I could not figure out what language this is in or I dont have that language supported!"
          );
        }
      } else {
        msg.reply("Please put your code in code blocks with (`)!");
      }
    }
  ),
// Commented out because I cant get bruhpetter working
//   html: new Command( 
//     "html",
//     "Renders provided html and returns a html",
//     20,
//     ["code?"],
//     (msg, arg) => {
//       let code = "";

//       let code_try = msg.content.match(code_block_finder);
//       if (code_try?.length) {
//         code = code_try[0];
//       } else {
//           code_try = arg.join('')
//           if (code_try.match(/<[\w\s\S]+>[\s\S]+<[\/\w]+>/g))  code = code_try // check if some semblence of html is after the command and use that.
//           else code = ``
          
//       }


//       code = code.replace(/```[\w]+\n(?=[\s\S]*```)/g, "");
//       code = code.replace(/^`{1,3}/g, "");
//       code = code.replace(/(`{1,3})$/g, "");


//       msg.channel.sendTyping()

//       html2pic(code).then(pic=> {
//         const attachment = new MessageAttachment(pic,'render')
//         msg.reply({attachments:[attachment]})
//       }).catch(e=> msg.channel.send(`Uh oh an error! \`${e}\``))
//     }
//   ),
};

/** couldnt figure out how to document functions in as paramters so just links to this. hack
 *
 * @param {import('discord.js').Message} msg
 * @param {Array<string>} arg
 */
function example_run_function(msg, arg) {
  msg.channel.send("hellloooooo!!" + msg.content);
}
