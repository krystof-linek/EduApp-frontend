<template>
    <v-card-text class="py-1 py-sm-2 py-md-2 py-xl-4 black--text" :style="textStyle" v-if="text != ''">
        {{ text }}
    </v-card-text>
</template>
<script>
export default  {
    props: {
        text: {default: ''},
    },
    computed: {
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 3.5vw; line-height: 150%; text-align: justify;'
            case 'sm': return 'font-size: 2.4vw; line-height: 150%; text-align: justify;'
            case 'md': return 'font-size: 1.5vw; line-height: 160%; text-align: justify;'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%; text-align: justify;'
            default: return 'font-size: 1.3vw; line-height: 160%; text-align: justify;' //xl
            }
        },
    },
}
</script>
<style>
#my-par-title h1{
    font-size: 3vw;
    font-weight: bold;
}

#my-par-title h2{
    font-size: 2.5vw;
}

#my-par-title h3{
    font-size: 2vw;
}

#my-par-title h4{
    font-size: 1.5vw;
}

#my-par-content{
    font-size: 1.5vw;
}
</style>