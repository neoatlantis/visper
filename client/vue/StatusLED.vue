<template>
    <span
        class="badge"
        :class='{
            "badge-success": color=="green" && on,
            "badge-danger":  color=="red" && on,
            "badge-warning": color=="yellow" && on,
            "badge-secondary": !on, "badge-dimmed": !on
        }'
    ><slot></slot></span>
</template>
<script>
export default {
    props: ["color"],
    data(){ return {
        on: false,
        expired: 0,
    } },

    mounted(){
        setInterval(()=>{
            if(new Date().getTime() > this.expired){
                this.on = false;
            }
        }, 100);
    },

    methods: {
        trigger(){
            this.on = true;
            this.expired = new Date().getTime() + 500;
        }
    }
}
</script>
