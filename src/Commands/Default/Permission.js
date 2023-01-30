import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";
import PermissionDB from "../../Structures/Schemas/PermissionDB.js";

const clearAllPermissions = 'Clear All Permissions';

class Permission extends Command {

    constructor() {
        super();
        this.name = "permission";
        this.description = "Set permissions to other commands.";
        this.target = ["GUILD"];
        this.permission = [PermissionFlagsBits.Administrator];
        this.options = [
            {
                name: 'command',
                description: 'The command to set the permission',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true
            },
            {
                name: 'permission',
                description: 'The permission to set for the command',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: false
            }
        ]
    }

    autocomplete(interaction, command, arg, collection) {
        if (arg === 'command')
        return [...collection.keys()];

        if (arg === 'permission')
        return [clearAllPermissions, ...Object.keys(PermissionFlagsBits)];
    }

    async run({ interaction, instance, args }) {
        const [commandName, permission] = args;

        const command = instance.commands.get(commandName);
        if (!command) return `The command ${commandName} does not exist.`;

        const uid = `${interaction.guild.id}-${command.name}`;

        if (!permission) {
            const document = await PermissionDB.findOne({ Id: uid });
            const permissions = document && document.Permissions?.length ? document.Permissions.join(', ') : 'None';
            return `Here are the permissions for ${commandName}: ${permissions}`;
        }

        if (permission === clearAllPermissions) {
            await PermissionDB.deleteOne({ Id: uid });
            return `The command ${commandName} no longer requires permissions.`;
        }

        const alreadyExists = await PermissionDB.findOne({ Id: uid, Permissions: { $in: [permission] } });

        if (alreadyExists) {
            await PermissionDB.findOneAndUpdate({ Id: uid }, { Id: uid, $pull: { Permissions: permission } });
            return `The command ${commandName} no longer requires the permission ${permission}`;
        }

        await PermissionDB.findOneAndUpdate({ Id: uid }, { Id: uid, $addToSet: { Permissions: permission } }, { upsert: true });

        return `The command ${commandName} now requires the permission ${permission}`;
    }
}

export default Permission;