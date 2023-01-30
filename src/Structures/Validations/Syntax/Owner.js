import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";
import configuration from "../../../../configuration.json" assert { type: 'json' };

class Owner extends Validation {

    constructor() {
        super();
        this.name = 'Owner';
        this.description = 'Checks syntax of owner';
    }

    run(command) {
        if (command.owner && !configuration.BOT.OWNERS.length)
        Tracer.error(`Command ${command.constructor.name}.js is a owner command, but no owners were specified.`);
    }
}

export default Owner;