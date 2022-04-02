<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="40vw">
      <v-card>
        <v-card-title class="text-h6 white--text blue">
          {{propTitle}}
        </v-card-title>

        <v-card-text class="mt-2" style="font-size: 1.2vw">
            {{propText}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="font-weight-bold" color="success" text @click="setResult(true)">
            ANO
          </v-btn>
          <v-btn class="font-weight-bold" color="error" text @click="setResult(false)">
            NE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
    methods: {
        setResult(result){
            this.$emit('dialogResult', result, this.propType);

             this.dialog = false;
        },
    }
  }
</script>