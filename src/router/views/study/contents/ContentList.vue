<template>
    <div class="my-2">
        <label id="my-title-list" v-if="title != ''" class="my-2 my-lg-6">{{ title }}</label>
        <div>
            <ul v-if="!numbered">
                <li id="my-item-list" class="ml-5 my-2 my-lg-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
            </ul> 
             <ol v-else>
                <li id="my-item-list" class="ml-5 my-2 my-lg-4" v-for="item in items" :key="item.id_item">{{ item.text }}</li>
            </ol>

            <span id="my-description-list" class="ml-11 mt-10" v-if="description != ''">{{ description }}</span>
        </div>
    </div>    
</template>
<script>
export default  {
    props: {
        title: {default: ''},
        description: {default: ''},
        items: [],
        numbered: {default: false}
    }
}
</script>
<style>
#my-title-list{
    font-size: 1.5vw;
    font-weight: bold;
}

#my-item-list{
    font-size: 1.5vw;
}

#my-description-list{
    font-size: 1.3vw;
    font-style: italic;
}

#my-par-title h4{
    font-size: 1.5vw;
}

#my-par-content{
    font-size: 1.5vw;
}
</style>