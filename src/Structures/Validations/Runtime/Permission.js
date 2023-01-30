import { PermissionFlagsBits } from 'discord.js';
import Validation from "../../Base/Validation.js";
import PermissionDB from "../../Schemas/PermissionDB.js";

class Permission extends Validation {

    constructor() {
        super();
        this.name = 'Permission is required';
        this.description = 'Checks syntax of permission';
        this.keys = Object.keys(PermissionFlagsBits);
    }

    async run(command, { interaction, args }) {

        if (!interaction.member) return true;

        const allPermissions = [...command.permission];
        const uid = `${interaction.guild.id}-${command.name}`;
        const document = await PermissionDB.findOne({ Id: uid })

        if (document) {
            for (const permission of document.Permissions) {
                if (!allPermissions.includes(permission))
                allPermissions.push(permission);
            }
        }

        if (allPermissions.length) {
            const missingPermissions = [];

            for (const permission of allPermissions) {
                if (!interaction.member.permissions.has(permission)) {
                    const permissionName = this.keys.find((key) => key === permission || PermissionFlagsBits[key] === permission);
                    missingPermissions.push(permissionName);
                }

            }

            if (missingPermissions.length) {
                const allCaps = missingPermissions.map((permission) => permission.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase());
                const text = `Missing permissions: **${allCaps.join(', ')}**`;
                //const text = `Missing permissions: **${missingPermissions.join(', ')}**`;
                interaction.reply(text);
                return false;
            }

        }

        return true;
    }
}

export default Permission;