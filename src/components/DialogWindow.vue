<template>
    <v-dialog v-model="dialog" :width="dialogWidth" persistent>
      <v-card>
        <v-card-title :style="titleFontSize" class="pb-3 pb-sm-4 white--text blue">
          {{propTitle}}
        </v-card-title>

        <v-card-text :style="textFontSize" class="mt-4">
            {{propText}}
        </v-card-text>

        <v-divider></v-divider>

        <v-row class="py-0 my-0 ma-2">

          <v-col cols="6" class="text-center py-2 py-sm-4">
            <v-btn :style="btnFontStyle" class="font-weight-bold" color="success" text @click="setResult(true)">
                ANO
            </v-btn>
          </v-col>

          <v-col cols="6" class="text-center py-2 py-sm-4">
            <v-btn :style="btnFontStyle" class="font-weight-bold" color="error" text @click="setResult(false)">
            NE
          </v-btn>
          </v-col>

        </v-row>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        propTitle: {default: ''},
        propText: {default: ''},
        propType: {default: 'withoutType'},
    },
    data () {
      return {
        dialog: true,
      }
    },
    computed: {
      dialogWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '80vw'
          case 'sm': return '70vw'
          case 'md': return '50vw'
          case 'lg': return '50vw'
          default: return '40vw'
          }
      },
      titleFontSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.8vw; line-height: 150%; font-weight: bold'
          case 'sm': return 'font-size: 2.4vw; line-height: 150%; font-weight: bold'
          case 'md': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          case 'lg': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          default: return 'font-size: 1.5vw; line-height: 170%; font-weight: bold'
          }
      },
      textFontSize () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 3.2vw; line-height: 150%; text-align: justify;'
          case 'sm': return 'font-size: 2.2vw; line-height: 150%; text-align: justify;'
          case 'md': return 'font-size: 1.8vw; line-height: 170%; text-align: justify;'
          case 'lg': return 'font-size: 1.5vw; line-height: 170%; text-align: justify;'
          default: return 'font-size: 1.2vw; line-height: 170%; text-align: justify;'
          }
      },
      btnFontStyle () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'font-size: 4vw;'
          case 'sm': return 'font-size: 2.5vw'
          case 'md': return 'font-size: 2vw; line-height: 170%; font-weight: bold'
          case 'lg': return 'font-size: 1.5vw; line-height: 170%; font-weight: bold'
          default: return 'font-size: 1.4vw; line-height: 170%; font-weight: bold'
          }
      },
    },
    methods: {
        setResult(result){
            this.$emit('dialogResult', result, this.propType);

             this.dialog = false;
        },
    }
  }
</script>