<i18n>{

    en: {
        JOIN_A_CHAT: "Join a chat",
        TITLE_MEETPOINT_COORDINATE: "Meetpoint coordinate",
        RANDOM_PICK: "Random Pick",
        SERVER_URL: "Server URL",
        TRAVEL_TO_MEETPOINT: "Travel to meetpoint",
        DESC_COORDINATE: "We use a four-element coordinate (at least 24 digits) to locate our very secret meeting point in 4D spacetime.",
        DESC_SERVER_URL: "Don't change if you don't know why. But you can choose to join another server rather than this and chat with more people.",
    },

    zh: {
        JOIN_A_CHAT: "加入聊天",
        TITLE_MEETPOINT_COORDINATE: "会面坐标点",
        RANDOM_PICK: "随机选取",
        SERVER_URL: "服务器网址",
        TRAVEL_TO_MEETPOINT: "前往会面坐标点",
        DESC_COORDINATE: "使用一组四元素的坐标，包含至少24个数字，来定位我们在四维空间中的秘密会面地点。",
        DESC_SERVER_URL: "如果您不知道此处的含义，请勿改动。设置服务器网址可以让您连接到本网站以外的其他聊天室。",
    }

}</i18n>
<template>

<div class="h-100 d-flex align-items-center justify-content-center">
    <div class="col-6">
        <div class="card">
            <div class="card-header bg-success text-white">
                {{ $t("JOIN_A_CHAT") }}
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="input-meetpoint">{{ $t("TITLE_MEETPOINT_COORDINATE") }}:</label>
                    <div class="input-group input-group-sm">
                        <input id="input-meetpoint" class="form-control" type="text" style="font-family:monospace" v-model="meetpoint" placeholder="e.g. 817.137, 132.373, 932.123, 292.132">
                        <div class="input-group-append">
                            <span class="input-group-text" @click="random_pick">{{ $t("RANDOM_PICK") }}</span>
                        </div>
                    </div>
                    <small class="form-text text-muted">{{ $t("DESC_COORDINATE") }}</small>
                </div>

                <div class="form-group">
                    <label for="input-server">{{ $t("SERVER_URL") }}:</label>
                    <input id="input-server" class="form-control" type="text" style="font-family:monospace" v-model="server" required>
                    <small class="form-text text-muted">{{ $t("DESC_SERVER_URL") }}</small>
                </div>

                <button type="submit" class="btn btn-success" @click="login" :disabled="!meetpoint_valid">{{ $t("TRAVEL_TO_MEETPOINT") }}</button>
            </div>
        </div>
    </div>
</div>

</template>
<script>

import nacl from "tweetnacl";
import session from "app/session";
const _ = require("lodash");

export default {

    data(){
        let meetpoint = "";
        if(localStorage.getItem("meetpoint")){
            meetpoint = localStorage.getItem("meetpoint");
        }
        /// #if DEV
        if(meetpoint){
            //setTimeout(this.login, 100);
        } else {
            setTimeout(this.random_pick, 100);
        }
        /// #endif
        return {
            meetpoint,
            server: "/",
        }
    },

    computed: {
        entry_seed: function(){
            return this.meetpoint.toString().replace(/[^0-9\-]/g, "");
        },

        meetpoint_valid: function(){
            return this.entry_seed && this.entry_seed.length >= 24;
        }
    },

    methods: {
        random_pick(){
            let random_bytes = nacl.randomBytes(32);
            let eight_numbers = new Uint32Array(random_bytes.buffer);
            let numbers =  Array.from(eight_numbers);
            this.meetpoint = [
                `Lat=${(numbers[0] % 180) - 90}.${numbers[1] % 100000}`,
                `Lng=${(numbers[2] % 360) - 180}.${numbers[3] % 100000}`,
                `R=${numbers[4] % 6371}.${numbers[5] % 100000}`,
                `t=${numbers[6] % 10000}.${numbers[7] % 100000}`,
            ].join(", ");

            /// #if DEV
            this.meetpoint = "1234567891234565789123456789123456789123456789";
            //setTimeout(this.login, 100);
            /// #endif
        },

        login(){
            localStorage.setItem("meetpoint", this.meetpoint);
            session.start({ server: this.server });
            session.login(this.entry_seed);
        }
    }

}


</script>
