const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const axios = require('axios');

const output = "./output.png"

const fs = require('fs');

const http = require('http');

const dataLink = "http://24.199.91.149:3000/api/dailyScore"

const dailyLink = "http://24.199.91.149:3000/api/daily"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rrdailydata')
        .setDescription('Get data about the current daily!'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.deferReply({ ephemeral: false });

        let response = await axios.get(dataLink)

        console.log(response.data)

        if (response.data.name == "")
        {
            await interaction.editReply("no score set yet!");

            //return
        }

        let file = new Jimp({
            width: 32 * 5,
            height: 32,
            color: 0x000000ff,
        });

        offset = 0

        for (let i = 0; i < response.data.deck.length; i++)
        {
            console.log(response.data.deck)

            let note = response.data.deck[i]

            let image = await Jimp.read("commands/RogueRhythms/NoteImages/note" + note + ".png")

            file.scan((x, y) => {
                const color = image.getPixelColor(x, y);
                console.log(intToRGBA(color)); // prints: { r: 1, g: 255, b: 0, a: 255 }
                file.setPixelColor(color, x + offset, y);
            });

            offset += 32
        }

        await file.write(output)

        //get song data
        const dailyResponse = await axios.get(dailyLink, { responseType: 'arraybuffer' });
        const fileData = Buffer.from(response.data, 'binary');
        await fs.writeFile('./daily.zip', fileData);

        let attachment = new AttachmentBuilder(output, { name: "file.png" });

        let text = "Score is currently held by " + response.data.name + " with "  + response.data.score + " accuracy!"

        console.log(text)

        await interaction.editReply(
            {
                content: text,
                files: [attachment]
            }
        );

        fs.unlink(output, () => {})
    },
};
