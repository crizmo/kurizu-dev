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
        background-color: #2f3136;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        /* overflow-x: hidden; */
    }
    
</style>
