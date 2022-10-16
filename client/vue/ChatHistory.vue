<template>
<div class="text-white" style="padding: 0.5em; margin:1em 0 1em 0; height:80vh; overflow-x: hidden; overflow-y: scroll">

        <div v-for="(entry, entry_i) in list" style="padding: 0">
            <div v-if="'system' == entry.identity" style="text-align:center">
                <span style="font-weight: bold">SYSTEM:</span>
                {{ entry.text }}
            </div>
            <div v-if="'text' == entry.data.type" style="margin-top: 0.5em">
                <div :style="{color:entry.is_self?'#99FF99':'#9999FF'}">
                    {{ entry.is_self ? "Me" : entry.sender }}
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
            console.log("--------", e);
            this.list.push(e)
        });

    },

    data(){ return {
        list: [],
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

    },

    components: {
        ChatHistoryDateformat,
    }
}
</script>
