<script>
    import { Route } from "tinro";

    import ChatCn from "../../channels/chat/chat-cn.svelte";

    import Chat from "../chat/chat.svelte";
</script>

<main>
    <Route path="/chat">
        <ChatCn />
        <Chat />
    </Route>
</main>

<style>
</style>
