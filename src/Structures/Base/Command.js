import Tracer from '../Utililites/Tracer.js';

// temporaire a changer vers validations ou importer from client this.client.settings
import configuration from '../../../configuration.json' assert { type: 'json' };


class Command {

    name;
    description;
    target;
    owner;
    nsfw;
    permission;
    cooldown;
    options;
    test;
    defer;
    delete;

    constructor() {
        this.name = null;
        this.description = null;
        this.target = [ "DM", "GUILD" ];
        this.owner = false;
        this.nsfw = false;
        this.test = true;
        this.delete = false;
        this.defer = "ephemeral";
        this.permission = [];
        this.cooldown = 0;
        this.options = [];
    }

    async run() {}
    autocomplete() {}
    prepare() {}

}

export default Command;