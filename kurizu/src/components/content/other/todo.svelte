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

    const uncheck = "fas fa-solid fa-square";
    const check = "fas fa-solid fa-check";
    
</script>

<main>
    <script src="https://kit.fontawesome.com/8dc570c5d4.js" crossorigin="anonymous"></script>
    <div class="mainarea" use:swipe={{ timeframe: 500, minSwipeDistance: 0.1 }} on:swipe={handler}>
        <div class="top-nav">
            <h3 class="channel-name"># ToDo</h3>
            <div class="vl" />
            <p class="channel-info">Stuff i plan on doing someday lol</p>
            <!-- <span class="open-btn" on:click="{openNav}">&#9776;</span> -->
        </div>
        <hr class="channel-division" />
        <div class="chat-body">
            <div class="chat-body-messages">
                <div class="chat-body-messages-item">
                    <User />
                    <div class="chat-body-messages-item-content">
                        <div class="chat-body-messages-item-content-header">
                            <h3
                                class="chat-body-messages-item-content-header-name"
                            >
                                Kurizu
                            </h3>
                        </div>
                        <div class="chat-body-messages-item-content-body">
                            <h3 style="color: yellow;">Plans / To-do regarding this site</h3>
                            <p>
                                <i class="{check}"></i> | More better view for mobile devices
                                <br />
                                <i class="{uncheck}"></i> | Add more channels
                                <br />
                                <i class="{check}"></i> | Git posts 
                                <br>
                                <i class="{check}"></i> | Change color to original app color 
                                <br>
                                <i class="{check}"></i> | Add elina user in /elina-bot
                                <br>
                                <i class="{uncheck}"></i> | Change to a better image host
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    /* main a {
        color: #38b9ec;
    } */

</style>