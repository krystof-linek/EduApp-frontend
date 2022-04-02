<template>
    <div class="my-4 my-lg-6">
        <label id="my-title-link" v-if="title != ''">{{ title }}</label>
        <label id="my-title-link" v-if="title != '' && description != ''">: </label>
        <label id="my-description-link" v-if="description != ''">{{description }}</label>
        <v-btn id="my-btn-link" :color='btn_color' class="ml-3 mb-1" small @click="myRedirect">{{btn_title}}</v-btn>
    </div>    
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        link: {default: ''},
        btn_title: {default: 'navštívit'},
        btn_color: {default: 'blue'},
        description: {default: ''},
    },
    methods: {
        myRedirect(){
            window.open(this.link,'_blank');
        },
    }
}
</script>
<style>
#my-btn-link{
    font-size: 1vw;
    font-weight: bold;
    color: white;
}
#my-title-link{
    font-size: 1.5vw;
    font-weight: 600;
}
#my-description-link{
    font-size: 1.5vw;
    font-weight: 400;
    font-style: italic;
    
}
</style>