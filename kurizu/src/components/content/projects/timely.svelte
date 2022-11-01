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
            <h3 class="channel-name"># Timely</h3>
            <div class="vl" />
            <p class="channel-info">Timer + Todo</p>
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
                            <h3 style="color: #6596ff;">Timely-Note</h3>
                            <p>
                                Check how much time is left for your precious day to end + a small todo list. <br>
                                I personally think knowing how much time is left will increase productivity. That all !
                            </p>
                            <img class="msg-img" src="https://cdn.discordapp.com/attachments/1019262228953829496/1019262284461252648/timely.png" alt="timely">
                            <h4 style="color: #6596ff;">Contributing</h4>
                            <p>Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. <br>
                                Idk if you want to make the site / code better you can do so by opening an issue or a pull request.</p>
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
                                Timely project links : <br>
                                <a href="https://github.com/crizmo/Timely">Github</a> <br>
                                <a href="https://timely-note.vercel.app/">Website</a> <br>
                                <br>
                                Thank you for checking out ! <br>
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

    .msg-img {
        width: 100%;
        height: auto;
        max-width: 700px;
        border-radius: 5px;
    }

</style>
