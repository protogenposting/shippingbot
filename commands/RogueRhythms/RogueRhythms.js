const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const axios = require('axios');

const output = "./output.png"

const fs = require('fs');

const http = require('http');

const extract = require('extract-zip')

const path = require('path');

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
                file.setPixelColor(color, x + offset, y);
            });

            offset += 32
        }

        await file.write(output)

        await downloadFileSync(dailyLink,"daily.zip")

        try{
            fs.mkdirSync("dailytmp")
        }
        catch(e){

        }

        await extract("daily.zip", { dir: path.resolve("dailytmp") })

        let directory = "dailytmp/" + getSubdirectories("dailytmp")[0]

        let attachment = new AttachmentBuilder(output, { name: "file.png" });

        let song = new AttachmentBuilder(directory + "/song.ogg", { name: "song.ogg" });

        let text = "Score is currently held by " + response.data.name + " with "  + response.data.score + " accuracy!"

        let jsonText = fs.readFileSync(directory + "/data.json", 'utf8')

        if (jsonText.slice(-1) != "}")
        {
            jsonText = jsonText.slice(0, -1)
        }

        let songJSON = JSON.parse(jsonText)

        let furthestNote = songJSON.song.notes.at(-1).sectionNotes.at(-1)[0]

        text = text + "\n\nThe current song is " + (furthestNote / 1000).toString() + " seconds long! get on it!"

        console.log("total time: " + furthestNote.toString())

        await interaction.editReply(
            {
                content: text,
                files: [attachment, song]
            }
        );

        fs.unlink(output, () => {})

        fs.unlink("daily.zip", () => {})

        fs.rmdirSync("dailytmp",{ recursive: true, force: true })
    },
};

function getSubdirectories(source){
    const directories = fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    return directories;
};


async function downloadFileSync(url, destinationPath) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer' // Get response as a buffer
        });

        fs.writeFileSync(destinationPath, response.data);
        console.log(`File downloaded synchronously to ${destinationPath}`);
    } catch (error) {
        console.error('Error downloading file synchronously:', error);
    }
}
