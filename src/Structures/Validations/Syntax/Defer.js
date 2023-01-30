import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Defer extends Validation {

    constructor() {
        super();
        this.name = 'Defer';
        this.description = 'Checks syntax of defer';
    }

    run(command) {
        if (command.defer && typeof command.defer !== 'boolean' && command.defer !== 'ephemeral')
        Tracer.error(`Command ${command.constructor.name}.js defer needs a valid value. Use true, false, ephemeral.`);
    }
}

export default Defer;