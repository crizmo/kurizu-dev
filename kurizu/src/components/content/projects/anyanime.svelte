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
            <h3 class="channel-name"># AnyAnime</h3>
            <div class="vl" />
            <p class="channel-info">Anyanime Npm & API</p>
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
                                AnyAnime is a NPM package that helps you get random anime pfp / images on use . <br>
                                It can be used in a discord bot or on a website or anywhere else.  <br>
                                Currently AnyAnime pkg and api has a database of over 600 unique anime pfps. <br>
                                <br>
                                To add more flexibility to the package i later made a API similar to the NPM package <br>
                                I would appreciate contributions to the API or the Npm package <br> <br>
                                Here's a link to the Npm package : <br>
                                <a href="https://www.npmjs.com/package/anyanime">NPM</a> |
                                <a href="https://github.com/crizmo/AnyAnime">Github</a>
                                <br> <br>
                                Here's a link to the API : <br>
                                <a href="https://rapidapi.com/Kurizu/api/any-anime/">API</a> |
                                <a href="https://github.com/crizmo/AnyAnime_api">Github</a>
                                <br> <br>
                                Website explaning the pkg + api :- <a href="https://anyanime-npm.netlify.app/">AnyAnime Docs</a> 
                                <br> <br>
                                <a href="https://www.npmjs.com/package/anyanime">
                                    <img alt="npm" src="https://img.shields.io/npm/dt/anyanime">
                                </a> <br>
                                <a href="https://github.com/crizmo/AnyAnime">
                                    <img alt="GitHub Repo" src="https://img.shields.io/github/stars/crizmo/AnyAnime?style=social">
                                </a>
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
                                Basic functions of the package : <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/970974362184343582/977082767978430544/Anyanime.png" alt="homepgimg" height="300px" width="auto" style="border-radius: 10px;">
                                <br>
                                Thanks for reading! If you have any questions or suggestions feel free to contact me on discord / instagram <br>
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
