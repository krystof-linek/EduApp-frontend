<template>
    <v-dialog :width="dialogWidth" v-model="dialog" persistent>
      <v-card>
        <v-card-title :style="titleFontSize" class="white--text blue pa-0 py-0 py-md-2">
          <v-row align="center" class="ma-1 my-0">
            <v-col cols="10" sm="11" class="mt-2">
              <span>{{ propTitle }}</span>
            </v-col>
            <v-col cols="2" sm="1" class="mt-n2">
              <v-btn class="mt-n2 ml-4 mt-sm-0 ml-sm-0" v-if="$vuetify.breakpoint.name == 'xs' || $vuetify.breakpoint.name == 'sm'" icon @click="clickOnOk">
                <v-icon v-if="$vuetify.breakpoint.name == 'xs'" color="white">mdi-close-circle</v-icon>
                <v-icon v-else large color="white">mdi-close-circle</v-icon>
              </v-btn>
              
              <v-btn v-else-if="$vuetify.breakpoint.name == 'md'" @click="clickOnOk" class="mt-n2 ml-2" x-small fab><v-icon color="black">mdi-close</v-icon></v-btn>

              <v-btn v-else @click="clickOnOk" class="mt-n4 ml-2 py-5 pa-5 ml-xl-6" x-small fab><v-icon large color="black">mdi-close</v-icon></v-btn>
            
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text class="pa-2 pa-md-6 pa-lg-8" :style="descriptionFontStyle">
          <v-sheet width="100%">
            {{ propText }}
           </v-sheet>

          <v-card class="mt-2 mb-2" v-if="propPicture != ''" :width="pictureWidth" style="margin:auto" rounded="lg" elevation="8"> 
              <v-img :src="propPicture"></v-img>
          </v-card>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn :style="titleFontSize" class="font-weight-bold" color="success" text @click="clickOnOk">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        propText: {default: ''},
        propTitle: {default: 'Upozornění'},
        propPicture: {default: ''},
    },
    data () {
      return {
        dialog: true,
      }
    },
    methods: {
      clickOnOk(){
        this.$emit('clickOnOk');

        this.dialog = false;
      },
    },
    computed:{
      titleFontSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3vw; line-height: 150%; font-weight: bold'
          case 'sm': return 'font-size: 2.4vw; line-height: 150%; font-weight: bold'
          case 'md': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          case 'lg': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          default: return 'font-size: 1.5vw; line-height: 170%; font-weight: bold'
          }
      },
      dialogWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '80vw'
          case 'md': return '80vw'
          case 'lg': return '70vw'
          default: return '60vw'
          }
      },
      descriptionFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3vw; line-height: 170%; text-align: justify;'
          case 'sm': return 'font-size: 2vw; line-height: 160%; text-align: justify;'
          case 'md': return 'font-size: 2vw; line-height: 160%; text-align: justify;'
          case 'lg': return 'font-size: 1.6vw; line-height: 160%; text-align: justify;'
          default: return 'font-size: 1.3vw; line-height: 160%; text-align: justify;'
          }
      },
        pictureWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '55vw'
          case 'sm': return '45vw'
          case 'md': return '40vw'
          case 'lg': return '35vw'
          default: return '30vw'
          }
        },
    },
  }
</script>