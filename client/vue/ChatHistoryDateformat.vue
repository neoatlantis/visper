<template>
    <span>{{ display }}</span>
</template>
<script>
import moment from "moment";
export default {
    props: ["date"],
    computed: {
        display(){
            return moment(this.date).format("YYYY-MM-DD hh:mm:ss");
        }
    }

}
</script>
