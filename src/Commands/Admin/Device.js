import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";
class Device extends Command {

    constructor() {
        super();
        this.name = "device";
        this.description = "Sets your device type.";
        this.defer = true;
        this.target = ["GUILD"];
        this.permission = [PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers]
        this.options = [
            {
                name: 'type',
                description: 'The type of your device',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true
            }
        ]
    }

    autocomplete(interaction, command, arg) {
        return ['Mobile', 'Desktop', 'Laptop', 'Tablet'];
    }

    async run({ interaction, args }) {
        return `Your device type is ${args[0]}`;
    }
}

export default Device;