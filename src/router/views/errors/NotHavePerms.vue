<template>
    <v-card min-height="400" elevation="5" rounded="lg">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Chyba oprávnění!</label>
        </v-card-title>

       

        <v-alert class="mx-16 mt-10" color="error" border="bottom" colored-border type="error" elevation="6">
            <v-card-text style="text-align: justify">
                Na tento požadavek nemáte příslušné oprávnění!
            </v-card-text>
        </v-alert>

       

    </v-card>
</template>