<template>
    <div :class="title == '' ? 'mb-2 mt-n5' : 'my-1'">

        <v-card v-if="testItems == null" :style="textStyle" outlined color="transparent">
            <v-card-text class="black--text" :style="textStyle">

                <v-card-title v-if="title != ''" :style="textStyle" class="pa-0 my-0">{{ title }}</v-card-title>
            
                <ul class="ml-10 mb-n2" v-if="!numbered">
                    <li class="my-2 my-xl-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
                </ul> 
                
                <ol class="ml-10 mb-n2" v-else>
                    <li class="my-2 my-xl-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
                </ol>

                <label class="font-italic" v-if="description != ''">{{ description }}</label>

            </v-card-text>
        </v-card>

        <!-- k zobrazení dat, která nejsou uložená -->

        <div v-else>
            <v-card-text class="black--text" :style="textStyle">

                <v-card-title v-if="title != ''" :style="textStyle" class="pa-0 my-0">{{ title }}</v-card-title>
            
                <ul class="ml-10 mb-n2" v-if="!numbered">
                    <li class="my-2 my-xl-4" v-for="(item, index) in testItems" :key="index">{{ item.value }}</li>
                </ul> 
                
                <ol class="ml-10 mb-n2" v-else>
                    <li class="my-2 my-xl-4" v-for="(item, index) in testItems" :key="index">{{ item.value }}</li>
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
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1.3vw; line-height: 160%; text-align: justify;'
            default: return 'font-size: 1.3vw; line-height: 160%; color: black;' //xl
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