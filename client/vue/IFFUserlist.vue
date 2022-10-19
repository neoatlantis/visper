<i18n>{
    en: {
        UFO: "Unidentified Foreign Officer",
        TRACKING: "Tracking",
        VANISHED: "Vanished",
    },

    zh: {
        UFO: "不明UFO",
        TRACKING: "正在跟踪",
        VANISHED: "消失",
    }
}</i18n>
<template>

<ul class="list-group">

    <li class="list-group-item" v-for="each in identities">
        <h5 class="card-title">{{ $t("UFO") }}</h5>
        {{ each.identity }}

        <span class="badge badge-danger" v-if="each.inactive_countdown">
            {{ $t("VANISHED") }}
            ({{ Math.round(each.inactive_count / 1000) }}s)
        </span>
        <span class="badge badge-success" v-else>
            {{ $t("TRACKING") }}
        </span>

    </li>


</ul>

</template>
<script>
import IFF from "app/IFF";

export default {
    mounted(){
        setInterval(()=>{
            // update user list
            this.identities = IFF.list_foreign_identities();
        }, 1000);
    },

    data(){ return {
        identities: [],
    } },

}
</script>
