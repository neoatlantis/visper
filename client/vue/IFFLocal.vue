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
        <span
            class="badge"
            :class='{ "badge-danger": transmitting, "badge-secondary": !transmitting, "badge-dimmed": !transmitting }'
        >Transmission</span>
        &nbsp;
        <span
            class="badge"
            :class='{ "badge-success": receiving, "badge-secondary": !receiving, "badge-dimmed": !receiving }'
        >Reception</span>
        &nbsp;
        <span
            class="badge"
            :class='{ "badge-warning": interference, "badge-secondary": !interference, "badge-dimmed": !interference }'
        >Interference</span>
    </div>
</template>
<script>
import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
import IFFClass from "app/IFF";

export default {

    mounted(){
        IFFClass.on("broadcasted", ()=>{
            this.transmitting = true;
            setTimeout(()=>{ this.transmitting = false }, 400);
        });
    },

    data(){ return {
        transmitting: false,
        receiving: false,
        pwddisplay: "<Not set, click to change>",
        interference: false,
    } },

    components: {
        IdentityFingerprint,
    }
}
</script>
