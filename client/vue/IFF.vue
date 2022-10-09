<template>
    <div class="card">
        <div class="card-header bg-primary text-white">
            IFF: Identification of Friends and Foreigner
        </div>
        <div class="card-body">
            Your identification:
            <IdentityFingerprint></IdentityFingerprint>
        </div>
        <div class="card-header bg-secondary text-white">
            Contacts currently in this chat
        </div>
        <div class="card-body">
            Your chat messages will be sent only to trusted members. Check
            below the trust status of each member.
        </div>
        <div class="card-body" style="overflow-y: scroll; overflow-x: hidden; height: 40vh">
            <IFFUserlist></IFFUserlist>
        </div>
        <div class="card-header bg-secondary text-white">
            Checksum for your contacts
        </div>
        <div class="card-body">
            Compare numbers below with your contacts use other means of
            communication.
        </div>
    </div>

</template>
<script>
import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
import IFFUserlist from "sfc/IFFUserlist.vue";
export default {

    data(){ return {
    } },

    mounted(){
    },

    components: {
        IdentityFingerprint,
        IFFUserlist,
    }
}
</script>
