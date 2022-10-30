<script>
    const serverWidth = "50px";
    
    export function openNav() {
        document.getElementById("mySidenav").style.width = null;
        document.getElementById("mySidenav").style.transition = "width 0.5s";

        document.querySelector(".categories").style.opacity = "1";
    }

    export function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.transition = "width 0.5s";

        document.querySelector(".categories").style.opacity = "0";
    }

    function check(){
        setTimeout(() => {
            if (document.getElementById("mySidenav").style.width != "0" && document.getElementById("mySidenav").style.width != "0px") {
                closeNav();
                console.log("closed");
            } else {
                openNav();
            }
        }, 10);
    }

</script>

<main>
    <div class="sidebar">
        <div class="sidebar-content">
            <div class="sidebar-content-servers">
                <div class="sidebar-content-servers-list">
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <img
                                src="https://cdn.discordapp.com/attachments/977949070893125632/1010592002569682994/criz.jpg"
                                alt=""
                                width={serverWidth}
                                on:click="{openNav}"
                            />
                            <h3 class="hovertext">Kurizu</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="/chat">
                                <img
                                    src="https://media.tenor.com/wSBrGHQKQZ4AAAAM/panda-girl.gif"
                                    alt=""
                                    width={serverWidth}
                                    on:click={check}
                                />
                            </a>
                            <h3 class="hovertext">Chat</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://github.com/crizmo" target="_blank">
                                <img
                                    src="https://cdn3.iconfinder.com/data/icons/inficons/512/github.png"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Github</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://discord.gg/VcMPV8vc2x" target="_blank">
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/006/892/625/original/discord-logo-icon-editorial-free-vector.jpg"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Discord</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://www.instagram.com/criz_595/" target="_blank">
                                <img
                                    src="https://cdn.discordapp.com/attachments/977949070893125632/999254421416452176/instagram.png"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Instagram</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://twitter.com/Criz_595" target="_blank">
                                <img
                                    src="https://cdn.discordapp.com/attachments/977949070893125632/999254025302200380/unknown.png"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Twitter</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://hashnode.com/@Kurizu" target="_blank">
                                <img
                                    src="https://www.finsmes.com/wp-content/uploads/2021/08/hashnode.jpg"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Hashnode</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://replit.com/@kurizu" target="_blank">
                                <img
                                    src="https://media.discordapp.net/attachments/977949070893125632/999255947564285972/replit.png"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Replit</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    .sidebar-content {
        height: 100%;
        /* background-color: #2f3136; */
        padding: 0;
        margin: 0;
        text-align: center;
    }

    .sidebar-content-servers-list-item-icon {
        position: relative;
        display: inline-block;
        z-index: 2;
        margin: 5px;
    }

    .sidebar-content-servers-list-item-icon .hovertext {
        visibility: hidden;
        width: 120px;
        background-color: rgb(61, 60, 60);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        top: -5px;
        left: 110%;
        /* transition: opacity 0.3s; */
        z-index: 5;
    }

    .sidebar-content-servers-list-item-icon .hovertext::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 100%;
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent black transparent transparent;
        z-index: 2;
    }
    .sidebar-content-servers-list-item-icon:hover .hovertext {
        visibility: visible;
        z-index: 2;
    }

    .sidebar-content-servers-list-item-icon .hovertext:hover {
        opacity: 1;
        z-index: 2;
    }

    .sidebar-content-servers-list-item-icon img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .sidebar-content-servers-list-item-icon img:hover {
        border-radius: 10%;
        transition: all 0.3s ease-in-out;
    }

    @media screen and (max-width: 1500px) {

        .sidebar-content-servers-list-item-icon .hovertext {
            width: 70px;
            padding: 5px 0;
            font-size: small;
        }

        .sidebar-content-servers-list-item-icon img {
            width: 37px;
            height: 37px;
            margin-right: 5px;
        }
    }
    
</style>
