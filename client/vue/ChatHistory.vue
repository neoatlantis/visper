<template>
<div class="text-white">

    <div v-for="(entry, entry_i) in list">
        {{ entry }}
    </div>


</div>
</template>
<script>

export default {
    data(){ return {
        list: [
            "test",
        ]
    } },

    methods: {
        
    }
}
</script>
