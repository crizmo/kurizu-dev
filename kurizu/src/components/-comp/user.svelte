<script>
    const serverWidth = "50px";
    export let pfp = "https://cdn.discordapp.com/attachments/977949070893125632/1010592002569682994/criz.jpg";
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
    .chat-body-messages-item-avatar img {
        margin-left: 20px;
        position: absolute;
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

    @media screen and (max-width: 800px) {
        .chat-body-messages-item-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
</style>