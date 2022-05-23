<script>
    import ServerTemp from './categories/server-temp.svelte'

    import Main from './categories/main.svelte'
    import Projects from './categories/projects.svelte'
    import Other from './categories/other.svelte'
</script>

<main>
    <div class="channels">
        <ServerTemp />
        <div class="categories">
            <Main />
            <br>
            <Projects />
            <br>
            <Other />
        </div>
    </div>
</main>

<style>
    .channels {
        position: absolute;
        width: 15%;
        height: 100%;
        /* text-align: left; */
        margin-left: 65px;
        background-color: #2f3136;
        top: 0%;
        color: rgb(255, 255, 255);
        z-index: 1;
    }
    
    .categories {
        text-align: left;
        margin-left: 10px;
    }
</style>
