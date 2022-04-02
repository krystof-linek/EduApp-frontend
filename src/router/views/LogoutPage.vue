<template>
  <div></div>
</template>

<script>
  export default {
    methods:{
      logout(){
        this.$emit("logoutUser");
        this.$router.push("/");
      },
    },
    mounted(){
        this.logout();
    }
  }
</script>