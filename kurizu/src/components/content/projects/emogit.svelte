<script>
    

    const serverWidth = "50px";
    import User from '../../-comp/user.svelte';

    import { closeNav, openNav } from "../../channels/home/home-cn.svelte";

    import { swipe } from "svelte-gestures";
    let direction;

    function handler(event) {
        direction = event.detail.direction;

        if (window.innerWidth < 1500) {
            if (direction == "left") {
                closeNav();
            } else if (direction == "right") {
                openNav();
            }
        }
    }
</script>

<main>
    <div class="mainarea" use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div class="top-nav">
            <h3 class="channel-name"># EmoGit</h3>
            <div class="vl" />
            <p class="channel-info"> Git commit emotes </p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr class="channel-division" />
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                EmoGit is a web-based tool that allows you to easily add emojis to your commit messages. <br>
                                It provides a user-friendly interface that makes it simple and fun to incorporate expressive emojis into your Git workflow. <br> <br>

                                You can check out EmoGit <a href="https://emogit.vercel.app/" target="_blank">https://emogit.vercel.app/</a> <br> <br>
                                
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/1114182354441883658/1114839683772461066/emogit.png" alt="cordle" height="500px" width="auto" style="border-radius: 10px;" /> <br> <br>
                                EmoGit eliminates the need to remember emoji codes or manually type them in your commit messages.. <br>
                                I'm planning on making a desktop app for EmoGit in the future. <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Kurizu</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Oh and the code is open source too ! <br>
                                You can find the source code from links below : <br>
                                <a href="https://github.com/crizmo/EmoGit" target="_blank">Github</a> <br>
                                <a href="https://emogit.vercel.app/" target="_blank">Website</a> <br>
                                <a href="https://github.com/crizmo/EmoGit">
                                    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/crizmo/emogit?style=social">
                                </a> <br> <br>
                                If you want to contribute to the project, feel free to open a pull request on Github. <br>
                                If you have any suggestions or feedback, feel free to contact me on Discord (kurizu.taz) or 
                                <a href="https://discord.gg/drunkbetch-782646778347388959" target="_blank">Join the Discord Server</a> <br>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    main a {
        color: #38b9ec;
    }

</style>
