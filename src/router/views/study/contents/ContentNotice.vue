<template>
    <div class="my-4 my-lg-6" id="my-notice-content" :style="'border-color: ' + color">
        <span><v-icon class="mr-2 mb-1 mr-md-2 mb-md-1 mr-lg-3 mb-lg-2" v-bind="getIconSize" :color="getIconColor">{{ icon }}</v-icon></span>
        <label id="my-notice-title" v-if="title != ''">{{ title }}</label>
        <label id="my-notice-title" v-if="title != '' && description != ''">: </label>
        <label id="my-notice-description" v-if="description != ''">{{description }}</label>
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
        getIconColor () {
            switch (this.icon) {
            case 'mdi-lightbulb-on-outline': return 'yellow'
            case 'mdi-exclamation-thick': return 'error'
            case 'mdi-help': return 'blue'
            default: return 'black'
            }
        },
        getIconSize () {
            const size = {
                xs:'small',sm:'small',lg:'large',xl:'x-large'
            }[this.$vuetify.breakpoint.name];
        
        return size ? { [size]: true } : {}
        },
    },
}
</script>
<style>
#my-notice-content{
    width: 90%;
    border-style: solid;
    border-radius: 15px;
    margin: auto;
    padding: 2vh;
}
#my-notice-title{
    font-size: 1.3vw;
    font-weight: 600;
}
#my-notice-description{
    font-size: 1.3vw;
}
</style>