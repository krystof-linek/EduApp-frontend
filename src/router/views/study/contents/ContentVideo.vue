<template>
    <div>
        <youtube id="vid-center" :video-id="videoId" ref="youtube"></youtube>

        <div v-if="title != ''" id="vid-decsription">
            <span class="text-subtitle-1 font-weight-regular">{{ title }}</span>
            <span v-if="title != '' && description != ''" class="text-subtitle-1">: </span>
            <span class="text-subtitle-1 font-italic">{{ description }}</span>
            <span v-if="author != ''">{{ author }}</span>
        </div>
    </div>    
</template>
<script>
export default  {
    data () {
      return {
          videoId: '',
      }
    },
    props: {
        title: {default: ''},
        src: {default: ''},
        description: {default: ''},
        author: {default: ''}
    },
    methods: {
        getId () {
            this.videoId = this.$youtube.getIdFromUrl(this.src)
        },
    },
    mounted(){
        this.getId();
    },
    computed: {
    player() {
        return this.$refs.youtube.player
    }
  }

}
</script>
<style>
#vid-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#vid-decsription {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>