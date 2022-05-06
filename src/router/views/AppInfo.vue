<template>
    <v-card class="pb-16" elevation="5" rounded="lg">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Vítejte v aplikaci HudcovkaEdu</label>
        </v-card-title>

        <v-carousel cycle :height="$vuetify.breakpoint.mdAndUp ? '60vh' : $vuetify.breakpoint.sm ? '70vh' : '20vh'" hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(picture, i) in pictures" :key="i">
                <v-sheet :color="colors[i]" height="100%">
                  <v-img :src="pictures[i]" height="100%">
                  </v-img>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>

        <v-card-title class="ml-5 pb-0 font-weight-bold">Výuková webová aplikace</v-card-title>
        <v-sheet class="mx-5">
            <v-card-text style="text-align: justify;">
                Aplikace slouží pro podporu výuky dětí na základní škole, konkrétně je přizpůsobena základní škole Hudcova v Brně. Vyvíjena je v rámci bakalářské práce na Mendelově univerzitě v Brně, jejím autorem je <strong>Kryštof Linek</strong>.
                <br>
                <br>
                V současnosti je aplikace stále v procesu vývoje, jelikož probíhá její testování a současně úprava některých částí uživatelského rozhraní.
            </v-card-text>
        </v-sheet>

        <v-card-title class="ml-5 pb-0 font-weight-bold">Ukázka funkcionalit</v-card-title>
        <v-sheet class="mx-5">
            <v-card-text style="text-align: justify;">
                V aplikaci je možné nalézt ukázku výukového kurzu a vzor testu. K tomuto účelu je níže uveden postup.<br>
                <v-card-subtitle class="mt-1 font-weight-bold">Výukový kurz</v-card-subtitle>
                <v-list-item class="my-n4" v-for="item, index in course_info" :key="item.id">{{ index+1 + '. ' + item.text}} <strong class="ml-2">{{ item.bold }}</strong>. </v-list-item>

                <v-card-subtitle class="mt-1 font-weight-bold">Vzor testu</v-card-subtitle>
                <v-list-item class="my-n4" v-for="item, index in test_info" :key="item.id">{{ index+1 + '. ' + item.text}} <strong class="ml-2">{{ item.bold }}</strong>. </v-list-item>
            </v-card-text>
        </v-sheet>

    </v-card>
</template>
<script>

  export default {

    data () {
      return {
        colors: [
          'blue',
          'blue',
        ],
        pictures: [
          require('@/assets/slides/slide1.jpg'),
          require('@/assets/slides/slide2.jpg'),
        ],
        course_info: [
          {id: 1, text:'Navštivte sekci:', bold: 'Výuka'},
          {id: 2, text:'Vyberte:', bold: '1. ročník'},
          {id: 3, text:'Zvolte předmět:', bold: 'Prvouka'},
          {id: 4, text:'Kurz:', bold: 'Roční období'},
        ],
        test_info: [
          {id: -1,text:'Navštivte sekci:', bold: 'Testy'},
          {id: -2, text:'Následně zvolte:', bold: 'Psát test'},
          {id: -3, text:'Vyberte:', bold: '5. ročník'},
          {id: -4, text:'Zvolte předmět:', bold: 'Matematika'},
          {id: -5, text:'Test:', bold: 'Násobení'},
        ],
      }
    },
  }
</script>