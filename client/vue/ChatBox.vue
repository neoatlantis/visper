<i18n>{

    en: {
        SEND_MESSAGE: "Send Message",
    },

    zh: {
        SEND_MESSAGE: "发送消息",
    }

}</i18n>
<template>

<div style="height:18vh; border-radius: 0.5em; padding: 0.5em;" class="bg-light">
    <div class="row" style="height:100%">
        <div class="col col-10" style="height:100%">
            <textarea class="form-control" style="
                padding: 0.5em; margin-bottom: 1vh; resize: none; width:100%; height:100%;
                background-color: #FFFFFF00; border: none; border-radius: 0.5em;
            "
                v-model="message"
                @keypress="on_chatbox_keypress"
            ></textarea>
        </div>
        <div class="col col-2">
            <button
                class="btn btn-primary" style="width:100%"
                :disabled="!send_allowed"
                @click="send_message"
            >{{ $t("SEND_MESSAGE") }}</button>
        </div>
    </div>
</div>

</template>
<script>

import IFF from "app/IFF";
import EphermalKeys from "app/EphermalKeys";
import messaging from "app/messaging";
import ChatHistory from "app/ChatHistory";

export default {

    mounted(){
        ChatHistory.on("sent", ()=>{
            this.message = "";
        });

    },

    data(){ return {
        message: "",
        /// #if DEV
        message: "test",
        /// #endif
    } },

    computed: {
        send_allowed: function(){
            return this.message.trim() != "";
        }
    },

    methods: {
        send_message(){
            messaging.Sender.text({ text: this.message });
        },

        on_chatbox_keypress(e){
            if(e.shiftKey && e.key == "Enter"){
                this.send_message();
                e.preventDefault();
            }
        },
    }


}


</script>
