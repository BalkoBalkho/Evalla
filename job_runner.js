const fs = require('fs')
const cp = require('child_process')
const manifest = require('./data/manifest')
const filenames = require('./data/filenames')
const path = require('path')


const jail_command = `./nsjail -Q --time_limit 15 --max_cpus 1 -Mo --user 0 --group 99999 -R ${path.resolve('.','binaries')} -B /tmp --rlimit_fsize 2000 -R /bin/ -R /lib -R /lib64/ -R /usr/ -R /sbin/ -T /dev -R /dev/urandom --keep_caps -- `
const id_maker = () => (Date.now().toString(32) +'j' ).split('').reverse().slice(0,10).join('')

module.exports = async (lang,code) => {
    const id = id_maker()
    const file_name = id + '.' + filenames[lang]
    const job_path = `/tmp/${file_name}`

    fs.writeFileSync(job_path,code,{encoding:"utf-8"})

    let command = jail_command + manifest[lang]['path'] + ' ' + job_path +' '+ manifest[lang]['args']
    let log = ''
    
    if (manifest[lang].iscompiled) {
        try {
            // cp.execSync(command + ` ${path.resolve('./jobs/',id)}`) //compilers can be semi turing complete... Who cares lmao its a pain with jail cuz of dependancies besides gcc has its built in limit
            cp.execSync(`${manifest[lang]['path']} ${job_path} ${manifest[lang]['args']} ${path.resolve('./jobs',id)}`)
            command = jail_command + `/tmp/${id}`
        } 
        catch (e) {
            log = e.toString().replace(command,'compilation command')
        }
    }
if (log.length) return log

    try {
       log  = cp.execSync(command)
       log = log.toString('utf-8')
    } catch (e) {
        log += e.toString()
        log = log.replace(command,'')} 

        fs.unlink(job_path,() => {})
        fs.unlink(id,() => {})

    
    return log

}