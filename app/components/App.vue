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
            <ListView for="word in store.all">
                <v-template>
                    <FlexboxLayout justifyContent="space-between">
                        <Label :text="word.word"/>
                        <Label :text="word.translation"/>
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </template>
    </Page>
</template>

<script>
    import Store from '../store'
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
                return this.store.initialized || this.translate.loading
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
                    return
                }

                await this.translate.fetch(text)
            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
</style>
