<template>
<div ref="container" class="text-white" style="padding: 0.5em; margin:1em 0 1em 0; height:80vh; overflow-x: hidden; overflow-y: scroll">

        <div v-for="(entry, entry_i) in list" style="padding: 0">
            <div v-if="'system' == entry.identity" style="text-align:center">
                <span style="font-weight: bold">SYSTEM:</span>
                {{ entry.text }}
            </div>
            <div v-if="'text' == entry.data.type" style="margin-top: 0.5em">
                <div :style="{color:entry.is_self?'#99FF99':'#9999FF'}">
                    {{ entry.is_self ? "Me" : entry.identity.slice(0,16) + "..." + entry.identity.slice(-16) }}
                    <ChatHistoryDateformat :date="entry.time"></ChatHistoryDateformat>
                </div>
                <div style="padding-left:1em">
                {{ entry.data.text }}
                </div>
            </div>
        </div>

</div>
</template>
<script>

import ChatHistoryDateformat from "./ChatHistoryDateformat.vue";
import ChatHistory from "app/ChatHistory";


export default {

    mounted(){

        ChatHistory.on("message", (e)=>{
            this.list.push(e)
            setTimeout(()=>this.scroll_to_bottom(), 1);
        });

    },

    data(){ return {
        /// #if DEV
        list: (()=>{
            let ret = [];
            for(let i=0; i<1000; i++){
                ret.push({
                    data: { type: "text", text: "user text " + i},
                    identity: "010102032932895139258139205892158120",
                    time: new Date(),
                    is_self: true,
                })
            }
            return ret;
        })(),
        /// #else
        list: [],
        /// #endif
        /*
        {
            data: { type: "text", text: "user text" },
            identity: "HEX...",
            time:
            is_self
        }
         */
    } },

    methods: {

        scroll_to_bottom(){
            const el = this.$refs["container"];
            el.scrollTop = el.scrollHeight + 0xFFFFFF;
        },

    },

    components: {
        ChatHistoryDateformat,
    }
}
</script>
