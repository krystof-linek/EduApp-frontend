<template>
    <div class="mx-8 my-4 my-sm-6 py-1 mx-lg-16 py-lg-4" id="my-notice-content" :style="'border-color: ' + color">
        <v-card class="mx-0 py-4 py-sm-6 black--text" color="transparent" outlined :style="textStyle">
            <v-row class="mx-1" align="center">
                <v-col cols="1" class="pa-0 text-center">
                    <v-icon :style="iconStyle" class="mx-0 mt-n1" :color="getIconColor">{{ icon }}</v-icon> 
                </v-col>

                <v-col cols="11" class="pa-0">
                    <span class="font-weight-bold" v-if="title != ''">{{ title }}</span>
                    <span v-if="title != '' && description != ''">: </span>
                    <span v-if="description != ''">{{ description }}</span>
                </v-col>
            </v-row>

        </v-card>
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
            case 'xs': return 'font-size: 3.5vw; line-height: 150%;'
            case 'sm': return 'font-size: 2.4vw; line-height: 150%;'
            case 'md': return 'font-size: 1.5vw; line-height: 160%;'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%;'
            default: return 'font-size: 1.3vw; line-height: 160%;' //xl
            }
        },
        iconStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 6.5vw'
            case 'sm': return 'font-size: 5vw'
            case 'md': return 'font-size: 3.5vw'
            case 'lg': return 'font-size: 3vw;'
            default: return 'font-size: 2.5vw;' //xl
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