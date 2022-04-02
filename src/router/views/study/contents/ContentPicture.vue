<template>
    <div>
        <img :src='src' id="pic-center" :alt='alt'>

        <div v-if="title != ''" id="pic-description">
            <span class="text-subtitle-1 font-weight-regular">{{ title }}</span>
            <span v-if="title != '' && description != ''" class="text-subtitle-1">: </span>
            <span class="text-subtitle-1 font-italic">{{ description }}</span>
        </div>
        
        <div v-if="author != ''">
            <span>{{ author }}</span>
        </div>
    </div>    
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        src: {default: ''},
        description: {default: ''},
        alt: {default: 'popisek neni k dispozici'},
        author: {default: ''}
    }
}
</script>
<style>
#pic-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 50vw;
}

#pic-description {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>