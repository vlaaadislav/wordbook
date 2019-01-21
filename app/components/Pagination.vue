<template>
    <FlexboxLayout orientation="horizontal" alignItems="center">
        <Button :visibility="value !== 1 ? 'visible' : 'collapsed'" text="Prev" @tap="$emit('input', value - 1)"/>

        <Label :text="`${value} из ${pages}`" color="black"/>

        <Button :visibility="value !== pages ? 'visible' : 'collapsed'" text="Next" @tap="$emit('input', value + 1)"/>
    </FlexboxLayout>
</template>

<script>
    export default {
        name: 'Pagination',

        props: {
            value: {
                type: Number
            },

            total: {
                type: Number,
                required: true
            },

            perPage: {
                type: Number,
                default: 10
            }
        },

        computed: {
            pages() {
                return Math.ceil(this.total / this.perPage)
            }
        }
    }
</script>

<style scoped>
    Button {
        height: 30;
        font-size: 10;
        padding: 0;
        width: 50;
        background-color: #795548;
        color: white;
    }
</style>