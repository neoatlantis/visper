<template>
    <span>
    {{ fingerprint_display }}
    </span>
</template>

<script>
import identity from "app/crypto/identity";
const _ = require("lodash");

export default {
    data(){ return {
        fingerprint_hex: "",
    } },

    computed: {
        fingerprint_display: function(){
            const str = this.fingerprint_hex.toUpperCase();
            return _.map(_.chunk(str, 8), (e)=>e.join("")).join("-");
        },
    },

    mounted(){
        identity.on("created", ()=>{
            this.fingerprint_hex = identity.get_public_key();
        });
        identity.generate();
    },

};

</script>
