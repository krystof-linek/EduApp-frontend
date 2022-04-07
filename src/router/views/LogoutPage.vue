<template>
  <div></div>
</template>

<script>
  export default {
    methods:{
      logout(){
        this.$router.push("/");
        this.$emit("logoutUser");
      },
    },
    mounted(){
        this.logout();
    }
  }
</script>