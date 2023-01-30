import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";

class Language extends Command {

    constructor() {
        super();
        this.name = "channel";
        this.description = "Specifies what commands can be run in channels.";
        this.target = ["GUILD"];
        this.permission = [PermissionFlagsBits.Administrator];
        this.options = [
            {
                name: 'command',
                description: 'The command to restrict to specific channels',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to use for this command',
                type: ApplicationCommandOptionType.Channel,
                required: true,
            }
        ]
    }

    autocomplete(interaction, command, arg, collection) {
        return [...collection.keys()];
    }

    async run({ interaction, instance, args }) {
        const commandName = interaction.options.getString('command');
        const channel = interaction.options.getChannel('channel');

        const command = instance.commands.get(commandName.toLowerCase());
        if (!command) return `The command ${commandName} does not exist`;


        let availableChannels = [];
        const canRun = (await instance.channels.getAvailableChannels(interaction.guild.id, commandName))
            .includes(channel.id);

        if (canRun) {
            availableChannels = await instance.channels.remove(interaction.guild.id, commandName, channel.id);
        }
        else {
            availableChannels = await instance.channels.add(interaction.guild.id, commandName, channel.id);
        }

        if (availableChannels.length) {
            const channelNames = availableChannels.map(c => `<#${c}> `);
            return `The command ${commandName} can now only be ran inside of the following channels: ${channelNames}`;
        }

        return `The command ${commandName} can now be ran inside of any text channel`;
    }
}

export default Language;