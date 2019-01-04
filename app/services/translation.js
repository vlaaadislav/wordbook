// https://script.google.com/macros/s/AKfycbz9WT8dWMRdbOpbwk78FSzB_g1Kvw-EDYYaP8P1alrCbF0p9NY/exec

export default class TranslationService {
    constructor() {
        this.url = 'https://script.google.com/macros/s/AKfycbz9WT8dWMRdbOpbwk78FSzB_g1Kvw-EDYYaP8P1alrCbF0p9NY/exec'
        this.loading = false
        this.error = null
    }

    async fetch(word) {
        this.error = null
        this.loading = true

        try {
            const response = await fetch(`${this.url}?q=${word}`)
            const data = await response.json()
            this.loading = false
            return TranslationService.formatResponse(data)
        } catch (e) {
            this.error = e
            this.loading = false
        }
    }

    static formatResponse(data) {
        const source = data[0][0][1]
        const translation = data[0][0][0]
        const other = data[1].map(words => ({
            class: words[0],
            words: words[1]
        }))
        const definitions = data[12].map(words => ({
            class: words[0],
            definitions: words[1].map(definition => definition[0])
        }))

        return {
            source: source.slice(0, 1).toUpperCase() + source.slice(1),
            translation,
            other,
            definitions
        }
    }
}