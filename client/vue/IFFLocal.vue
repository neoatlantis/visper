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
                <input id="channel-pwd" class="form-control form-control-sm" type="text" :value="pwddisplay" style="font-family:monospace" readonly>
            </div>
        </div>
    </div>
    <div style="padding-top: 0.3em">
        <StatusLED ref="led_tr" color="red">Transmission</StatusLED>
        &nbsp;
        <StatusLED ref="led_rc" color="green">Reception</StatusLED>
        &nbsp;
        <StatusLED ref="led_if" color="yellow">Interference</StatusLED>
    </div>
</template>
<script>
import StatusLED           from "sfc/StatusLED.vue";
import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
import IFFClass from "app/IFF";

export default {

    mounted(){
        IFFClass.on("broadcasted", ()=>{
            this.$refs["led_tr"].trigger();
        });
        IFFClass.on("received", ()=>{
            this.$refs["led_rc"].trigger();
        });
    },

    data(){ return {
        pwddisplay: "<Not set, click to change>",
    } },

    components: {
        IdentityFingerprint,
        StatusLED,
    }
}
</script>
