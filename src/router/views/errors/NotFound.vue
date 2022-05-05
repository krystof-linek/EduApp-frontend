<template>
    <v-card min-height="400" elevation="5" rounded="lg">
        <v-card-title class="justify-center font-weight-bold blue white--text py-2 py-md-4 py-xl-6">
            <label :id="'my-window-title-' + $vuetify.breakpoint.name">Stránka nenalezena!</label>
        </v-card-title>

       

        <v-alert class="mx-16 mt-10" color="warning" border="bottom" colored-border type="error" elevation="6">
            <v-card-text style="text-align: justify">
                Omlouváme se, ale Vámi hledaný obsah nebyl nalezen. Ujistěte se prosím, zda je Váš požadavek správný.
            </v-card-text>
        </v-alert>

       

    </v-card>
</template>