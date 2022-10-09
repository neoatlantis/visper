<template>
    <div class="card">
        <div class="card-header bg-info text-white">
            IFF: Identification of Friends and Foreigner
        </div>
        <div class="card-body">
            Your identification:
            <IdentityFingerprint></IdentityFingerprint>
        </div>
    </div>


    <ul class="nav nav-pills flex-column mb-auto">
      <li>
        <a href="#" class="nav-link link-dark">
          Dashboard
        </a>
      </li>
    </ul>
</template>
<script>
import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
export default {

    data(){ return {
    } },

    mounted(){
    },

    components: {
        IdentityFingerprint,
    }
}
</script>
