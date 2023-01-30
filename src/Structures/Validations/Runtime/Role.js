import { PermissionFlagsBits } from 'discord.js';
import Validation from "../../Base/Validation.js";
import RoleDB from "../../Schemas/RoleDB.js";

class Role extends Validation {

    constructor() {
        super();
        this.name = 'Role is required';
        this.description = 'Checks syntax of role';
        this.keys = Object.keys(PermissionFlagsBits);
    }

    async run(command, { interaction, args }) {

        if (!interaction.member) return true;

        const uid = `${interaction.guild.id}-${command.name}`;
        const document = await RoleDB.findOne({ Id: uid });

        if (document) {
            let hasRole = false;

            for (const roleId of document.Roles) {
                if (interaction.member.roles.cache.has(roleId)) {
                    hasRole = true;
                    break;
                }
            }

            if (hasRole) return true;

            interaction.reply({
                content: `You need one of these roles: ${document.Roles.map((roleId) => `<@&${roleId}>`)}`,
                allowedMentions: { roles: [] }
            })

            return false;
        }



        return true;
    }
}

export default Role;