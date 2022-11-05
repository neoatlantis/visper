<i18n>{
    en: {
        TRANSMISSION: "TX",
        RECEPTION: "RX",
        INTERFERENCE: "Interference",
        TRANSPONDER_SETTINGS: "TPDR Settings...",
    },

    zh: {
        TRANSMISSION: "发送",
        RECEPTION: "接收",
        INTERFERENCE: "干扰",
        TRANSPONDER_SETTINGS: "应答机设定...",
    }
}</i18n>
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
        <StatusLED ref="led_tr" color="red">{{ $t("TRANSMISSION") }}</StatusLED>
        &nbsp;
        <StatusLED ref="led_rc" color="green">{{ $t("RECEPTION") }}</StatusLED>
        &nbsp;
        <StatusLED ref="led_if" color="yellow" v-tooltip="'Someone in this channel did not get the correct password.'">{{ $t("INTERFERENCE") }}</StatusLED>
        <div class="float-right">
            <button class="btn btn-link" style="margin:0; padding:0" @click="show_transponder_settings">{{ $t("TRANSPONDER_SETTINGS") }}</button>
        </div>
    </div>

    <IFFTransponderSettings ref="transponder-settings-dialog"></IFFTransponderSettings>
</template>
<script>
import StatusLED                from "sfc/StatusLED.vue";
import IdentityFingerprint      from "sfc/IdentityFingerprint.vue";
import IFFTransponderSettings   from "sfc/IFFTransponderSettings.vue";

import IFF                      from "app/IFF";


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

    methods: {
        show_transponder_settings(){
            this.$refs["transponder-settings-dialog"].show();
        }
    },

    components: {
        IdentityFingerprint,
        StatusLED,
        IFFTransponderSettings,
    }
}
</script>
