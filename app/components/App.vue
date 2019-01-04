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

        <StackLayout v-else>
            <RadListView ref="list" for="word in store.data" swipeActions="true" @itemSwipeProgressStarted="swipe">
                <v-template>
                    <FlexboxLayout class="list-item" justifyContent="space-between" alignItems="center">
                        <Label :text="word.source"/>
                        <Label :text="word.translation"/>
                    </FlexboxLayout>
                </v-template>

                <v-template name="itemswipe">
                    <FlexboxLayout class="swipe-items" justifyContent="flex-end">
                        <Button id="delete-button" text="Удалить" ~alignSelf="center" @tap="deleteWord"/>
                    </FlexboxLayout>
                </v-template>
            </RadListView>
        </StackLayout>
    </Page>
</template>

<script>
    import Store from '../store/index'
    import TranslationService from '../services/translation'
    import DeleteIcon from 'vue-material-design-icons/Delete'

    export default {
        name: 'App',

        components: {
            DeleteIcon
        },

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
