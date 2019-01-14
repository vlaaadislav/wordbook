const DICT = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
const DICT_KEY = 'dict.1.1.20190113T173518Z.6b5f6fc6886f7a00.04b3ef123e6617a253f041967b509d7e6d352ba9'

const TRANSLATE = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
const TRANSLATE_KEY = 'trnsl.1.1.20190113T172305Z.c4f9164143be1338.970bea30a1fd7e8bfd561e1e7acba2073898b198'

export default class TranslationService {
    constructor() {
        this.loading = false
        this.error = null
    }

    async fetch(word) {
        this.error = null
        this.loading = true

        try {
            const url = word.split(' ').length === 1
                ? `${DICT}?key=${DICT_KEY}`
                : `${TRANSLATE}?key=${TRANSLATE_KEY}`

            const response = await fetch(`${url}&lang=en-ru&text=${encodeURIComponent(word)}`)
            const data = await response.json()
            this.loading = false
            return TranslationService.formatResponse(word, data)
        } catch (e) {
            this.error = e
            this.loading = false
            alert(e.message)
        }
    }

    static formatResponse(source, data) {
        const options = data.def
            ? data.def.reduce((acc, item) => {
                if (item.text.toLowerCase() === source.toLowerCase()) {
                    acc.push(...item.tr.map(tr => tr.text))
                }

                return acc
            }, [])
            : data.text

        return {
            source,
            translation: options[0] || '',
            options,
            definitions: []
        }
    }
}