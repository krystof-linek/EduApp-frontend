<template>
    <v-card-title :style="textStyle" class="font-weight-bold black--text py-0 mb-n1 mt-1 mb-sm-0 mt-sm-3 mb-lg-1 mt-lg-4">
        <v-icon :style="iconStyle" class="mr-3" v-if="icon != ''" :color="icon_color">{{ icon }}</v-icon>
        <label :style="titleStyle">{{ title }}</label>
    </v-card-title> 
</template>
<script>
export default  {
    props: {
        title_size: {default: 1},
        title: {default: ''},
        icon: {default: ''},
        icon_color: {default: 'white'},
    },
    computed: {
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 3.5vw'
            case 'sm': return 'font-size: 2.4vw'
            case 'md': return 'font-size: 1.5vw'
            case 'lg': return 'font-size: 1.3vw'
            default: return 'font-size: 1.3vw' //hlavni
            }
        },
        titleStyle() {
            switch (this.title_size) {
            case 2: return 'font-size: 130%'
            case 3: return 'font-size: 120%'
            case 4: return 'font-size: 110%'
            default: return 'font-size: 140%' //hlavni
            }
        },
        iconStyle() {
            switch (this.title_size) {
            case 2: return 'font-size: 170%'
            case 3: return 'font-size: 160%'
            case 4: return 'font-size: 150%'
            default: return 'font-size: 180%' //hlavni
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