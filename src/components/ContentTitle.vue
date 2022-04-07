<template>
    <v-card-title class="font-weight-bold pb-3 pt-0 pb-lg-4 pt-lg-1 pb-xl-5 pt-xl-2 black--text" :style="titleStyle">
        <v-icon :style="titleStyle" class="mr-3" v-if="icon != ''" :color="icon_color">{{ icon }}</v-icon>{{ title }}
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
        titleStyle() {
        switch (this.title_size) {
          case 2: return 'font-size: 2vw'
          case 3: return 'font-size: 1.9vw'
          case 4: return 'font-size: 1.8vw'
          default: return 'font-size: 2.2vw' //hlavni
        }
      },
    },
    methods: {
        titleStyleTest() {
        switch (this.title_size) {
          case 2: return '2.5vw'
          case 3: return '2.5vw'
          case 4: return '2.5vw'
          default: return '5vw' //hlavni
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