<template>
    <v-row align="center" class="justify-center my-2 my-xl-4">
        <v-card outlined color="transparent" :style="textStyle">
            <v-col cols="12" class="text-center py-0">
                <v-card :width="cardWdith" rounded="lg">
                    <v-img :src='src' :alt='alt'></v-img>
                </v-card>
            </v-col>
            
            <v-col v-if="title != ''" class="text-center pb-0 mt-lg-1 mt-xl-2" cols="12">
                <span class="font-weight-regular">{{ title }}</span>
                <span v-if="title != '' && description != ''" class="text-subtitle-1">: </span>
                <span class="font-italic">{{ description }}</span>
            </v-col>

            <v-col  v-if="title != '' && author != ''" cols="12" class="text-center font-weight-regular py-0">
                <span class="font-weight-bold">Autor: </span>{{ author }}
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
            case 'xs': return 'font-size: 2vw'
            case 'sm': return 'font-size: 1.9vw'
            case 'md': return 'font-size: 1.8vw'
            case 'lg': return 'font-size: 1vw'
            default: return 'font-size: 1vw' //xl
            }
        },
        cardWdith() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '2vw'
            case 'sm': return '1.9vw'
            case 'md': return '1.8vw'
            case 'lg': return '30vw'
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