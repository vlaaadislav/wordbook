import { knownFolders, path, File } from 'tns-core-modules/file-system'

export default class Store {
    constructor() {
        this.initialized = false
        this.path = path.join(knownFolders.documents().path, 'wordbook.json')
        this.data = Array.from({ length: 100 }, (_, index) => ({ source: 'Translation' + index, translation: 'Перевод' }))
        this.init()
    }

    get wordsSet() {
        return new Set(this.data.map(item => item.source))
    }

    async init() {
        if (File.exists(this.path)) {
            await this.update()
        } else {
            this.data = JSON.parse(await File.fromPath(this.path).readText())
        }

        this.initialized = true
    }

    update() {
        return File.fromPath(this.path).writeText(JSON.stringify(this.data))
    }

    push(item) {
        if (this.wordsSet.has(item.source)) {
            return
        }

        this.data.push(item)

        return this.update()
    }

    delete(item) {
        this.data.splice(this.data.indexOf(item), 1)

        return this.update()
    }
}