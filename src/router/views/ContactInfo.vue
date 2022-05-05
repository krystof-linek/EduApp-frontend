<template>
    <v-card class="pb-16" elevation="5" rounded="lg">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Kontakty</label>
        </v-card-title>

        <v-sheet class="mx-5">
            <v-card-text style="text-align: justify;">
               V této sekci budou uvedeny kontakty na školu.
                <br>
                <br>
                V současnosti jsou zde uvedeny kontakty na autora aplikace.
            </v-card-text>
        </v-sheet>

        <v-card-title class="ml-5 mt-n2 pb-0 font-weight-bold">
          <v-row class="ml-0 pa-0" align="center">
          <v-btn class="mr-2" @click="myRedirect" small fab><v-icon>mdi-github</v-icon></v-btn> GitHub autora
          </v-row>
        </v-card-title>
        <v-sheet class="mx-5">
            <v-card-text style="text-align: justify;">
                V tomto repozitáři lze nalézt zdrojové kódy aplikace. Odkaz je uveden níže, případně stačí kliknout na uvedené tlačítko a uživatel bude automaticky přesměrován na tento git.
                
                <br>
                <br>
                <i>https://github.com/krystof-linek</i>
            </v-card-text>
        </v-sheet>

        <v-card-title class="ml-5 mt-n2 pb-0 font-weight-bold">Kontaktní emaily: </v-card-title>
        <v-sheet class="mx-5">
            <v-card-text>
                Soukromý: <strong>linek.krystof@gmail.com</strong>
                <br>
                Univerzitní: <strong>xlinek@mendelu.cz</strong>
            </v-card-text>
        </v-sheet>

    </v-card>
</template>
<script>

export default {

    methods: {
      myRedirect(){
          window.open('https://github.com/krystof-linek','_blank');
    },
  }
}
</script>