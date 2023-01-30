import { memoryUsage } from 'process';
import {totalmem} from 'os';
import { join } from 'path';
import { readdir } from 'fs/promises';

class Utility {

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static root(path) {
        const root = process.cwd();
        return join(root, path);
    }

    static async files(path) {
        const files = await readdir(path, { withFileTypes: true });
        let filesFound = [];

        for (const file of files) {
            const name = join(path, file.name);

            if (file.isDirectory()) {
                filesFound = [ ...filesFound, ...await this.files(name)];
                continue;
            }

            filesFound.push(name);
        }
        
        return filesFound;
    }

    static optionsDifferent(options, existingOptions) {
        if (options.length !== existingOptions.length)
        return true;

        for (let a = 0; a < options.length; ++a) {
            const option = options[a]
            const existing = existingOptions[a]

            if (option.name !== existing.name || option.type !== existing.type || option.description !== existing.description)
            return true
        }

        return false
    }

    static get RAM() {
        return totalmem();
    }

    static get USED_RAM() {
        const { heapUsed } = memoryUsage();
        return heapUsed;
    }

}

export default Utility;