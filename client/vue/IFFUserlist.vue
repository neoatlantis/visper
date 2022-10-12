<template>

<ul class="list-group">

    <li class="list-group-item" v-for="each in identities">
        {{ each.identity }}
        
        <span class="badge badge-danger" v-if="each.inactive_countdown">
            Vanished
            ({{ Math.round(each.inactive_count / 1000) }})
        </span>
        <span class="badge badge-success" v-else>
            Tracking
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
