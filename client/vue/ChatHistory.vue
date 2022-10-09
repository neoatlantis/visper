<template>
<div class="text-white" style="padding: 0.5em">

    <div v-for="(entry, entry_i) in list" style="padding: 0">
        {{ entry }}
    </div>


</div>
</template>
<script>

export default {
    data(){ return {
        list: 
            /// #if DEV
            (()=>{
                let ret = [];
                ret.push({
                    type: "system",
                    text: "Hello world.",
                    time: new Date(),
                });
                for(let i=0; i<10; i++){
                    ret.push({
                        type: "message",
                        text: "Test message No. " + (i+1),
                        time: new Date(),
                    });
                }
                return ret;
            })(),
            /// #else
            [],
            /// #endif
    } },

    methods: {
        
    }
}
</script>
