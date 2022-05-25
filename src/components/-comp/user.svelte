<script>
    const serverWidth = "50px";
    export let pfp = "https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp";
    export let alt = "userpfp";
</script>

<main>
    <div class="chat-body-messages-item-avatar">
        <img
            src="{pfp}"
            alt="{alt}"
            width={serverWidth}
            />
    </div>
</main>

<style>
    .chat-body-messages-item-avatar {
        margin-left: 20px;
        position: absolute;
        overflow: hidden;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    @media screen and (max-width: 1500px) {
        .chat-body-messages-item-avatar img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
    }
</style>