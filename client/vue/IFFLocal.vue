<template>
    <div>
        <div class="form-group row">
            <label for="identity-fp" class="col-sm-2 col-form-label col-form-label-sm">ID</label>
            <div class="col-sm-10">
                <IdentityFingerprint></IdentityFingerprint>
            </div>
        </div>
        <div class="form-group row">
            <label for="channel-pwd" class="col-sm-2 col-form-label col-form-label-sm">PWD</label>
            <div class="col-sm-10">
                <input id="channel-pwd" class="form-control form-control-sm" type="password" v-model="password" placeholder="<Not set, type to set>" style="font-family:monospace">
            </div>
        </div>
    </div>
    <div style="padding-top: 0.3em">
        <StatusLED ref="led_tr" color="red">Transmission</StatusLED>
        &nbsp;
        <StatusLED ref="led_rc" color="green">Reception</StatusLED>
        &nbsp;
        <StatusLED ref="led_if" color="yellow" v-tooltip="'Someone in this channel did not get the correct password.'">Interference</StatusLED>
    </div>
</template>
<script>
import StatusLED           from "sfc/StatusLED.vue";
import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
import IFF from "app/IFF";

export default {

    mounted(){
        IFF.on("broadcasted", ()=>{
            this.$refs["led_tr"].trigger();
        });
        IFF.on("received", ()=>{
            this.$refs["led_rc"].trigger();
        });
        IFF.on("interference", ()=>{
            this.$refs["led_if"].trigger();
        });
    },

    data(){ return {
        password: "",
    } },

    watch: {
        password(){
            IFF.set_password(this.password);
        },
    },

    components: {
        IdentityFingerprint,
        StatusLED,
    }
}
</script>
