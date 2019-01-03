import { knownFolders, path, File } from 'tns-core-modules/file-system'

export default class Store {
    constructor() {
        this.initialized = false
        this.data = {
            words: []
        }
        this.init()
    }

    get all() {
        return this.data.words
    }

    async init() {
        const path = path.join(knownFolders.documents().path, 'wordbook.json')

        if (File.exists(path)) {
            await File.fromPath(path).writeText(JSON.stringify(this.data))
        } else {
            this.data = JSON.parse(await File.fromPath(path).readText())
        }

        this.initialized = true
    }
}