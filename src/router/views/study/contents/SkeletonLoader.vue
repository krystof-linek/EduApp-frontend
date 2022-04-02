<template>
  <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3">
    <v-skeleton-loader class="mx-auto" type="article"></v-skeleton-loader>

    <v-skeleton-loader id="pic-center" type="card" width="90%"></v-skeleton-loader>

    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
  </v-sheet>
</template>

<script>
  export default {
    inject: {
      theme: {
        default: { isDark: false },
      },
    },
  }
</script>