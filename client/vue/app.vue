<template>



<!--
 <div class="d-flex flex-column flex-shrink-0 p-3 bg-light col-4">
    <div class="card">
        <div class="card-header bg-info text-white">
            Security Monitor
        </div>
        <div class="card-body">
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
</div>
-->

<LoginFrame></LoginFrame>



</template>
<script>

import IdentityFingerprint from "sfc/IdentityFingerprint.vue";
import LoginFrame from "sfc/LoginFrame.vue";

export default {
    components: {
        IdentityFingerprint,
        LoginFrame,
    }
}



</script>
