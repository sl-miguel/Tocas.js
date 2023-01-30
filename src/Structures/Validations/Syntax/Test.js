import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";
import configuration from "../../../../configuration.json" assert { type: 'json' };

class Test extends Validation {

    constructor() {
        super();
        this.name = 'Test is required';
        this.description = 'Checks syntax of test';
    }

    run(command) {
        if (command.test && !configuration.GUILDS.DEV.length)
        Tracer.error(`Command ${command.constructor.name}.js is a test command, but no test guilds were specified.`);
    }
}

export default Test;