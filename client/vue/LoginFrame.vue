<template>

<div class="h-100 d-flex align-items-center justify-content-center">
    <div class="col-6">
        <div class="card">
            <div class="card-header bg-success text-white">
                Meet Point Coordinate
            </div>
            <div class="card-body">
                <div class="form-group">
                    <div class="input-group">
                        <input class="form-control" type="text" style="font-family:monospace" v-model="meetpoint" placeholder="e.g. 817.137, 132.373, 932.123, 292.132">
                        <div class="input-group-append">
                            <button class="input-group-text" @click="random_pick">Random Pick</button>
                        </div>
                    </div>
                    <small class="form-text text-muted">We use a four-element coordinate (at least 24 digits) to locate our very secret meeting point in 4D spacetime.</small>
                </div>
                <button type="submit" class="btn btn-success" @click="login" :disabled="!meetpoint_valid">Travel to meetpoint</button>
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
            setTimeout(this.login, 100);
        } else {
            setTimeout(this.random_pick, 100);
        }
        /// #endif
        return {
            meetpoint,
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
            setTimeout(this.login, 100);
            /// #endif
        },

        login(){
            localStorage.setItem("meetpoint", this.meetpoint);
            session.login(this.entry_seed);
        }
    }

}


</script>
