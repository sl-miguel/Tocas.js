import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";
import RoleDB from "../../Structures/Schemas/RoleDB.js";

class Role extends Command {

    constructor() {
        super();
        this.name = "role";
        this.description = "Set roles to other commands.";
        this.target = ["GUILD"];
        this.permission = [PermissionFlagsBits.Administrator];
        this.options = [
            {
                name: 'command',
                description: 'The command to set the role',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true
            },
            {
                name: 'role',
                description: 'The role to set for the command',
                type: ApplicationCommandOptionType.Role,
                required: false
            }
        ]
    }

    autocomplete(interaction, command, arg, collection) {
        return [...collection.keys()];
    }

    async run({ interaction, instance, args }) {
        const [commandName, role] = args;

        const command = instance.commands.get(commandName);
        if (!command) return `The command ${commandName} does not exist.`;

        const uid = `${interaction.guild.id}-${command.name}`;

        if (!role) {
            const document = await RoleDB.findOne({ Id: uid });
            const roles = document && document.Roles?.length ? document.Roles.map((roleId) => `<@&${roleId}>`) : 'None';
            return {
                content: `Here are the roles for ${commandName}: ${roles}`,
                allowedMentions: { roles: [] }
            }
        }


        const alreadyExists = await RoleDB.findOne({ Id: uid, Roles: { $in: [role] } });

        if (alreadyExists) {
            await RoleDB.findOneAndUpdate({ Id: uid }, { Id: uid, $pull: { Roles: role } });
            return {
                content: `The command ${commandName} no longer requires the permission <@&${role}>`,
                allowedMentions: { roles: [] }
            };
        }

        await RoleDB.findOneAndUpdate({ Id: uid }, { Id: uid, $addToSet: { Roles: role } }, { upsert: true });

        return {
            content: `The command ${commandName} now requires the role <@&${role}>`,
            allowedMentions: { roles: [] }
        };
    }
}

export default Role;