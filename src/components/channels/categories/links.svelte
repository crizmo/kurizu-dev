<script>
</script>

<main>
    <div class="channels">
        <div class="categories">
            <details class="links" open>
                <summary>Links</summary>
                <hr width="50%">
                <div class="channels-list">
                    <button class="channelbtn">
                        <a href="a"># Links</a>
                    </button>
                    <button class="channelbtn">
                        <a href="a"># Links</a>
                    </button>
                </div>
            </details>
        </div>
    </div>
</main>

<style>

    .channels-list {
        margin-top: 0px;
        margin-left: 10px;
    }

    .channelbtn {
        background-color: #2c2d30;
        color: rgb(255, 255, 255);
        border-radius: 10px;
        width: 100%;
        text-align: left;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .channels-list a {
        color: rgb(158, 158, 158);
        text-decoration: none;
    }

    .channels-list a:hover {
        color: rgb(255, 255, 255);
        text-decoration: none;
    }
    
    summary {
        display: block;
    }

    summary::after {
        margin-left: 1ch;
        display: inline-block;
        transition: 0.2s;
        content: "\203A"; /* chevron */
    }

    details[open] summary::after {
        transform: rotate(90deg);
    }
</style>
