import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Target extends Validation {

    constructor() {
        super();
        this.name = 'Target is required';
        this.description = 'Checks syntax of target';
    }

    run(command) {
        if (command.target.some(element => element !== "GUILD" && element !== "DM"))
        Tracer.error(`Command ${command.constructor.name}.js target needs a valid value. Use DM, GUILD`);
    }
}

export default Target;