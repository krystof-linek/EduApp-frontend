<template>
    <div class="mx-16 my-2 my-lg-4 my-xl-6 py-4" id="my-notice-content" :style="'border-color: ' + color">
        <v-card-title class="mx-n2 py-4 black--text" :style="textStyle">
            <v-icon :style="iconStyle" class="mx-3" :color="getIconColor">{{ icon }}</v-icon> 
            <span class="font-weight-bold" v-if="title != ''">{{ title }}</span>
            <span v-if="title != '' && description != ''">{{ ': ' }}</span>
            <span v-if="description != ''">{{ description }}</span>
        </v-card-title>
    </div>    
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        color: {default: 'blue'},
        icon: {default: 'mdi-lightbulb-on-outline'},
        description: {default: ''},
    },
    computed: {
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1.3vw;'
            default: return 'font-size: 1.4vw;' //xl
            }
        },
        iconStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1.3vw;'
            default: return 'font-size: 2vw;' //xl
            }
        },
        getIconColor () {
            switch (this.icon) {
            case 'mdi-lightbulb-on-outline': return 'yellow'
            case 'mdi-exclamation-thick': return 'error'
            case 'mdi-help': return 'blue'
            default: return 'black'
            }
        },
    },
}
</script>
<style>
#my-notice-content{
    border-style: solid;
    border-radius: 15px;
}
</style>