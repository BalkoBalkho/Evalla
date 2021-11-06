const nodeHtmlToImage = require('node-html-to-image')
const {readFileSync} = require('fs')

module.exports = async (html) => {
    
    let image = await nodeHtmlToImage({html: html,type:'png',transparent:true})

    if (image.size > 8000000) {
        image = await nodeHtmlToImage({html: html,type:'jpg',quality:20,transparent:true})
    }

    if (image.size > 8000000) {
        image = await nodeHtmlToImage({html: html,type:'jpg',quality:1,transparent:true})
    }

    if (image.size > 8000000) {
        image = readFileSync('./data/toobigerror.png')
    }

    return image

}