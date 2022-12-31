<script>
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
            <h3 class="channel-name"># Image2url</h3>
            <div class="vl" />
            <p class="channel-info">Image to url npm package</p>
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
                                With the help of the <a href="https://www.npmjs.com/package/image2url">image2url</a> npm package <br>
                                You can easily convert images to urls <br>
                                <br>
                                Post images to a discord channel and get the proxy url <br> 
                                I would appreciate contributions to the project <br>
                                <br>

                                Links : <br>
                                <a href="https://www.npmjs.com/package/image2url">NPM</a> |
                                <a href="https://github.com/crizmo/image2url">Github</a>
                                <br> <br>
                                <a href="https://www.npmjs.com/package/image2url">
                                    <img alt="npm" src="https://img.shields.io/npm/dt/image2url">
                                </a> <br>
                                <a href="https://github.com/crizmo/image2url">
                                    <img alt="GitHub Repo" src="https://img.shields.io/github/stars/crizmo/image2url?style=social">
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
                                Usage : <br> <br>
                                <img class="msg-img" src="https://cdn.discordapp.com/attachments/1057946322721849436/1058673207424585738/image.png" alt="homepgimg" height="350px" width="auto" style="border-radius: 10px;">
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
