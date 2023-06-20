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
            <h3 class="channel-name"># Cordle</h3>
            <div class="vl" />
            <p class="channel-info"> Wordle for programmers ! </p>
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
                                Cordle is a word-guessing game similar to Wordle, but with a twist: all of the words you'll be guessing are related to code and programming. <br>
                                This makes Cordle a fun and challenging way to test your knowledge of programming terminology and improve your vocabulary in this area. <br> <br>

                                You can play Cordle at <a href="https://cordle.vercel.app/" target="_blank">https://cordle.vercel.app</a> <br>
                                
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/1090594675670384731/1090594995876155392/cordle.png" alt="cordle" height="200px" width="auto" style="border-radius: 10px;" /> <br> <br>
                                Currently Words are manually added to the game, but I'm planning to add a feature to add words to the game from the game itself. <br>
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
                                <a href="https://github.com/crizmo/Cordle" target="_blank">Github</a> <br>
                                <a href="https://cordle.vercel.app/" target="_blank">Website</a> <br>
                                <a href="https://github.com/crizmo/Cordle">
                                    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/crizmo/cordle?style=social">
                                </a> <br>
                                <a href="https://www.producthunt.com/posts/cordle?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-cordle" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=393137&theme=dark" alt="Cordle - Wordle&#0032;for&#0032;programmers&#0032;&#0033; | Product Hunt" style="width: 150px; height: auto;" width="150" height="auto" /></a>

                                <br> <br>
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
