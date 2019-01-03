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

    export default {
        name: 'App',

        data() {
            return {
                loading: false,
                store: new Store()
            }
        },

        computed: {
            loading() {
                return this.store.initialized
            }
        },

        methods: {
            addWord() {

            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
