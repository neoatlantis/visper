<i18n>{

    zh: {
        CLOSE: "关闭",
    },

    en: {
        CLOSE: "Close",
    }

}</i18n>

<template>
<!-- Modal -->
<div
    class="modal fade"
    v-bind:class="{'show':visible}"
    v-bind:style="{'display':visible?'block':'none'}"
    id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"><slot name="title"></slot></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" @click='visible=false'>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="visible=false">{{ $t("CLOSE") }}</button>
                <!--<button type="button" class="btn btn-primary">Save changes</button>-->
            </div>
        </div>
    </div>
</div>
</template>
<script>

export default {

    data(){ return {
        visible: false,
    } },

    methods: {
        show(){
            this.visible = true;
        },

        hide(){
            this.visible = false;
        }
    }

}

</script>
