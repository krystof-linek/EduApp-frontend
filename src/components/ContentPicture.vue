<template>
    <v-row align="center" class="justify-center my-2 my-xl-4">
        <v-card outlined color="transparent" :style="textStyle">
            <v-col cols="12" class="text-center py-0">
                <v-card :width="cardWdith" rounded="lg">
                    <v-img :src='src' :alt='alt'></v-img>
                </v-card>
            </v-col>
            
            <v-col v-if="title != ''" class="text-center py-0 mt-1 mt-sm-3 mt-lg-5 mt-xl-7" cols="12">
                <span class="font-weight-regular">{{ title }}</span>
                <span class="font-weight-regular" v-if="title != '' && description != ''">: </span>
                <span class="font-italic">{{ description }}</span>
            </v-col>

            <v-col  v-if="title != '' && author != ''" cols="12" class="text-center font-weight-regular py-0">
                <span class="font-weight-bold">Zdroj: </span>{{ author }}
            </v-col>

        </v-card>
    </v-row>
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        src: {default: ''},
        description: {default: ''},
        alt: {default: 'popisek neni k dispozici'},
        author: {default: ''}
    },
    computed: {
        textStyle() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return 'font-size: 3vw'
            case 'sm': return 'font-size: 2vw'
            case 'md': return 'font-size: 1.2vw'
            case 'lg': return 'font-size: 1.1vw'
            default: return 'font-size: 1vw' //xl
            }
        },
        cardWdith() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '85vw'
            case 'sm': return '70vw'
            case 'md': return '40vw'
            case 'lg': return '40vw'
            default: return '35vw' //xl
            }
        },
    },
}
</script>
<style>
#pic-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 50vw;
}

#pic-description {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>