import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Name extends Validation {

    constructor() {
        super();
        this.name = 'Name is required';
        this.description = 'Checks syntax of name';
    }

    run(command) {
        if (!command.name)
        Tracer.error(`Command ${command.constructor.name}.js needs a name.`);

        if (typeof command.name !== 'string')
        Tracer.error(`Command ${command.constructor.name}.js name needs to be a string.`);

        if (command.name !== command.name.toLowerCase())
        Tracer.error(`Command ${command.constructor.name}.js name needs to be lowercase.`);
    }
}

export default Name;