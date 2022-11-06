<i18n>{

    zh: {
        TITLE: "应答机设定",
        DESC_TRANSPONDER_1: "应答机帮助您向对方证明自己的身份。为此，您需要在应答机中加载一个身份密钥。只要保管这一密钥，就可以让您的好友在未来的其他聊天中也会认出您的身份。",
        DESC_TRANSPONDER_2: "如果您没有自己的身份密钥，现在可以下载应答机中临时随机生成的密钥。您必须为这一密钥设定一个密码。",
        DESC_TRANSPONDER_3: "或者，您可以上传已有的密钥。",
        CHOOSE_ENCRYPTING_PASSWORD: "输入一个密码，保护身份密钥:",
        TYPE_INSTRUCTION: "至少6位",
        TYPE_AGAIN: "输入第二次以确认",
        DOWNLOAD: "下载",
        UPLOAD_FILE: "请上传文件:",
        PASTE_HERE: "或者将密钥粘贴到此处:",
        TYPE_DECRYPTING_PASSWORD: "请输入密码解密:",
        UPLOAD: "上传",
        UPLOAD_ERORR: "上传失败，请检查密钥文件和解密密码。",
    },

    en: {
        TITLE: "Transponder Settings",
        DESC_TRANSPONDER_1: "Transponder will help you proving your identity to friends. To start, you will have an identity key loaded onto transponder. Your friend could identify you in the future, as long as you load the transponder with same identity key.",
        DESC_TRANSPONDER_2: "If you don't have your identity key yet, currently a random key is generated for you. You can download it below. A password must be set for your identity key export.",
        DESC_TRANSPONDER_3: "Otherwise, you can upload this key now.",
        CHOOSE_ENCRYPTING_PASSWORD: "Choose a password to protect your identity key:",
        TYPE_INSTRUCTION: "At least 6 chars",
        TYPE_AGAIN: "Type again to confirm",
        DOWNLOAD: "Download",
        UPLOAD_FILE: "Please upload the key:",
        PASTE_HERE: "Or paste your key here:",
        TYPE_DECRYPTING_PASSWORD: "Input password to decrypt:",
        UPLOAD: "Upload",
        UPLOAD_ERORR: "Upload failed, check key file and password.",
    }

}</i18n>
<template>
<DialogBox ref="transponder-settings">
    <template #title>{{ $t("TITLE") }}</template>
    <p>{{ $t("DESC_TRANSPONDER_1") }}</p>
    <hr />

    <p>{{ $t("DESC_TRANSPONDER_2" )}}</p>

    <form class="form" @submit="$event.preventDefault();">
        <div class="form-group">
            <label>{{ $t("CHOOSE_ENCRYPTING_PASSWORD") }}</label>
            <div class="row">
                <div class="col"><input class="form-control" type="password" v-model="download_password1"/></div>
                <div class="col"><input class="form-control" type="password" v-model="download_password2" :placeholder="$t('TYPE_AGAIN')"/></div>
            </div>
        </div>
        <button class="btn btn-primary" type="submit" :disabled="!download_valid" @click="export_secret">{{$t("DOWNLOAD")}}</button>
    </form>

    <hr />
    <p>{{ $t("DESC_TRANSPONDER_3") }}</p>

    <form class="form" @submit="$event.preventDefault();">

        <div class="form-group row">
            <label class="col-sm-4" for="iff-transponder-upload-file-select">{{$t("UPLOAD_FILE")}}</label>
            <div class="col-sm-8">
                <input
                    type="file" class="form-control-file"
                    id="iff-transponder-upload-file-select"
                    accept=".asc"
                    @change="on_file_upload"
                />
            </div>
        </div>

        <div class="form-group">
            <label for="iff-transponder-upload-key-textarea">{{$t('PASTE_HERE')}}</label>
            <textarea class="form-control" style="font-family:monospace" id="iff-transponder-upload-key-textarea" rows="4" v-model="upload_text"></textarea>
        </div>

        <div class="form-group row">
            <label class="col-sm-4">{{$t("TYPE_DECRYPTING_PASSWORD")}}</label>
            <div class="col-sm-8">
                <input type="password" class="form-control" v-model="upload_password"/>
            </div>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="!upload_valid" @click="import_secret">{{$t("UPLOAD")}}</button>
        <span style="color:red" v-if="upload_error">&nbsp;&nbsp;{{ $t("UPLOAD_ERORR") }}</span>
    </form>

</DialogBox>
</template>
<script>
import DialogBox from "./DialogBox.vue";
import local_identity from "app/IFF/LocalIdentity";
import download_text from "app/lib/download_text"
import read_upload_file_text from "app/lib/read_upload_file_text";


export default {

    mounted(){
        local_identity.on("secret-export", (data)=>{
            this.exporting_secret = false;
            download_text("visper-identity-key.asc", data);
        });
    },

    data(){ return {
        exporting_secret: false,
        download_password1: "",
        download_password2: "",
        /// #if DEV
        download_password1: "testtest",
        download_password2: "testtest",
        /// #endif

        upload_text: "",
        upload_password: "",
        upload_error: false,
    } },

    components: {
        DialogBox,
    },

    methods: {
        show(){
            this.$refs["transponder-settings"].show();
        },

        export_secret(){
            this.exporting_secret = true;
            local_identity.export_secret(this.download_password1);
            this.download_password1 = this.download_password2 = "";
        },

        async on_file_upload(e){
            let text = await read_upload_file_text(e.target);
            this.upload_text = text;
        },

        async import_secret(){
            let result = await local_identity.import_secret(
                this.upload_text,
                this.upload_password
            );
            if(!result){
                // failure
                this.upload_error = true;
            } else {
                // success
                this.upload_error = false;
                this.upload_text = this.upload_password = "";
                this.$refs["transponder-settings"].hide();
            }
        },
    },

    computed: {
        download_valid(){
            return (
                !this.exporting_secret &&
                this.download_password1 == this.download_password2 &&
                this.download_password1.length >= 6
            );
        },

        upload_valid(){
            return (
                this.upload_password != "" &&
                this.upload_text != ""
            )
        }
    }

}

</script>
