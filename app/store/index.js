import * as AppSettings from 'tns-core-modules/application-settings'

export default class Store {
    constructor() {
        this.initialized = false
        this.data = Array.from({ length: 100 }, (_, index) => ({ source: 'Translation' + index, translation: 'Перевод' }))
        this.init()
    }

    get wordsSet() {
        return new Set(this.data.map(item => item.source))
    }

    init() {
        if (!AppSettings.hasKey('data')) {
            // this.update()
        } else {
            // this.data = JSON.parse(AppSettings.getString('data'))
        }

        this.initialized = true
    }

    update() {
        return AppSettings.setString('data', JSON.stringify(this.data))
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