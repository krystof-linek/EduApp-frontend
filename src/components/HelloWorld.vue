<template>
<v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Nový obrázek</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Název" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Poznámka" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Alternativní text" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="['Internet', 'Místní disk']" label="Zdroj" required></v-select>
              </v-col>
              <v-col cols="12">
                <img :src="previewImage" class="uploading-image" />
                <input type="file" accept="image/jpeg" @change=uploadImage>
                <v-file-input v-model="files" placeholder="Upload your documents" label="File input" prepend-icon="mdi-paperclip" accept="image/jpeg" @change="uploadImage">
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="primary">{{ text }} </v-chip>
                  </template>
                </v-file-input>
             </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="newVideo">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
  export default {
    data: () => ({
      dialog: false,
      files: [],
      previewImage:null
    }),
    methods:{
      newVideo(){
        console.log(this.files);
      },
      uploadImage(e){
                const image = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    this.previewImage = e.target.result;
                    console.log(this.previewImage);
                };
            }
    },
    
  }
</script>