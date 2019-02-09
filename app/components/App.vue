<template>
    <Page>
        <ActionBar title="Wordbook">
            <ActionItem
                text="Добавить"
                android.position="popup"
                @tap="addWord"
            />

            <ActionItem
                v-show="!showTranslation"
                text="Показать перевод"
                android.position="popup"
                @tap="showTranslation = !showTranslation"
            />

            <ActionItem
                v-show="showTranslation"
                text="Скрыть перевод"
                android.position="popup"
                @tap="showTranslation = !showTranslation"
            />

            <ActionItem
                v-show="!showWords"
                text="Показать слова"
                android.position="popup"
                @tap="showWords = !showWords"
            />

            <ActionItem
                v-show="showWords"
                text="Скрыть слова"
                android.position="popup"
                @tap="showWords = !showWords"
            />
        </ActionBar>

        <DockLayout>
            <FlexboxLayout dock="bottom" height="40" justifyContent="center" alignItems="center">
                <Pagination v-model="page" :total="store.data.length" :perPage="perPage" @input="savePage"/>
            </FlexboxLayout>

            <GridLayout>
                <StackLayout>
                    <RadListView
                        v-show="!loading"
                        ref="list"
                        for="word in items"
                        swipeActions="true"
                        @itemSwipeProgressStarted="swipe"
                        @itemTap="changeTranslation"
                    >
                        <v-template>
                            <FlexboxLayout class="list-item" justifyContent="space-between" alignItems="center">
                                <Label :text="showWords ? word.source : ''"/>
                                <Label :text="showTranslation ? word.translation : ''"/>
                            </FlexboxLayout>
                        </v-template>

                        <v-template name="itemswipe">
                            <FlexboxLayout class="swipe-items" justifyContent="flex-end">
                                <Button id="delete-button" text="Удалить" ~alignSelf="center" @tap="deleteWord"/>
                            </FlexboxLayout>
                        </v-template>
                    </RadListView>
                </StackLayout>

                <GridLayout rows="*" :visibility="loading ? 'visible' : 'collapsed'">
                    <ActivityIndicator busy="true" width="100" height="100"/>
                </GridLayout>
            </GridLayout>
        </DockLayout>
    </Page>
</template>

<script>
    import Store from '../store/index'
    import TranslationService from '../services/translation'
    import Pagination from './Pagination'
    import * as AppSettings from 'tns-core-modules/application-settings'

    export default {
        name: 'App',

        components: {
            Pagination
        },

        data() {
            return {
                store: new Store(),
                translate: new TranslationService(),
                showTranslation: true,
                showWords: true,
                page: AppSettings.getNumber('page') || 1,
                perPage: 15
            }
        },

        computed: {
            loading() {
                return !this.store.initialized || this.translate.loading
            },

            items() {
                return this.store.data.slice((this.page - 1) * this.perPage, this.page * this.perPage)
            }
        },

        watch: {
            showTranslation() {
                this.$refs.list.refresh()
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

                return this.fetchTranslation(text)
            },

            async fetchTranslation(text) {
                const item = await this.translate.fetch(text)

                if (this.translate.error) {
                    return
                }

                if (this.store.wordsSet.has(item.source)) {
                    return alert('Такое слово уже есть')
                }

                console.log(item.options, item.synonyms)

                if (item.options.length === 0 && item.synonyms.length > 0) {
                    const newText = await action('Возможно вы имели в виду:', 'Отмена', item.synonyms)

                    if (item.synonyms.includes(newText)) {
                        return this.fetchTranslation(newText)
                    }
                }

                this.store.push(item)

                this.$nextTick(() => this.$refs.list.refresh)
            },

            async deleteWord({ object }) {
                this.$refs.list.notifySwipeToExecuteFinished()

                const item = object.bindingContext

                const confirmed = await confirm({
                    title: 'Подтверждение',
                    message: `Вы действительно хотите удалить слово "${item.source}"?`,
                    okButtonText: 'Да',
                    cancelButtonText: 'Нет'
                })

                if (!confirmed) {
                    return
                }

                return this.store.delete(item)
            },

            swipe({ data, object }) {
                const swipeLimits = data.swipeLimits
                swipeLimits.right = object.getViewById('delete-button').getMeasuredWidth()
                swipeLimits.threshold = object.getViewById('delete-button').getMeasuredWidth() / 2
            },

            async changeTranslation({ item }) {
                const translation = await action('Варианты перевода', 'Отмена', item.options)

                if (item.options.includes(translation)) {
                    item.translation = translation
                }

                this.store.update()
            },

            savePage(page) {
                AppSettings.setNumber('page', page)
            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #795548;
        color: #ffffff;
    }

    Page {
        background-color: #FFF9C4;
    }

    #delete-button {
        color: #ffffff;
        background-color: #BF360C;
    }

    .list-item {
        padding: 0 10;
        color: #000000;
        height: 40;
        border-bottom-width: 1;
        border-color: #BDBDBD;
        background-color: #FFF9C4;
    }

    .swipe-items {
        border-bottom-width: 1;
        border-color: #BDBDBD;
    }
</style>
