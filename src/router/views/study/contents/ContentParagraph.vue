<template>
    <div>
        <div v-if="title != ''" id="my-par-title" class="mt-2 mt-lg-3 mt-xl-6 mb-3 mb-lg-6 mb-xl-9">
            <h1 v-if="title_size == 1">{{ title }}</h1>
            <h2 v-if="title_size == 2">{{ title }}</h2>
            <h3 v-if="title_size == 3">{{ title }}</h3>
            <h4 v-if="title_size == 4">{{ title }}</h4>
        </div>
    
        <p id="my-par-content" class="my-2 my-lg-3">{{ text }}</p>
    </div>    
</template>
<script>
export default  {
    props: {
        title_size: {default: 1},
        title: {default: ''},
        text: {default: ''},
    }
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