<i18n>{
    en: {
        IFF_TITLE: "IFF: Identification Friends and Foreigners",
        RADAR_TITLE: "Four-dimensional Space Radar",
    },

    zh: {
        IFF_TITLE: "IFF: 好友及陌生人识别系统",
        RADAR_TITLE: "四维空间雷达",
    }
}</i18n>
<template>
    <div class="card">
        <div class="card-header bg-primary text-white">
            {{ $t("IFF_TITLE") }}
        </div>
        <div class="card-body">
            <IFFLocal></IFFLocal>
        </div>
        <div class="card-header bg-secondary text-white">
            {{ $t("RADAR_TITLE") }}
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
import IFFLocal    from "sfc/IFFLocal.vue";
import IFFUserlist from "sfc/IFFUserlist.vue";

export default {

    data(){ return {
    } },

    components: {
        IFFLocal,
        IFFUserlist,
    }
}
</script>
