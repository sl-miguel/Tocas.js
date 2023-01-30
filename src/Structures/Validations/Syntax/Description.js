import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Description extends Validation {

    constructor() {
        super();
        this.name = 'Description is required';
        this.description = 'Checks syntax of description';
    }

    run(command) {
        if (!command.description)
        Tracer.error(`Command ${command.constructor.name}.js needs a description.`);

        if (typeof command.description !== 'string')
        Tracer.error(`Command ${command.constructor.name}.js description needs to be a string.`);
    }
}

export default Description;