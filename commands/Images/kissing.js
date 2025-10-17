const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const sharp = require('sharp');

const axios = require('axios');

const fs = require('fs');

const output = "./output.png"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kissing')
        .setDescription('Ooooo they like kissing oooo men kissing oooo')
        .addUserOption(option =>
            option.setName('target1')
            .setDescription(':3')
            .setRequired(true))
        .addUserOption(option =>
            option.setName('target2')
            .setDescription(':3333')
            .setRequired(true)),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.deferReply({ ephemeral: false });

        const targetUsers = [
            interaction.options.getUser('target1'),
            interaction.options.getUser('target2')
        ];

        let url1 = targetUsers[0].displayAvatarURL()

        let url2 = targetUsers[1].displayAvatarURL()

        await crossover(
            "commands/Images/kissing.png",
            url1,
            0,
            {
                r: 0,
                g: 255,
                b: 0
            }
        )

        await crossover(
            output,
            url2,
            1,
            {
                r: 0,
                g: 0,
                b: 255
            }
        )

        const attachment = new AttachmentBuilder(output, { name: "file.png" });

        await interaction.editReply(
            {
                content: targetUsers[0].username + " is very gay with " + targetUsers[1].username,
                files: [attachment]
            }
        );

        fs.unlink(output, () => {})
    },
};

async function crossover(image, webImage, id, color){
    const loadedImage1 = await Jimp.read(image)

    console.log(webImage)

    const loadedImage2 = await webpToJimp(webImage,"tmp")

    loadedImage2.resize({
        w : loadedImage1.bitmap.width,

        h : loadedImage1.bitmap.height
    })

    for (x = 0; x < loadedImage1.bitmap.width; x++)
    {
        for (y = 0; y < loadedImage1.bitmap.height; y++)
        {
            color1 = loadedImage1.getPixelColor(x, y)

            color2 = loadedImage2.getPixelColor(x, y)

            if (
                color.r == intToRGBA(color1).r &&
                color.b == intToRGBA(color1).b &&
                color.g == intToRGBA(color1).g
            )
            {
                loadedImage1.setPixelColor(color2, x, y)
            }
        }
    }

    await loadedImage1.write(output);
}

async function webpToJimp (url, tempDir) {
    // Verify that the img is a webp

    if (!url.match(/(\.webp)/gi)) return Jimp.read(url)

    fs.mkdirSync(tempDir, {recursive : true})

    // Get the webp image
    const response = await axios.get(url, {
        responseType: 'stream'
    })

    // Create the temporary directory if it doesn't exist
    await fs.promises.mkdir(tempDir, { recursive: true })

    // Create a stream at the temporary directory and load the data into it
    const file = fs.createWriteStream(`${tempDir}/tmp.webp`)
    await response.data.pipe(file)

    nameSplit = url.split('/')

    name = nameSplit.at(-1)

    name = name.replace(/\s/g, "");

    console.log("name = " + name)

    await sleep(2000)

    await sharp(`${tempDir}/${name}.webp`)
        .png() // Specify the output format as PNG
        .toFile(`${tempDir}/${name}.png`);

    const img = await Jimp.read(`${tempDir}/tmp.png`)

    fs.rmSync(tempDir, { recursive: true, force: true });

    return img
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
