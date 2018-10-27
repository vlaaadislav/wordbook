<template>
    <Page>
        <ActionBar title="Wordbook"/>

        <TabView>
            <TabViewItem title="Список слов">
                <Label text="Content for Tab 1" />
            </TabViewItem>

            <TabViewItem title="Новое слово">
                <StackLayout>
                    <TextField v-model="newWord" hint="Введите новое слово"/>
                </StackLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
    export default {
        name: 'App',

        data() {
            return {
                newWord: ''
            }
        },

        methods: {

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
