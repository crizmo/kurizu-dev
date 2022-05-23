<script>
    const serverWidth = "50px";
    
    function openNav() {
        document.getElementById("mySidenav").style.width = null;
        document.getElementById("mySidenav").style.transition = "width 0.5s";
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
                                src="https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp"
                                alt=""
                                width={serverWidth}
                                on:click="{openNav}"
                            />
                            <h3 class="hovertext">Kurizu</h3>
                        </div>
                    </div>
                    <div class="sidebar-content-servers-list-item">
                        <div class="sidebar-content-servers-list-item-icon">
                            <a href="https://github.com/crizmo" target="_blank">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
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
                                    src="https://logodownload.org/wp-content/uploads/2017/11/discord-logo-4-1.png"
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
                                    src="https://image.similarpng.com/very-thumbnail/2020/05/Glossy-Instagram-logo-PNG.png"
                                    alt=""
                                    width={serverWidth}
                                />
                            </a>
                            <h3 class="hovertext">Instagram</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

    .sidebar-content {
        height: calc(100% - 60px);
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
        z-index: 1;
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
            width: 40px;
            height: 40px;
            margin-right: 5px;
        }
    }
    
</style>
