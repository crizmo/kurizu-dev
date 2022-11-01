<script>
    import ServerTop from './servers/top.svelte';
    import ServerList from './servers/list-servers.svelte';
</script>

<main>
    <div class="sidebar">
        <ServerTop />
        <ServerList />
    </div>
</main>

<style>
    
    .sidebar {
        width: 90px;
        height: 100%;
        background-color: #2c2f33;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
    }

    @media screen and (max-width: 1500px) {
        .sidebar {
            width: 65px;
        }
    }
    
</style>
