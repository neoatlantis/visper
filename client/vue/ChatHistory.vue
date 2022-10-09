<template>
<div class="text-white" style="padding: 0.5em">

    <div v-for="(entry, entry_i) in list" style="padding: 0">
        <div v-if="'system' == entry.type" style="text-align:center">
            <span style="font-weight: bold">SYSTEM:</span>
            {{ entry.text }}
        </div>
        <div v-if="'message' == entry.type" style="margin-top: 0.5em">
            <div :style="{color:entry.is_outgoing?'#99FF99':'#9999FF'}">
                {{ entry.is_outgoing ? "Me" : entry.sender }}
                <ChatHistoryDateformat :date="entry.time"></ChatHistoryDateformat>
            </div>
            <div style="padding-left:1em">
            {{ entry.text }}
            </div>
        </div>
    </div>


</div>
</template>
<script>

import ChatHistoryDateformat from "./ChatHistoryDateformat.vue";

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
                        is_outgoing: ((i % 3) == 2),
                        sender: ["Alice", "Bob", "Me"][i % 3],
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
        
    },

    components: {
        ChatHistoryDateformat,
    }
}
</script>
