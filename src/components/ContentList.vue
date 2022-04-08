<template>
    <div :class="title == '' ? 'mb-2' : 'my-1'">

        <v-card v-if="testItems == null" :style="textStyle" outlined color="transparent">
            <v-card-text class="black--text py-0" :style="textStyle">

                <v-card-title v-if="title != ''" :style="textStyle" class="pa-0 my-0 pb-sm-2">{{ title }}</v-card-title>
            
                <ul class="ml-2 ml-sm-4 mt-sm-n2 ml-lg-10 ml-xl-16" v-if="!numbered">
                    <li class="my-2 my-sm-3 my-xl-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
                </ul> 
                
                <ol class="ml-2 ml-sm-4 mt-sm-n2 ml-lg-10 ml-xl-16" v-else>
                    <li class="my-2 my-sm-3 my-xl-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
                </ol>

                <label class="font-italic" v-if="description != ''">{{ description }}</label>

            </v-card-text>
        </v-card>

        <!-- k zobrazení dat, která nejsou uložená -->

        <div v-else>
            <v-card-text class="black--text py-0" :style="textStyle">

                <v-card-title v-if="title != ''" :style="textStyle" class="pa-0 my-0 pb-sm-2">{{ title }}</v-card-title>
            
                <ul class="ml-2 ml-sm-4 mt-sm-n2 ml-lg-10 ml-xl-16" v-if="!numbered">
                    <li class="my-2 my-sm-3 my-xl-4" v-for="(item, index) in testItems" :key="index">{{ item.value }}</li>
                </ul> 
                
                <ol class="ml-2 ml-sm-4 mt-sm-n2 ml-lg-10 ml-xl-16" v-else>
                    <li class="my-2 my-sm-3 my-xl-4" v-for="(item, index) in testItems" :key="index">{{ item.value }}</li>
                </ol>

                <label class="font-italic" v-if="description != ''">{{ description }}</label>

            </v-card-text>
        </div>

    </div>    
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        description: {default: ''},
        items: [],
        numbered: {default: false},
        testItems: [],
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
#my-title-list{
    font-size: 1.5vw;
    font-weight: bold;
}

#my-item-list{
    font-size: 1.5vw;
}

#my-description-list{
    font-size: 1.3vw;
    font-style: italic;
}

#my-par-title h4{
    font-size: 1.5vw;
}

#my-par-content{
    font-size: 1.5vw;
}
</style>