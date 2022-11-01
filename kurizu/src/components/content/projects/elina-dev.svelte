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
            <h3 class="channel-name"># Elina</h3>
            <div class="vl" />
            <p class="channel-info">Yet another discord bot</p>
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
                                Elina is a multipurpose discord bot made using discord.js ! <br> <br>
                                Elina offers a lot of features, mainly games , genshin stats , chatbot and many more commands. <br>
                                You can find more about it on <a href="https://elina-bot.netlify.app/commands.html">Elina's website</a> <br>
                                <br>
                                Oh here she is ...  <br>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="chat-body-messages-item">
                    <User pfp="https://cdn.discordapp.com/avatars/842397001954230303/557d99168d42b845750241d8d7cd0f5b.webp" />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3 class="chat-body-messages-item-content-header-name">Elina</h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <p>
                                Hi i am Elina ! <br>
                                One more to the millions of multipurpose discord bots on discord. <br>
                                There's nothing too different that i do compared to all the major discord bots out there lol <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/939799133177384993/978893594125561916/commands.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 8px;">
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
                                Oh and elina is open source too ! <br>
                                You can find the source code from links below : <br>
                                <a href="https://github.com/crizmo/Elina-dev" target="_blank">Github</a> <br>
                                <a href="https://elina-bot.netlify.app/" target="_blank">Website</a> <br>
                                <a href="https://github.com/crizmo/Elina-dev">
                                    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/crizmo/elina-dev?style=social">
                                </a>

                                <br> <br>
                                The website has all the commands and info you need to know about Elina. <br>
                                Enjoy ! <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/912537423160942593/912537520150020156/elina_info.jpg" alt="homepgimg" height="150px" width="auto" style="border-radius: 8px;">
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
