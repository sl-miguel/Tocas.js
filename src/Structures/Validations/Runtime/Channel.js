import { PermissionFlagsBits } from 'discord.js';
import Validation from "../../Base/Validation.js";
import PermissionDB from "../../Schemas/PermissionDB.js";

class Channel extends Validation {

    constructor() {
        super();
        this.name = 'Channel is required';
        this.description = 'Checks syntax of channel';
        this.keys = Object.keys(PermissionFlagsBits);
    }

    async run(command, { interaction, args, instance }) {

        if (!interaction.guild) return true;
        const availableChannels = await instance.channels.getAvailableChannels(interaction.guild.id, command.name);

        if (availableChannels.length && !availableChannels.includes(interaction.channel.id)) {
            const channelNames = availableChannels.map(c => `<#${c}> `);
            interaction.reply(`You can only run thus command inside of following channels: ${channelNames}`);
            return false;
        }

        return true;
    }
}

export default Channel;