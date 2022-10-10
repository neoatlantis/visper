<template>

<LoginFrame v-if="!logged_in"></LoginFrame>
<div v-if="logged_in" class="container-fluid" style="height:100%">
    <div class="row" style="height:100%">
        <div class="bg-light col-3" style="padding: 1em">
            <IFF></IFF>
        </div>
        <div class="bg-dark col-9">
            <ChatHistory></ChatHistory>
            <ChatBox></ChatBox>
        </div>
    </div>
</div>


</template>
<script>

import session from "app/session";

import ChatHistory from "sfc/ChatHistory.vue";
import ChatBox     from "sfc/ChatBox.vue";
import IFF         from "sfc/IFF.vue";
import LoginFrame  from "sfc/LoginFrame.vue";

export default {

    data(){ return {
        logged_in: false,
    } },

    mounted(){
        session.on("logged-in", ()=>{
            this.logged_in = true;
        });
    },

    components: {
        LoginFrame,
        IFF,
        ChatHistory,
        ChatBox,
    }
}



</script>
