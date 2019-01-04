<template>
    <Page>
        <ActionBar title="Wordbook">
            <ActionItem
                text="Добавить"
                android.position="popup"
                @tap="addWord"
            />
        </ActionBar>

        <ActivityIndicator
            v-if="loading"
            busy
            width="100"
            height="100"
        />

        <template v-else>
            <ListView for="word in store.data" rowHeight="40">
                <v-template>
                    <FlexboxLayout class="list-item" justifyContent="space-between" alignItems="center">
                        <Label :text="word.source"/>
                        <Label :text="word.translation"/>
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </template>
    </Page>
</template>

<script>
    import Store from '../store/index'
    import TranslationService from '../services/translation'

    export default {
        name: 'App',

        data() {
            return {
                store: new Store(),
                translate: new TranslationService()
            }
        },

        computed: {
            loading() {
                return !this.store.initialized || this.translate.loading
            }
        },

        methods: {
            async addWord() {
                const result = await prompt({
                    title: 'Добавление нового слова',
                    okButtonText: "OK",
                    cancelButtonText: "Отменить"
                })

                const text = result.text.trim()

                if (!result.result || !text) {
                    return alert('Введите слово')
                }

                const item = await this.translate.fetch(text)

                if (this.store.wordsSet.has(item.source)) {
                    return alert('Такое слово уже есть')
                }

                this.store.push(item)
            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .list-item {
        padding: 0 10;
    }
</style>
